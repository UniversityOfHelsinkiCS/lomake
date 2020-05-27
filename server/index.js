const express = require('express')
const morgan = require('morgan')
const routes = require('@util/routes')
const { inProduction } = require('@util/common')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const requestLoggerMiddleware = require('@middleware/requestLoggerMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const logger = require('@util/logger')

const accessLogger = morgan((tokens, req, res) => {
  const fields = [
    'method',
    'url',
    'status',
    'response-time',
    'remote-addr',
    'remote-user',
    'user-agent',
    'referrer',
  ]

  const final = {
    userId: req.headers.uid,
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
  }

  logger.info(JSON.stringify(final))
})

const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)
app.use(currentUserMiddleware)
app.use(accessLogger)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
