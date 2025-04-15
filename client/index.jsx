import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import ErrorBoundary from './components/ErrorBoundary'
import UserFaker from './components/UserFaker'
import App from './components/App'
import { cypressUids, setHeaders, possibleUsers } from '../config/mockHeaders'
import { ThemeProvider } from '@mui/material/styles'
import theme from '/theme'
import './assets/custom.scss'

import '@fontsource/lato/300.css'
import '@fontsource/lato/400.css'
import '@fontsource/lato/700.css'
import '@fontsource/lato/300-italic.css'

import store from './util/store'
import { basePath } from '../config/common'

import './util/i18n'
import { initSentry } from './util/sentry'

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
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>,
  )
}

if (process.env.NODE_ENV === 'development') {
  const newUser = 'superAdmin'
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
