/* eslint-disable */
require('dotenv').config()
require('module-alias/register')
const express = require('express')
const path = require('path')
const http = require('http')
require('express-async-errors')

const { PORT, inProduction, inStaging } = require('@util/common')
const logger = require('@util/logger')

const { initializeDatabaseConnection } = require('@root/server/database/connection')

const { startBackupJob } = require('@root/server/scripts/backupAnswers')
const { startDeadlineWatcher } = require('@root/server/scripts/deadlineWatcher')
const { seed } = require('@root/server/scripts/seed')
const { getUserList } = require('@root/server/scripts/getUserList')
const { createTempAnswers } = require('@root/server/scripts/createTempAnswers')
const { createWebsocketServer } = require('./server/websocket')

initializeDatabaseConnection()
  .then(() => {
    // Scripts that can be ran manually
    if (process.argv[2]) {
      switch (process.argv[2]) {
        case 'seed':
          seed()
          return
        case 'getUserList':
          getUserList()
          return
        case 'generateMissingTempAnswers':
          createTempAnswers()
          return
        default:
          return
      }
    }

    const app = express()
    const server = http.Server(app)
    createWebsocketServer(server)

    // Require is here so we can delete it from cache when files change (*)
    app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

    if (inProduction || inStaging) {
      const DIST_PATH = path.resolve(__dirname, './build')
      const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')

      app.use(express.static(DIST_PATH))
      app.get('*', (req, res) => res.sendFile(INDEX_PATH))
    }

    server.listen(PORT, () => {
      logger.info(`Started on port ${PORT}`)
      startBackupJob()
      startDeadlineWatcher()
    })
  })
  .catch(e => {
    process.exitCode = 1
    logger.error(e)
  })
