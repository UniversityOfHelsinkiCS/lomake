const { Op } = require('sequelize')
const cron = require('node-cron')
const db = require('@models/index')
const logger = require('@util/logger')
const lodash = require('lodash')
const { whereDraftYear } = require('@util/common')

const loggerPrefix = 'Cronjob::backup | '

const startBackupJob = () => {
  cron.schedule('* * * * *', () => createBackups())
  logger.info('Backup job started')
}

/**
 * Creates new backup to backup_answers table, but only if the data has changed.
 */
const createBackups = async () => {
  const draftYear = await db.draftYear.findAll({})

  if (!draftYear.length) return
  const currentAnswers = await db.tempAnswer.findAll({
    where: {
      year: await whereDraftYear(),
    },
  })

  currentAnswers.forEach(async answer => {
    const { programme, data } = answer

    const newestBackup = await db.backupAnswer.findAll({
      limit: 1,
      where: {
        programme,
      },
      order: [['createdAt', 'DESC']],
    })

    const newestBackupData = newestBackup.length === 0 ? {} : newestBackup[0].data

    if (lodash.isEqual(data, newestBackupData)) return

    await db.backupAnswer.create({
      programme,
      data,
    })

    logger.info(`${loggerPrefix}Created new backup for ${programme}`)
  })
}

module.exports = {
  startBackupJob,
}
