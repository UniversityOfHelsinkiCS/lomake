import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { cypressUids, setHeaders } from '@root/config/mockHeaders'

import './assets/custom.scss'

import store from 'Utilities/store'
import { basePath } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'
import './util/i18n'

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
  const newUser = 'admin'
  const currentFakeUser = window.localStorage.getItem('fakeUser')

  if (!currentFakeUser || !cypressUids.includes(JSON.parse(currentFakeUser).uid)) {
    setHeaders(newUser)
  }
}
refresh()
