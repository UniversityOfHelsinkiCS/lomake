import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { images } from 'Utilities/common'
import './AboutPage.scss'

export default () => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()

  useEffect(() => {
    document.title = `${t('aboutPage:title')}`
  }, [lang])

  return (
    <>
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
      <div className="footer">
        <a href="https://toska.dev/">
          <div className="footer text">
            <p>{t('aboutPage:broughtBy')}</p>
          </div>
          <div className="footer logo">
            <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="toska-logo" />
          </div>
        </a>
      </div>
    </>
  )
}
