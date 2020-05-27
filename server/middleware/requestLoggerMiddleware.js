const morgan = require('morgan')
const winston = require('winston')
const { inProduction } = require('@util/common')
const logger = require('@util/logger')

/**
 * Easy to read non-JSON logs for development.
 */
const developmentRequestLogger = (req, res, next) => {
  const loggedInAs = req.headers['x-admin-logged-in-as']
  const userString = loggedInAs
    ? `User: ${req.headers.uid} mocking as ${loggedInAs}`
    : `User: ${req.headers.uid}`

  logger.info(`Method: ${req.method}`)
  logger.info(`Path: ${req.path}`)
  logger.info(`Body: ${JSON.stringify(req.body)}`)
  logger.info(userString)
  logger.info('---')

  next()
}

/**
 * Hard to read JSON logs.
 */
const productionRequestLogger = (req, res, next) => {
  morgan((tokens, req, res) => {
    const mockingAs = req.headers['x-admin-logged-in-as']

    const final = {
      userId: req.headers.uid,
      method: tokens.method(req, res),
      url: tokens.url(req, res),
      status: tokens.status(req, res),
      responseTime: tokens['response-time'](req, res),
    }

    if (mockingAs) final['mockingAs'] = mockingAs

    console.log(JSON.stringify(final))
  })

  next()
}

module.exports = {
  developmentRequestLogger,
  productionRequestLogger,
}
