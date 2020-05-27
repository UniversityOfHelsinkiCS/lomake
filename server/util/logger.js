const winston = require('winston')
const morgan = require('morgan')
const { inProduction } = require('@util/common')

/**
 * Production logger.
 */
const productionLogger = winston.createLogger({
  format: winston.format.json(),
  transports: new winston.transports.Console(),
})

/**
 * Development logger.
 */
const developmentLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
  ],
})

const getLogger = () => {
  return inProduction ? productionLogger : developmentLogger
}

const logger = getLogger()

module.exports = logger
