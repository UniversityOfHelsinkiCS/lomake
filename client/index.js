import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { setHeaders } from 'Utilities/mockHeaders'

import 'Assets/custom.scss'

import store from 'Utilities/store'
import { basePath } from 'Utilities/common'
import App from 'Components/App'
import ErrorBoundary from 'Components/ErrorBoundary'

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
  if (currentFakeUser) {
    const parsedFakeCurrentUser = JSON.parse(currentFakeUser)

    if (parsedFakeCurrentUser.uid !== 'cypressUser') {
      setHeaders(newUser)
    }
  } else {
    setHeaders(newUser)
  }
}
refresh()

if (module.hot) {
  module.hot.accept()
}
