/* eslint-disable @typescript-eslint/no-misused-promises */
// DO NOT CHANGE ORDER, will yield to sequelize not initialized before use -error
import express from 'express'
import * as Sentry from '@sentry/node'
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
import { testJami } from './util/jami.js'
import { checkEmployeeOrStudent } from './middleware/accessControlMiddleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// eslint-disable-next-line import-x/no-named-as-default-member
dotenv.config()

const app = express()

const server = new http.Server(app)

createWebsocketServer(server)
initializeSentry()

// eslint-disable-next-line import-x/no-named-as-default-member
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
app.use(checkEmployeeOrStudent)
app.use('/api', routes)

if (inProduction || inStaging) {
  const DIST_PATH = path.resolve(__dirname, '../build')
  const INDEX_PATH = path.resolve(DIST_PATH, 'index.html')
  // eslint-disable-next-line import-x/no-named-as-default-member
  app.use(express.static(DIST_PATH))
  app.get('*', (_req, res) => res.sendFile(INDEX_PATH))
}

Sentry.setupExpressErrorHandler(app)
app.use(errorMiddleware)

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
      default:
        break
    }
  }

  server.listen(PORT, async () => {
    logger.info(`Server started on port ${PORT}`)
    await testJami()
    startBackupJob()
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    startDeadlineWatcher()
  })
})

export default app
