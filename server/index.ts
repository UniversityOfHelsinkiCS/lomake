/* eslint-disable @typescript-eslint/no-var-requires */
import express from 'express'
import Sentry from '@sentry/node'
import path from 'path'
import { fileURLToPath } from 'url'
import http from 'http'
import dotenv from 'dotenv'
import compression from 'compression'
import startBackupJob from './scripts/backupAnswers.js'
import IAMmiddleware from './middleware/IAMmiddleware.js'
import currentUserMiddleware from './middleware/currentUserMiddleware.js'
import userMiddleware from './middleware/userMiddleware.js'
import accessLogger from './middleware/requestLoggerMiddleware.js'
import errorMiddleware from './middleware/errorMiddleware.js'
import logger from './util/logger.js'
import { AUTOMATIC_IAM_PERMISSIONS_ENABLED, PORT } from './util/common.js'
import { inStaging, inProduction } from '../config/common.js'
import shibbolethCharsetMiddleware from './middleware/shibbolethCharsetMiddleware.js'
import startDeadlineWatcher from './scripts/deadlineWatcher.js'
import seed from './scripts/seed.js'
import getUserList from './scripts/getUserList.js'
import createTempAnswers from './scripts/createTempAnswers.js'
import routes from './util/routes.js'
import initializeSentry from './util/sentry.js'
import createWebsocketServer from './websocket.js'
import { initializeDatabaseConnection } from './database/connection.js'

// eslint-disable-next-line no-underscore-dangle
const __filename = fileURLToPath(import.meta.url)
// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(__filename)

dotenv.config()

const app = express()

// eslint-disable-next-line
const server = new http.Server(app)

createWebsocketServer(server)

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
app.use('/api', routes)

app.use(Sentry.Handlers.errorHandler())
app.use(errorMiddleware)

if (inProduction || inStaging) {
  const DIST_PATH = path.resolve(__dirname, '../build')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
  app.use(express.static(DIST_PATH))
  app.get('*', (_req, res) => res.sendFile(INDEX_PATH))
}

initializeDatabaseConnection().then(async () => {
  // if there is a argument and return
  if (process.argv[2]) {
    switch (process.argv[2]) {
      case 'seed':
        await seed()
        return
      case 'getUserList':
        await getUserList()
        return
      case 'generateMissingTempAnswers':
        await createTempAnswers()
        return
    }
  }
  
  server.listen(PORT, async () => {
    logger.info(`Server started on port ${PORT}`)
    startBackupJob()
    startDeadlineWatcher()
  })
})

export default app
