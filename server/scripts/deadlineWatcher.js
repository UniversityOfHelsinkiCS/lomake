const { Op } = require('sequelize')
const cron = require('node-cron')
const moment = require('moment')

const db = require('@models/index')
const logger = require('@util/logger')

const loggerPrefix = 'Cronjob::deadlineWatcher | '

const startDeadlineWatcher = async () => {
  // 5 min before midnight: 55 23 * * *
  cron.schedule('55 23 * * *', async () => {
    logger.info(`${loggerPrefix} Checking if there's a deadline that closes today...`)

    const upcomingDeadlines = await db.deadline.findAll({
      order: [['date', 'ASC']],
    })

    const deadlinesToday =
      upcomingDeadlines.length > 0 ? upcomingDeadlines.filter(d => moment().isSame(moment(d.date), 'day')) : null

    const draftYears = await db.draftYear.findAll({})
    const draftYear = draftYears.length ? draftYears[0].year : null

    if (deadlinesToday && draftYear) {
      logger.info(`${loggerPrefix} Today is a deadline, taking backups...`)

      const programmes = await db.studyprogramme.findAll({})

      deadlinesToday.forEach(async ({ form }) => {
        logger.info(`${loggerPrefix} Processing backups for form ${form}...`)

        programmes.forEach(async programme => {
          const { key } = programme

          const tempAnswers = await db.tempAnswer.findOne({
            where: {
              [Op.and]: [{ programme: key, year: draftYear, form }],
            },
          })

          const answer = await db.answer.findOne({
            where: {
              [Op.and]: [{ programme: key }, { year: draftYear }, { form }],
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
              form,
              submittedBy: 'cronJob',
            })
          }

          await programme.save()
        })

        await db.deadline.destroy({
          where: { form },
        })
      })

      // if no deadlines remain, lock programmes and destroy draftyear
      const remainingDeadlines = await db.deadline.findAll({})

      if (remainingDeadlines.length === 0) {
        await db.draftYear.destroy({
          truncate: true,
        })

        programmes.forEach(async programme => {
          programme.locked = true
          programme.save()
        })
      }
      logger.info(`${loggerPrefix} Backups done`)
    } else {
      logger.info(`${loggerPrefix} No deadlines today`)
    }
  })
  logger.info('Deadline job started')
}

module.exports = {
  startDeadlineWatcher,
}
