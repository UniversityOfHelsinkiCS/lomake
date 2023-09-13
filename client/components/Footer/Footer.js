import React from 'react'
import './Footer.scss'
import { useTranslation } from 'react-i18next'
import { images, builtAt } from 'Utilities/common'

const Footer = () => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ height: '10em', marginTop: 'auto' }} />
      <footer className="footer" style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <a href="https://toska.dev/">
            <div className="footer text">
              <p>{t('aboutPage:broughtBy')}</p>
            </div>
            <div className="footer logo">
              <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="toska-logo" />
            </div>
          </a>
          <div className="footer updated" style={{ marginLeft: '2em', marginTop: '1em' }}>
            <p style={{ textAlign: 'end' }}>Tilannekuvalomake last updated at: {builtAt}</p>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
