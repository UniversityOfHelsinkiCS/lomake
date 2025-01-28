import { Op } from 'sequelize'
import db from '../models/index.js'
import Report from '../models/reports.js'
import logger from '../util/logger.js'
import { getYearsArray, LOMAKE_SINCE_YEAR } from '../../config/common.js'

const initReports = async () => {
  const programmes = await (db as { studyprogramme: any }).studyprogramme.findAll({})
  const years = getYearsArray(LOMAKE_SINCE_YEAR)

  years.forEach(async (currentYear: number) => {
    try {
      programmes.forEach(async ({ id }: {id: number}) => {
        const report = await Report.findOne({
          where: {
            [Op.and]: [{ studyprogrammeId: id }, { year: currentYear }],
          },
        })

        if (!report) {
          await Report.create({
            studyprogrammeId: id,
            year: currentYear,
            comments: {},
            studyprogrammeMeasures: {},
            facultyMeasures: {},
          })
        }
      })
    } catch (error: any) {
      logger.error('Error in initReports', error)
    }
  })
}

export default initReports