/* eslint-disable import-x/no-named-as-default-member */
import winston from 'winston'
import LokiTransport from 'winston-loki'
import { inProduction } from '../../config/common.js'

const { combine, timestamp, printf, splat } = winston.format

const transports = []

if (!inProduction) {
  const devFormat = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message} }`)

  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: combine(splat(), timestamp(), devFormat),
    })
  )
}

if (inProduction) {
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  }

  const prodFormat = printf(({ level, message, timestamp, ...meta }) => {
    let logMessage = `${timestamp} ${levels[level]}: ${message}`
    if (Object.keys(meta ?? {}).length > 0) {
      logMessage = `${logMessage} ${JSON.stringify(meta)}`
    }
    return logMessage
  })

  transports.push(
    new winston.transports.Console({
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), prodFormat),
    })
  )

  transports.push(
    new LokiTransport({
      host: 'http://loki-svc.toska-lokki.svc.cluster.local:3100',
      labels: { app: 'lomake', environment: process.env.NODE_ENV ?? 'production' },
    })
  )
}

const logger = winston.createLogger({ transports })

export default logger
