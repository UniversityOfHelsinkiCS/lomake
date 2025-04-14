import * as Sentry from '@sentry/browser'

const GIT_SHA = process.env.GIT_SHA || ''

const initSentry = () => {
  Sentry.init({
    dsn: 'https://b41a87ca77fbe0da75b6c078381a66d4@toska.cs.helsinki.fi/15',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: GIT_SHA,
    integrations: [Sentry.breadcrumbsIntegration(), Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  })
}

export { initSentry, Sentry }
