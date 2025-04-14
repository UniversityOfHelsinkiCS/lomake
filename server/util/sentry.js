import Sentry from '@sentry/node'

const GIT_SHA = process.env.GIT_SHA || ''

const initializeSentry = app => {
  if (!(process.env.NODE_ENV === 'production')) return

  Sentry.init({
    dsn: 'https://a6ceb1539cbea12e147f5e73189a1d45@toska.cs.helsinki.fi/13',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: GIT_SHA,
    integrations: [Sentry.httpIntegration({ breadcrumbs: true }), Sentry.expressIntegration()],
    tracesSampleRate: 1.0,
  })
}

export default initializeSentry
