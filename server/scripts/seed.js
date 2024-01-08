/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const db = require('@models/index')
const logger = require('@util/logger')
const { data, facultyMap } = require('@root/config/data')

const seedFacultiesAndStudyprogrammes = async () => {
  await db.companionFaculty.destroy({ where: {} })
  await db.studyprogramme.destroy({ where: {} })
  await db.faculty.destroy({ where: {} })

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
        name,
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
  // Create UNI
  await db.faculty.create({
    code: 'UNI',
    name: {
      fi: 'Yliopistotaso',
      en: 'University level',
      se: 'Universitetsnivå',
    },
  })

  const uniFaculty = await db.faculty.findOne({
    where: {
      code: 'UNI',
    },
  })

  db.studyprogramme.create({
    key: 'UNI',
    name: uniFaculty.name,
    level: 'UNI',
    international: false,
    lockedForms: { yearly: false, 'degree-reform': false, evaluation: false, 'evaluation-faculty': false },
    claimed: false,
    primaryFacultyId: uniFaculty.id,
  })
}

const seed = async () => {
  logger.info('Seeding ...')
  await seedFacultiesAndStudyprogrammes()
  logger.info('Seeding completed')
}

module.exports = { seed }
