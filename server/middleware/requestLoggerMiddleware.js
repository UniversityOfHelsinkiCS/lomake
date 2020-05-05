const logger = require('@util/logger')

const requestLoggerMiddleware = (req, res, next) => {
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

module.exports = requestLoggerMiddleware
