import logger from '../util/logger.js'

const errorHandler = (error, _, res, next) => {
  logger.error(error.message, error.name, error.extra)

  if (error.name === 'ApplicationError') {
    return res.status(error.status).send({ error: error.message })
  }

  res.status(500).send({ error: error.message })
  return next(error)
}

export default errorHandler
