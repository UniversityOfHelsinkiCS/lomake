/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import logger from '../util/logger.js'

import { facultyMap } from '../../config/data.js'
import { getOrganisationData } from '../util/jami.js'
import Studyprogramme from '../models/studyprogramme.js'
import Faculty from '../models/faculty.js'
import CompanionFaculty from '../models/companionFaculty.js'

const seedFacultiesAndStudyprogrammes = async () => {
  await CompanionFaculty.destroy({ where: {} })
  await Studyprogramme.destroy({ where: {} })
  await Faculty.destroy({ where: {} })

  const data = await getOrganisationData()

  /**
   * Create faculties
   */
  for (const { code, name } of data) {
    await Faculty.create({
      code,
      name,
    })
  }

  /**
   * Create studyprogrammes
   */
  for (const { code, programmes } of data) {
    const primaryFaculty = await Faculty.findOne({ where: { code } })

    for (const { key, name, level, international } of programmes) {
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

  /**
   * Create companionFaculties "kumppanuusohjelma"
   */

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

        await CompanionFaculty.create({
          facultyId,
          studyprogrammeId,
        })
      }
    }
  }
}

const seed = async () => {
  logger.info('Seeding ...')
  await seedFacultiesAndStudyprogrammes()
  logger.info('Seeding completed')
}

export default seed
