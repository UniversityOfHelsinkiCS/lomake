import * as Sentry from '@sentry/browser'

const GIT_SHA = process.env.GIT_SHA || ''

const initSentry = () => {
  Sentry.init({
    dsn: 'https://9b16f24eb3605b8e371ded1d62e11cb6@toska.it.helsinki.fi/28',
    environment: process.env.SENTRY_ENVIRONMENT,
    release: `lomake:${GIT_SHA}`,
    integrations: [Sentry.breadcrumbsIntegration(), Sentry.browserTracingIntegration()],
    tracesSampleRate: 1.0,
  })
}

export { initSentry, Sentry }
