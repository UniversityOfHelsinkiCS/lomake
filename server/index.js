const express = require('express')
const routes = require('@util/routes')
const { inProduction } = require('@util/common')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const requestLoggerMiddleware = require('@middleware/requestLoggerMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')

const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)
app.use(currentUserMiddleware)
if (!inProduction) app.use(requestLoggerMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
