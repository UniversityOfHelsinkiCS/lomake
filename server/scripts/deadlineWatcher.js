import { schedule } from 'node-cron'
import db from '../models/index.js'
import moment from 'moment'

import logger from '../util/logger.js'

const loggerPrefix = 'Cronjob::deadlineWatcher | '

// oxlint-disable-next-line typescript/require-await
const startDeadlineWatcher = async () => {
  // 5 min before midnight: 55 23 * * *
  schedule('55 23 * * *', async () => {
    logger.info(`${loggerPrefix} Checking if there's a deadline that closes today...`)

    const upcomingDeadlines = await db.deadline.findAll({
      order: [['date', 'ASC']],
    })

    const deadlinesToday =
      upcomingDeadlines.length > 0 ? upcomingDeadlines.filter(d => moment().isSame(moment(d.date), 'day')) : null

    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    if (deadlinesToday && deadlinesToday.length > 0 && draftYear) {
      logger.info(`${loggerPrefix} Today is a deadline, taking backups...`)

      await deadlinesToday.forEach(async ({ form }) => {
        logger.info(`${loggerPrefix} Deleting deadlines for ${form}...`)

        await db.deadline.destroy({
          where: { form },
        })
      })

      // if no deadlines remain, lock programmes and destroy draftyear
      // TODO: check if used anymore
      if (upcomingDeadlines.length === deadlinesToday?.length) {
        await db.draftYear.destroy({
          truncate: true,
        })
      }
      logger.info(`${loggerPrefix} deadline cron job finished.`)
    } else {
      logger.info(`${loggerPrefix} No deadlines today`)
    }
  })
  logger.info('Deadline job started')
}

export default startDeadlineWatcher
