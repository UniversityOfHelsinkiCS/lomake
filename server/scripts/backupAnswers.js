import cron from 'node-cron'
import lodash from 'lodash'
import db from '../models/index.js'
import logger from '../util/logger.js'
import { whereDraftYear } from '../util/common.js'

const loggerPrefix = 'Cronjob::backup | '

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
    const { programme, data, form } = answer

    if (!programme || !form) return
    const newestBackup = await db.backupAnswer.findAll({
      limit: 1,
      where: {
        programme,
        form,
      },
      order: [['createdAt', 'DESC']],
    })

    const newestBackupData = newestBackup.length === 0 ? {} : newestBackup[0].data

    if (lodash.isEqual(data, newestBackupData)) return

    await db.backupAnswer.create({
      programme,
      data,
      form,
    })

    logger.info(`${loggerPrefix}Created new backup for ${programme} for form ${form}`)
  })
}

const startBackupJob = () => {
  cron.schedule('0 0 * * 0', () => createBackups())
  logger.info('Backup job started')
}

export default startBackupJob
