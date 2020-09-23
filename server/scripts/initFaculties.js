const db = require('@models/index')
const logger = require('@util/logger')
const { uuid } = require('uuidv4')
const faculties = require('@util/faculties.json')
const Sequelize = require('sequelize')
const Op = Sequelize.Op

const initFaculties = async () => {
  try {
    logger.info(`Initializing faculties...`)
    await db.faculty.destroy({ where: {} })

    const facultyObjects = Object.entries(faculties).map((faculty) => {
      const code = faculty[0]
      const name = faculty[1].name
      const programmes = faculty[1].programmes.map((p) => p.code)

      return {
        code,
        name,
        programmes,
      }
    })

    for (const faculty of facultyObjects) {
      const { code, name, programmes: progs } = faculty

      await db.faculty.create({
        code,
        programmes: progs,
        name,
      })
    }

    // Then create keys for faculty wide links:
    const data = await db.faculty.findAll()

    // Remove existing faculty wide tokens:
    await db.token.destroy({
      where: {
        faculty: {
          [Op.not]: null,
        },
      },
    })

    // Create special faculty wide read and read-doctor tokens:
    for (const fac of data) {
      await db.token.create({
        url: uuid(),
        faculty: fac.code,
        type: 'READ',
        valid: true,
        usageCounter: 0,
      }),
        await db.token.create({
          url: uuid(),
          faculty: fac.code,
          type: 'READ_DOCTOR',
          valid: true,
          usageCounter: 0,
        })
    }
  } catch (error) {
    logger.error(`Failed to create faculties: ${error}`)
  }
}
module.exports = {
  initFaculties,
}
