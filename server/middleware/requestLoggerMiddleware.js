const morgan = require('morgan')
const winston = require('winston')

const myLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.json()
  ),
  defaultMeta: { service: 'lomake' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
      ),
    }),
  ],
})

const requestLogger = morgan((tokens, req, res) => {
  const final = {
    userId: req.headers.uid,
    method: tokens.method(req, res),
    url: tokens.url(req, res),
    status: tokens.status(req, res),
    responseTime: tokens['response-time'](req, res),
    message: tokens.url(req, res),
  }

  console.log(JSON.stringify(final))
})

module.exports = requestLogger
