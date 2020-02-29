export const setLanguage = (code) => {
  window.localStorage.setItem('language_preference', code)
  return { type: 'SET_LANGUAGE', code }
}

const getInitial = () => {
  const fromLocalStorage = window.localStorage.getItem('language_preference')
  if (fromLocalStorage) return fromLocalStorage

  const languageOfBrowser = window.navigator.language
  if (!languageOfBrowser) return 'fi'
  const languageSliced = window.navigator.language.slice(0, 2)
  if (languageSliced === 'sv') return 'se'

  return languageSliced
}

export default (state = getInitial(), action) => {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return action.code
    default:
      return state
  }
}
