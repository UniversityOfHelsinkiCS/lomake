import * as Sentry from '@sentry/node'

const GIT_SHA = process.env.GIT_SHA || ''

const initializeSentry = () => {
  if (!(process.env.NODE_ENV === 'production')) return

  Sentry.init({
    dsn: 'https://33826484e41156258524cf4c1209b38f@toska.it.helsinki.fi/26',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: `lomake:${GIT_SHA}`,
    integrations: [Sentry.httpIntegration({ breadcrumbs: true }), Sentry.expressIntegration()],
    tracesSampleRate: 1.0,
  })
}

export default initializeSentry
