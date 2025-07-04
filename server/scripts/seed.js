/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import db from '../models/index.js'

import logger from '../util/logger.js'

import { facultyMap } from '../../config/data.js'
import { getOrganisationData } from '../util/jami.js'

const seedFacultiesAndStudyprogrammes = async () => {
  await db.companionFaculty.destroy({ where: {} })
  await db.studyprogramme.destroy({ where: {} })
  await db.faculty.destroy({ where: {} })

  const data = await getOrganisationData()

  /**
   * Create faculties
   */
  for (const { code, name } of data) {
    await db.faculty.create({
      code,
      name,
    })
  }

  /**
   * Create studyprogrammes
   */
  for (const { code, programmes } of data) {
    const primaryFaculty = await db.faculty.findOne({ where: { code } })

    for (const { key, name, level, international } of programmes) {
      await db.studyprogramme.create({
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
          await db.faculty.findOne({
            where: {
              code: facultyCode,
            },
          })
        ).id

        const studyprogrammeId = (
          await db.studyprogramme.findOne({
            where: {
              key,
            },
          })
        ).id

        await db.companionFaculty.create({
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
