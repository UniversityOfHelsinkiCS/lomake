const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const initializeSentry = app => {
  if (!(process.env.NODE_ENV === 'production')) return

  Sentry.init({
    dsn: 'https://a6ceb1539cbea12e147f5e73189a1d45@toska.cs.helsinki.fi/13',
    environment: process.env.SENTRY_ENVIRONMENT,
    // release: sentryRelease,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    tracesSampleRate: 1.0,
  })
}

module.exports = initializeSentry
