import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ErrorBoundary from './components/ErrorBoundary'
import UserFaker from './components/UserFaker'
import App from './components/App'
import { cypressUids, setHeaders, possibleUsers } from '../config/mockHeaders'

import './assets/custom.scss'

import store from './util/store'
import { basePath } from '../config/common'

import './util/i18n'
import { initSentry } from './util/sentry'
import se from './util/locales/se'

if (process.env.NODE_ENV === 'production') {
  initSentry()
}

const refresh = () => {
  const container = document.getElementById('root')
  const root = createRoot(container)
  root.render(
    <Provider store={store}>
      <BrowserRouter basename={basePath}>
        <ErrorBoundary>
          {process.env.NODE_ENV === 'development' && <UserFaker />}
          <App />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>,
  )
}

if (process.env.NODE_ENV === 'development') {
  const newUser = 'cypressRandomRightsUser'
  const currentFakeUser = window.localStorage.getItem('fakeUser')

  if (!currentFakeUser || !cypressUids.includes(JSON.parse(currentFakeUser).uid)) {
    setHeaders(newUser)
  }

  // if you want to pick the user 'nicely' set the following key in local storage
  if (window.localStorage.getItem('pickUser')) {
    // eslint-disable-next-line no-alert
    const user = window.prompt(
      `select user (two first only in prod db):\n\n${possibleUsers.map(u => u.uid).join('\n')}`,
    )
    setHeaders(user)
  }
}

refresh()
