import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import * as Sentry from '@sentry/browser'
import { BrowserTracing } from '@sentry/tracing'
import { cypressUids, setHeaders } from '@root/config/mockHeaders'

import './assets/custom.scss'

import store from 'Utilities/store'
import { basePath } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import './util/i18n'

if (process.env.NODE_ENV === 'production' && process.env.SENTRY_ENVIRONMENT === 'production') {
  Sentry.init({
    dsn: 'https://a6ceb1539cbea12e147f5e73189a1d45@toska.cs.helsinki.fi/13',
    environment: process.env.SENTRY_ENVIRONMENT,
    // release: process.env.SENTRY_RELEASE,
    integrations: [new BrowserTracing()],
    tracesSampleRate: 1.0,
  })
}

const refresh = () =>
  render(
    <Provider store={store}>
      <BrowserRouter basename={basePath}>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>,
    document.getElementById('root')
  )

if (process.env.NODE_ENV === 'development') {
  const newUser = 'superAdmin'
  const currentFakeUser = window.localStorage.getItem('fakeUser')

  if (!currentFakeUser || !cypressUids.includes(JSON.parse(currentFakeUser).uid)) {
    setHeaders(newUser)
  }

  /* eslint-disable no-console */
  /* eslint-disable no-restricted-globals */
  new EventSource('http://localhost:8000/esbuild').addEventListener('change', () => {
    location.reload()
    console.log('Reloaded due to changes')
  })
}

refresh()
