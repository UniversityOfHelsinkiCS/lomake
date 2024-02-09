const { Op } = require('sequelize')
const cron = require('node-cron')
const moment = require('moment')

const db = require('@models/index')
const logger = require('@util/logger')

const loggerPrefix = 'Cronjob::deadlineWatcher | '
const { formKeys } = require('@root/config/data')

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

    if (deadlinesToday && deadlinesToday.length > 0 && draftYear) {
      logger.info(`${loggerPrefix} Today is a deadline, taking backups...`)

      const programmes = await db.studyprogramme.findAll({})

      await deadlinesToday.forEach(async ({ form }) => {
        logger.info(`${loggerPrefix} Processing backups for form ${form}...`)

        if (
          form === formKeys.DEGREE_REFORM_INDIVIDUALS ||
          form === formKeys.EVALUATION_FACULTIES ||
          form === formKeys.EVALUATION_COMMTTEES
        ) {
          // handle individual users and faculty forms
          const allTempAnswers = await db.tempAnswer.findAll({ where: { form, year: draftYear } })

          if (allTempAnswers) {
            allTempAnswers.forEach(async temp => {
              const answer = await db.answer.findOne({
                where: {
                  [Op.and]: [{ programme: temp.programme }, { year: temp.year }, { form: temp.form }],
                },
              })

              const acualAnswers = temp.data || {}

              if (answer) {
                answer.data = acualAnswers
                await answer.save()
              } else {
                await db.answer.create({
                  data: acualAnswers,
                  programme: temp.programme,
                  year: draftYear,
                  form,
                  submittedBy: 'cronJob',
                })
              }
            })
          }
        } else {
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
          })
        }

        await db.deadline.destroy({
          where: { form },
        })
      })

      // if no deadlines remain, lock programmes and destroy draftyear
      if (upcomingDeadlines.length === deadlinesToday?.length) {
        await db.draftYear.destroy({
          truncate: true,
        })

        programmes.forEach(async programme => {
          programme.lockedForms = { yearly: true, evaluation: true, 'evaluation-faculty': true, 'degree-reform': true }
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
