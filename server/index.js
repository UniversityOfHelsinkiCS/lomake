const express = require('express')
const routes = require('@util/routes')
const externalRouter = require('@util/externalRoutes')
const { iamsInUse } = require('@util/common')
const logger = require('@util/logger')

const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const { accessLogger } = require('@middleware/requestLoggerMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const IAMmiddleware = require('@middleware/IAMmiddleware')

const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(accessLogger)

app.use('/external', externalRouter)

app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)

if (iamsInUse) {
  logger.info('Automatic IAM permissions enabled')
  app.use(IAMmiddleware)
}

app.use(currentUserMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
