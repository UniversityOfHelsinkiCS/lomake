import { Op } from 'sequelize'
import db from '../models/index.js'
import Report from '../models/reports.js'
import logger from '../util/logger.js'

const initReports = async () => {
  const programmes = await (db as { studyprogramme: any }).studyprogramme.findAll({})
  const years = [2025]

  years.forEach(async (currentYear: number) => {
    try {
      programmes.forEach(async ({ id, key }: { id: number, key: string }) => {
        const report = await Report.findOne({
          where: {
            [Op.and]: [{ studyprogrammeId: id }, { year: currentYear }],
          },
        })

        if (!report) {
          await Report.create({
            studyprogrammeId: id,
            studyprogrammeKey: key,
            year: currentYear,
            data: {},
          })
        }
      })
    } catch (error: any) {
      logger.error('Error in initReports', error)
    }
  })
}

export default initReports
