import * as Sentry from '@sentry/node'

const GIT_SHA = process.env.GIT_SHA || ''

const initializeSentry = () => {
  if (!(process.env.NODE_ENV === 'production')) return

  Sentry.init({
    dsn: 'https://b41a87ca77fbe0da75b6c078381a66d4@toska.cs.helsinki.fi/15',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: GIT_SHA,
    integrations: [Sentry.httpIntegration({ breadcrumbs: true }), Sentry.expressIntegration()],
    tracesSampleRate: 1.0,
  })
}

export default initializeSentry
