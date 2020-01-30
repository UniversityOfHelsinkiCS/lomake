const express = require('express')
const routes = require('@util/routes')
const { inProduction } = require('@util/common')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const requestLoggerMiddleware = require('@middleware/requestLoggerMiddleware')
const fakeShibboMiddleware = require('@middleware/fakeShibboMiddleware')

const app = express()

app.use(express.json())

app.use(shibbolethCharsetMiddleware)
if (!inProduction) app.use(fakeShibboMiddleware)
app.use(userMiddleware)
if (!inProduction) app.use(requestLoggerMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
