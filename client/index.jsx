import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import App from './components/App'
import './assets/custom.scss'
import './assets/fonts/fonts.scss'

import store from './redux'
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
      <BrowserRouter basename={basePath.replace(/\/$/, '') || '/'}>
        <ScrollToTop />
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  )
}

refresh()
