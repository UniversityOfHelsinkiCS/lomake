import * as i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import fi from './locales/fi'
import en from './locales/en'
import se from './locales/se'

const getInitial = () => {
  const fromLocalStorage = window.localStorage.getItem('language_preference')
  if (fromLocalStorage) return fromLocalStorage

  const languageOfBrowser = window.navigator.language
  if (!languageOfBrowser) return 'fi'
  const languageSliced = window.navigator.language.slice(0, 2)
  if (languageSliced === 'sv') return 'se'

  return languageSliced
}

i18n.use(initReactI18next).init({
  lng: getInitial(),
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    fi,
    en,
    se,
  },
})

export default i18n
