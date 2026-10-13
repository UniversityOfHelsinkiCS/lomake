/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { Op } from 'sequelize'
import db from '../models/index.js'
import logger from '../util/logger.js'
import { defaultYears } from '../../config/common.js'
import Studyprogramme from '../models/studyprogramme.js'

const createTempAnswers = async () => {
  logger.info(`Creating empty temp answers `)

  try {
    const programmes = await Studyprogramme.findAll({})
    // TODO: archive side, investigate, if functionality needed in tests
    const years = defaultYears

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
