const cron = require('node-cron')
const db = require('@models/index')
const logger = require('@util/logger')
const moment = require('moment')

const loggerPrefix = 'Cronjob::deadlineWatcher | '

const startDeadlineWatcher = async () => {
  // 1 min before midnight: 59 23 * * *
  cron.schedule('59 23 * * *', async () => {
    logger.info(`${loggerPrefix} Checking if there's a deadline that closes today...`)

    const upcomingDeadlines = await db.deadline.findAll({
      order: [['date', 'ASC']],
    })

    const deadlinedate = upcomingDeadlines[0] ? upcomingDeadlines[0].date : undefined

    if (deadlinedate) {
      const deadlineIsToday = moment().isSame(moment(deadlinedate), 'day')

      if (deadlineIsToday) {
        logger.info(`${loggerPrefix} Today is the deadline, taking backups...`)

        const programmes = await db.studyprogramme.findAll({})

        programmes.forEach(async programme => {
          const { key, name, locked } = programme

          const tempAnswers = await db.tempAnswer.findOne({
            where: {
              programme: key,
            },
          })

          const acualAnswers = tempAnswers ? tempAnswers.data : {}
          await db.answer.create({
            programme: key,
            data: acualAnswers,
            year: moment().year(),
            submittedBy: 'cronJob',
          })

          // If some programme has not answered at all, there are no tempAnswers for that programme.
          if (tempAnswers) {
            tempAnswers.data = {}
            await tempAnswers.save()
          }

          programme.locked = true

          await programme.save()
        })
        await upcomingDeadlines[0].destroy()
      }
    }
  })
  logger.info('Deadline job started')
}

module.exports = {
  startDeadlineWatcher,
}
