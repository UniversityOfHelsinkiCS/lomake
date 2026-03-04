/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
// import { Op } from 'sequelize'
import logger from '../util/logger.js'
import { facultyMap } from '../../config/data.js'
import { getOrganisationData } from '../util/jami.js'
import Studyprogramme from '../models/studyprogramme.js'
import Faculty from '../models/faculty.js'
import CompanionFaculty from '../models/companionFaculty.js'

const seedFacultiesAndStudyprogrammes = async () => {
  const data = await getOrganisationData()

  const facultyCodes = (
    await Faculty.findAll({
      attributes: ['code'],
    })
  ).map(f => f.code)

  const existingFaculties = []
  for (const { code, name } of data) {
    if (facultyCodes.includes(code)) {
      existingFaculties.push(code)
      await Faculty.update(
        {
          name: { fi: name.fi, se: name.sv, en: name.en },
        },
        {
          where: {
            code,
          },
        },
      )
    } else {
      existingFaculties.push(code)
      await Faculty.create({
        code,
        name: { fi: name.fi, se: name.sv, en: name.en },
      })
    }
  }

  const existingStudyProgrammeKeys = []
  const studyProgrammeKeys = (await Studyprogramme.findAll({ attributes: ['key'] })).map(p => p.key)
  for (const { code, programmes } of data) {
    const primaryFaculty = await Faculty.findOne({ where: { code } })

    for (const { key, name, level, international } of programmes) {
      if (studyProgrammeKeys.includes(key)) {
        existingStudyProgrammeKeys.push(key)
        await Studyprogramme.update(
          {
            name: { fi: name.fi, se: name.sv, en: name.en },
            level,
            international,
            primaryFacultyId: primaryFaculty.id,
          },
          {
            where: {
              key,
            },
          },
        )
      } else {
        existingStudyProgrammeKeys.push(key)
        await Studyprogramme.create({
          key,
          name: { fi: name.fi, se: name.sv, en: name.en },
          level,
          international,
          lockedForms: { yearly: false, 'degree-reform': false, evaluation: false, 'evaluation-faculty': false },
          claimed: false,
          primaryFacultyId: primaryFaculty.id,
        })
      }
    }
  }

  // Create companionFaculties "kumppanuusohjelma"
  for (const { programmes } of data) {
    for (const { key, companionFaculties } of programmes) {
      for (const faculty of companionFaculties) {
        const facultyCode = facultyMap[faculty]

        const facultyId = (
          await Faculty.findOne({
            where: {
              code: facultyCode,
            },
          })
        ).id

        const studyprogrammeId = (
          await Studyprogramme.findOne({
            where: {
              key,
            },
          })
        ).id
        const companionFaculty = await CompanionFaculty.findOne({
          where: {
            facultyId,
            studyprogrammeId,
          },
        })
        if (!companionFaculty) {
          await CompanionFaculty.create({
            facultyId,
            studyprogrammeId,
          })
        }
      }
    }
  }
  // Check if this is needed fucntionality, if not please delete
  // const removedFaculties = facultyCodes.filter(code => !existingFaculties.includes(code))
  // const removedProgrammes = studyProgrammeKeys.filter(key => !existingStudyProgrammeKeys.includes(key))

  // if (removedProgrammes.length > 0 || removedFaculties.length > 0) {
  //   const facultiesToBeRemoved = (
  //     await Faculty.findAll({
  //       where: {
  //         code: removedFaculties,
  //       },
  //       attributes: ['id'],
  //     })
  //   ).map(f => f.id)
  //   const programmesToBeRemoved = (
  //     await Faculty.findAll({
  //       where: {
  //         code: removedProgrammes,
  //       },
  //       attributes: ['id'],
  //     })
  //   ).map(p => p.id)

  //   CompanionFaculty.destroy({
  //     where: {
  //       [Op.or]: [
  //         {
  //           facultyId: facultiesToBeRemoved,
  //         },
  //         {
  //           studyprogrammeId: programmesToBeRemoved,
  //         },
  //       ],
  //     },
  //   })
  // }
  // if (removedProgrammes.length > 0) {
  //   Studyprogramme.destroy({ key: removedProgrammes })
  // }

  // if (removedFaculties.length > 0) {
  //   Faculty.destroy({ code: removedFaculties })
  // }
}

const seed = async () => {
  logger.info('Seeding ...')
  await seedFacultiesAndStudyprogrammes()
  logger.info('Seeding completed')
}

export default seed
