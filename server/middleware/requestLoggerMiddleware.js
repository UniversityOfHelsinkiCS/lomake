const logger = require('@util/logger')

const requestLoggerMiddleware = (req, res, next) => {
  logger.info(`Method: ${req.method}`)
  logger.info(`Path: ${req.path}`)
  logger.info(`Body: ${JSON.stringify(req.body)}`)
  logger.info(`User: ${req.headers.uid}`)
  logger.info('---')

  next()
}

module.exports = requestLoggerMiddleware
