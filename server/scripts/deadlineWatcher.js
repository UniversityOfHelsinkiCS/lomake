const cron = require('node-cron')
const db = require('@models/index')
const logger = require('@util/logger')
const moment = require('moment')

const loggerPrefix = 'Cronjob::deadlineWatcher | '

const startDeadlineWatcher = async () => {
  logger.info('Starting deadlineWatcher.')

  // 1 min before midnight: 59 23 * * *
  cron.schedule('59 23 * * *', async () => {
    logger.info(`${loggerPrefix} Checking if there's a deadline that closes today...`)

    const upcomingDeadlines = await db.deadline.findAll({
      where: {
        passed: false,
      },
      order: [['date', 'ASC']],
    })

    const deadlinedate = upcomingDeadlines[0] ? upcomingDeadlines[0].date : undefined

    if (deadlinedate) {
      const deadlineIsToday = moment().isSame(moment(deadlinedate), 'day')

      if (deadlineIsToday) {
        logger.info(`${loggerPrefix} Today is the deadline, taking backups...`)

        const programmes = await db.studyprogramme.findAll({})

        programmes.forEach(async (programme) => {
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

          /***
           * If: there exists deadlines after the one that is currently being passed, the form should be reset and left open.
           * Else: If there's no deadlines coming after this one, lock the programmes and dont clear the answers.
           */
          if (upcomingDeadlines.length > 1) {
            tempAnswers.data = {}
            await tempAnswers.save()
            // 2.
          } else {
            // Lock form (programme), dont clear temp_answers
            programme.locked = true
            await programme.save()
          }
        })

        upcomingDeadlines[0].passed = true
        await upcomingDeadlines[0].save()
      }
    }
  })
}

module.exports = {
  startDeadlineWatcher,
}
