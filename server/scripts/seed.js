const db = require('@models/index')
const logger = require('@util/logger')
const { v4: uuid } = require('uuid')
const { data, facultyMap } = require('@root/config/data')

const seedFacultiesAndStudyprogrammes = async () => {
  await db.companionFaculty.destroy({ where: {} })
  await db.studyprogramme.destroy({ where: {} })
  await db.faculty.destroy({ where: {} })

  /**
   * Create faculties
   */
  data.forEach(async faculty => {
    const { code, name } = faculty
    await db.faculty.create({
      code,
      name,
    })
  })

  /**
   * Create studyprogrammes
   */
  data.forEach(async faculty => {
    const { code, programmes } = faculty
    const primaryFaculty = await db.faculty.findOne({ where: { code } })

    programmes.forEach(async programme => {
      const { key, name, level, international } = programme
      await db.studyprogramme.create({
        key,
        name,
        level,
        international,
        locked: false,
        claimed: false,
        primaryFacultyId: primaryFaculty.id,
      })
    })
  })

  /**
   * Create companionFaculties "kumppanuusohjelma"
   */

  data.forEach(async faculty => {
    const { programmes } = faculty

    programmes.forEach(async programme => {
      const { key, companionFaculties } = programme

      companionFaculties.forEach(async companion => {
        const facultyCode = facultyMap[companion]

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
      })
    })
  })
}

const seedTokens = async () => {
  await db.token.destroy({ where: {} })
  const studyprogrammes = await db.studyprogramme.findAll()

  studyprogrammes.forEach(async programme => {
    const { key } = programme
    await db.token.create({
      url: uuid(),
      programme: key,
      type: 'ADMIN',
      valid: true,
      usageCounter: 0,
    })
    await db.token.create({
      url: uuid(),
      programme: key,
      type: 'READ',
      valid: true,
      usageCounter: 0,
    })
    await db.token.create({
      url: uuid(),
      programme: key,
      type: 'WRITE',
      valid: true,
      usageCounter: 0,
    })
  })

  // Create tokens for faculty wide read-links:
  const faculties = await db.faculty.findAll()
  faculties.forEach(async faculty => {
    await db.token.create({
      url: uuid(),
      faculty: faculty.code,
      type: 'READ',
      valid: true,
      usageCounter: 0,
    })
    await db.token.create({
      url: uuid(),
      faculty: faculty.code,
      type: 'READ_DOCTOR',
      valid: true,
      usageCounter: 0,
    })
  })
}

const seed = async () => {
  logger.info('Seeding ...')
  const seedTokensAswell = process.argv[3] && process.argv[3].substr(2) === 'tokens'

  await seedFacultiesAndStudyprogrammes()

  // Sometimes we might want to seed faculties and studyprogrammes, but leave tokens untouched
  if (seedTokensAswell) {
    logger.info('Seeding tokens aswell')
    await seedTokens()
  }

  logger.info('Seeding completed')
}

module.exports = { seed }
