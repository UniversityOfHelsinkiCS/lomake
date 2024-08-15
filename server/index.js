const express = require('express')
const Sentry = require('@sentry/node')
const routes = require('@util/routes')
const { AUTOMATIC_IAM_PERMISSIONS_ENABLED, PORT, inProduction, inStaging } = require('@util/common')
const logger = require('@util/logger')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const { accessLogger } = require('@middleware/requestLoggerMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const IAMmiddleware = require('@middleware/IAMmiddleware')
const path = require('path')
const http = require('http')
const { initializeDatabaseConnection } = require('@root/server/database/connection')
const { startBackupJob } = require('@root/server/scripts/backupAnswers')
const { startDeadlineWatcher } = require('@root/server/scripts/deadlineWatcher')
const { seed } = require('@root/server/scripts/seed')
const { getUserList } = require('@root/server/scripts/getUserList')
const { createTempAnswers } = require('@root/server/scripts/createTempAnswers')
const dotenv = require('dotenv')
const compression = require('compression')
const initializeSentry = require('./util/sentry')
const { createWebsocketServer } = require('./websocket')

dotenv.config()

const app = express()

initializeSentry(app)

app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())
app.use(express.json({ limit: '50mb' }))
app.use(compression())
app.use(accessLogger)
app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)

if (AUTOMATIC_IAM_PERMISSIONS_ENABLED) {
  logger.info('Automatic IAM permissions enabled')
  app.use(IAMmiddleware)
}

app.use(currentUserMiddleware)
app.use(routes)

app.use(Sentry.Handlers.errorHandler())
app.use(errorMiddleware)

// Require is here so we can delete it from cache when files change (*)
app.use('/api', (req, res, next) => require('@root/server')(req, res, next)) // eslint-disable-line

if (inProduction || inStaging) {
  const DIST_PATH = path.resolve(__dirname, '../../build')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
  app.use(express.static(DIST_PATH))
  app.get('*', (_req, res) => res.sendFile(INDEX_PATH))
}

const start = async () => {
  await initializeDatabaseConnection()
  await seed()
  await getUserList()
  await createTempAnswers()

  const server = http.Server(app)
  createWebsocketServer(server)

  server.listen(PORT, () => {
    logger.info(`Started on port ${PORT}`)
    startBackupJob()
    startDeadlineWatcher()
  })
}

start()

module.exports = app
