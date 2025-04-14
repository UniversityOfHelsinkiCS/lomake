import * as Sentry from '@sentry/browser'

const GIT_SHA = process.env.GIT_SHA || ''

const initSentry = () => {
  Sentry.init({
    dsn: 'https://a6ceb1539cbea12e147f5e73189a1d45@toska.cs.helsinki.fi/13',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: GIT_SHA,
    integrations: [Sentry.breadcrumbsIntegration(), Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  })
}

export { initSentry, Sentry }
