const express = require('express')
const Sentry = require('@sentry/node')
const routes = require('@util/routes')
const { AUTOMATIC_IAM_PERMISSIONS_ENABLED } = require('@util/common')
const logger = require('@util/logger')

const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const { accessLogger } = require('@middleware/requestLoggerMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const IAMmiddleware = require('@middleware/IAMmiddleware')
const initializeSentry = require('./util/sentry')

const app = express()

initializeSentry(app)
app.use(Sentry.Handlers.requestHandler())
app.use(Sentry.Handlers.tracingHandler())

app.use(express.json({ limit: '50mb' }))

app.use(accessLogger)

app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)

if (AUTOMATIC_IAM_PERMISSIONS_ENABLED) {
  logger.info('Automatic IAM permissions enabled')
  app.use(IAMmiddleware)
}

app.use(currentUserMiddleware)

app.use(routes)

// eslint-disable-next-line
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('Sentry error works')
})

app.use(Sentry.Handlers.errorHandler())
app.use(errorMiddleware)

module.exports = app
