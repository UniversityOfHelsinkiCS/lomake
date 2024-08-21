import { Op } from 'sequelize'
import db from '../models/index.js'
import logger from '../util/logger.js'
import { getYearsArray, LOMAKE_SINCE_YEAR } from '../../config/common.js'

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

export default createTempAnswers
