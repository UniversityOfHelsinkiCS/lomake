import winston from 'winston'
import LokiTransport from 'winston-loki'
import { inProduction } from '../../config/common.js'

const { combine, timestamp, printf } = winston.format

const transports = []

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6,
}

const printFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} ${levels[level]}: ${message}`
})

transports.push(
  new winston.transports.Console({
    level: inProduction ? 'info' : 'debug',
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), printFormat),
  })
)
if (inProduction) {
  transports.push(
    new LokiTransport({
      host: 'http://loki-svc.toska-lokki.svc.cluster.local:3100',
      labels: { app: 'lomake', environment: process.env.NODE_ENV ?? 'production' },
    })
  )
}

const logger = winston.createLogger({ transports })

export default logger
