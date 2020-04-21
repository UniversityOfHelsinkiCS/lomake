const cron = require('node-cron')
const db = require('@models/index')
const logger = require('@util/logger')
const lodash = require('lodash')

const loggerPrefix = 'Cronjob::backup | '

const startBackupJob = () => {
  cron.schedule('* * * * *', () => createBackups())
  logger.info('Backup job started')
}

/**
 * Creates new backup to backup_answers table, but only if the data has changed.
 */
const createBackups = async () => {
  logger.info(`${loggerPrefix}Checking for changes and creating backups if necessary...`)
  const currentAnswers = await db.tempAnswer.findAll({})

  currentAnswers.forEach(async (answer) => {
    const { programme, data } = answer

    const oldestBackup = await db.backupAnswer.findAll({
      limit: 1,
      where: {
        programme: programme,
      },
      order: [['createdAt', 'DESC']],
    })

    const oldestBackUpData = oldestBackup.length === 0 ? {} : oldestBackup[0].data

    if (lodash.isEqual(data, oldestBackUpData)) return

    await db.backupAnswer.create({
      programme: programme,
      data: data,
    })

    logger.info(`${loggerPrefix}Created new backup for ${programme}`)
  })
}

module.exports = {
  startBackupJob,
}
