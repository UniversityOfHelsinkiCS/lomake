const Sentry = require('@sentry/node')
const Tracing = require('@sentry/tracing')

const initializeSentry = app => {
  // if (!sentryRelease || !sentryEnvironment || runningInCI) return

  Sentry.init({
    dsn: 'https://4ff51e515d0e41a28dea1bbcf3451a18@sentry.cs.helsinki.fi/11',
    environment: process.env.NODE_ENV,
    // release: sentryRelease,
    integrations: [new Sentry.Integrations.Http({ tracing: true }), new Tracing.Integrations.Express({ app })],
    tracesSampleRate: 1.0,
  })
}

module.exports = initializeSentry
