import { Sequelize } from 'sequelize'
import pkg from 'umzug'

import logger from '../util/logger.js'
import { DATABASE_URL } from '../util/common.js'

const DB_CONNECTION_RETRY_LIMIT = 10

export const sequelize = new Sequelize(DATABASE_URL, { logging: false })

const { Umzug, SequelizeStorage } = pkg

const umzug = new Umzug({
  migrations: { glob: 'migrations/*.js' },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({ sequelize }),
  logger: console,
})

const runMigrations = async () => {
  const migrations = await umzug.up()

  logger.info('Migrations up to date', {
    migrations,
  })
}

const testConnection = async () => {
  await sequelize.authenticate()
  // await runMigrations()
}

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms)
  })

export const initializeDatabaseConnection = async (attempt = 1) => {
  try {
    await testConnection()
    return true
  } catch (e) {
    if (attempt === DB_CONNECTION_RETRY_LIMIT) {
      logger.error(`Connection to database failed after ${attempt} attempts`)
      process.exit(1)
    }
    logger.error(`Connection to database failed! Attempt ${attempt} of ${DB_CONNECTION_RETRY_LIMIT}`)
    await sleep(1000)
    return initializeDatabaseConnection(attempt + 1)
  }
}
