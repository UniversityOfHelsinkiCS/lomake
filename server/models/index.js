/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Sequelize } from 'sequelize'
import config from '../../config/sequelize.js'
import logger from '../util/logger.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const basename = path.basename(__filename)

const db = {}

// Determine the current environment
const env = process.env.NODE_ENV || 'development'
const envConfig = config[env]

let sequelize
if (envConfig.use_env_variable) {
  sequelize = new Sequelize(process.env[envConfig.use_env_variable], envConfig)
} else {
  sequelize = new Sequelize(envConfig.database_url, envConfig)
}

const initializeModels = async () => {
  const files = fs.readdirSync(__dirname).filter(file => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
  })

  // eslint-disable-next-line no-restricted-syntax
  for (const file of files) {
    // eslint-disable-next-line no-await-in-loop
    const modelModule = await import(path.join(__dirname, file))
    const model = modelModule.default(sequelize, Sequelize.DataTypes)
    db[model.name] = model
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })

  db.sequelize = sequelize
  db.Sequelize = Sequelize
}

initializeModels()
  .then(() => {
    logger.info('Models initialized')
  })
  .catch(err => {
    logger.error('Error initializing models:', err)
  })

export default db
