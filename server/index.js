const express = require('express')
const routes = require('@util/routes')
const { inProduction } = require('@util/common')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const requestLoggermiddleware = require('@middleware/requestLoggerMiddleware')

const userMiddleware = require('@middleware/userMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const logger = require('@util/logger')

const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)
app.use(currentUserMiddleware)

app.use(requestLoggermiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
