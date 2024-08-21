import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import './AboutPage.scss'

export default () => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('aboutPage:title')}`
  }, [lang])

  return (
    <div className="about-container">
      <h1>{t('aboutPage:title')}</h1>
      <div className="about-header-line" />
      <h3>{t('aboutPage:whatIsIt')}</h3>
      <p>{t('aboutPage:whatIsItReply')}</p>
      <h3>{t('aboutPage:howToFillTitle')}</h3>
      <p>{t('aboutPage:howToFill')}</p>
      <h3>{t('aboutPage:whatElseTitle')}</h3>
      <p>{t('aboutPage:whatElse')}</p>
      <p>{t('aboutPage:contactInfo')}</p>
    </div>
  )
}
