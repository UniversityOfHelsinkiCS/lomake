const { Op } = require('sequelize')
const db = require('@models/index')
const logger = require('@util/logger')

const LOMAKE_SINCE_YEAR = 2019

const getYearsArray = since => {
  const years = []
  for (let i = since; i <= new Date().getFullYear(); i++) {
    const year = i
    years.push(year)
  }
  return years
}

const createTempAnswers = async () => {
  logger.info(`Creating empty temp answers `)

  try {
    const programmes = await db.studyprogramme.findAll({})
    const years = getYearsArray(LOMAKE_SINCE_YEAR)

    years.forEach(async currentYear => {
      programmes.forEach(async programme => {
        const { key } = programme

        const tempAnswer = await db.tempAnswer.findOne({
          where: {
            [Op.and]: [{ programme: key }, { year: currentYear }],
          },
        })

        if (!tempAnswer) {
          await db.tempAnswer.create({
            data: {},
            programme: key,
            year: currentYear,
          })
        }
      })
    })
    logger.info(`TempAnswers succesfully created`)
  } catch (error) {
    logger.error(`Error creating tempAnswers: ${error}`)
  }
}

module.exports = { createTempAnswers }
