const morgan = require('morgan')
const logger = require('@util/logger')
const { inProduction } = require('../../config/common')

const accessLogger = morgan((tokens, req, res) => {
  const mockingAs = req.headers['x-admin-logged-in-as']
  const { uid } = req.headers

  const method = tokens.method(req, res)
  const url = tokens.url(req, res)
  const status = tokens.status(req, res)
  const responseTime = tokens['response-time'](req, res)
  const userAgent = tokens['user-agent'](req, res)

  const message = `${method} ${url} ${status} - ${responseTime} ms`

  const additionalInfo = inProduction
    ? {
        userId: uid,
        method,
        url,
        status,
        responseTime,
        userAgent,
      }
    : {}

  if (mockingAs) additionalInfo.mockingAs = mockingAs

  logger.info(message, additionalInfo)
})

module.exports = { accessLogger }
