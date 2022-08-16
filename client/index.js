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

if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  Sentry.init({
    dsn: 'https://4ff51e515d0e41a28dea1bbcf3451a18@sentry.cs.helsinki.fi/11',
    // environment: process.env.SENTRY_ENVIRONMENT,
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
// eslint-disable-next-line
dothis()

if (process.env.NODE_ENV === 'development') {
  const newUser = 'admin'
  const currentFakeUser = window.localStorage.getItem('fakeUser')

  if (!currentFakeUser || !cypressUids.includes(JSON.parse(currentFakeUser).uid)) {
    setHeaders(newUser)
  }
}
refresh()
