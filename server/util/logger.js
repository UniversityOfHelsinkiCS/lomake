import os from 'os'
import winston from 'winston'
import { WinstonGelfTransporter } from 'winston-gelf-transporter'
import LokiTransport from 'winston-loki'
import { inProduction } from '../../config/common.js'

const { combine, timestamp, printf, splat } = winston.format

const transports = []

if (!inProduction) {
  const devFormat = printf(
    ({ level, message, timestamp, ...rest }) => `${timestamp} ${level}: ${message} ${JSON.stringify(rest)}`,
  )

  transports.push(
    new winston.transports.Console({
      level: 'debug',
      format: combine(splat(), timestamp(), devFormat),
    }),
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

  const prodFormat = winston.format.printf(({ level, ...rest }) =>
    JSON.stringify({
      level: levels[level],
      ...rest,
    }),
  )
  transports.push(new winston.transports.Console({ format: prodFormat }))

  transports.push(
    new LokiTransport({
      host: 'http://loki-svc.toska-lokki.svc.cluster.local:3100',
      labels: { app: 'lomake', environment: process.env.NODE_ENV || 'production' },
    }),
  )

  transports.push(
    new WinstonGelfTransporter({
      handleExceptions: true,
      host: 'svm-116.cs.helsinki.fi',
      port: 9503,
      protocol: 'udp',
      hostName: os.hostname(),
      additional: {
        app: 'lomake',
        environment: 'production',
      },
    }),
  )
}

const logger = winston.createLogger({ transports })

export default logger
