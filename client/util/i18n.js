import * as i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import fi from './locales/fi'
import en from './locales/en'
import sv from './locales/sv'

i18n.use(initReactI18next).init({
  lng: 'fi',
  fallbackLng: 'en',
  defaultNS: 'common',
  resources: {
    fi,
    en,
    sv,
  },
})

export default i18n
