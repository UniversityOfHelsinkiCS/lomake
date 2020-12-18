const express = require('express')
const routes = require('@util/routes')
const { inProduction } = require('@util/common')
const errorMiddleware = require('@middleware/errorMiddleware')
const shibbolethCharsetMiddleware = require('@middleware/shibbolethCharsetMiddleware')
const {
  productionRequestLogger,
  developmentRequestLogger,
} = require('@middleware/requestLoggerMiddleware')
const userMiddleware = require('@middleware/userMiddleware')
const currentUserMiddleware = require('@middleware/currentUserMiddleware')
const IAMmiddleware = require("@middleware/IAMmiddleware")

const app = express()

app.use(express.json({ limit: '50mb' }))

app.use(inProduction ? productionRequestLogger : developmentRequestLogger)
app.use(shibbolethCharsetMiddleware)
app.use(userMiddleware)
app.use(IAMmiddleware)
app.use(currentUserMiddleware)

app.use(routes)

app.use(errorMiddleware)

module.exports = app
