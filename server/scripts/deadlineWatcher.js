const { Op } = require('sequelize')
const cron = require('node-cron')
const moment = require('moment')

const db = require('@models/index')
const logger = require('@util/logger')

const loggerPrefix = 'Cronjob::deadlineWatcher | '

const startDeadlineWatcher = async () => {
  // 1 min before midnight: 59 23 * * *
  cron.schedule('59 23 * * *', async () => {
    logger.info(`${loggerPrefix} Checking if there's a deadline that closes today...`)

    const upcomingDeadlines = await db.deadline.findAll({
      order: [['date', 'ASC']],
    })

    const deadlinedate = upcomingDeadlines[0] ? upcomingDeadlines[0].date : undefined
    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    if (deadlinedate && draftYear) {
      const deadlineIsToday = moment().isSame(moment(deadlinedate), 'day')

      if (deadlineIsToday) {
        logger.info(`${loggerPrefix} Today is the deadline, taking backups...`)

        const programmes = await db.studyprogramme.findAll({})

        programmes.forEach(async programme => {
          const { key } = programme

          const tempAnswers = await db.tempAnswer.findOne({
            where: {
              [Op.and]: [{ programme: key, year: draftYear }],
            },
          })

          const answer = await db.answer.findOne({
            where: {
              [Op.and]: [{ programme: key }, { year: draftYear }],
            },
          })

          const acualAnswers = tempAnswers ? tempAnswers.data : {}

          if (answer) {
            answer.data = acualAnswers
            await answer.save()
          } else {
            await db.answer.create({
              data: acualAnswers,
              programme: key,
              year: draftYear,
              submittedBy: 'cronJob',
            })
          }

          programme.locked = true

          await programme.save()
        })

        await db.deadline.destroy({
          truncate: true,
        })
        await db.draftYear.destroy({
          truncate: true,
        })
      }
    }
  })
  logger.info('Deadline job started')
}

module.exports = {
  startDeadlineWatcher,
}
