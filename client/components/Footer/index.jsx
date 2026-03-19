import './Footer.scss'
import { useTranslation } from 'react-i18next'
import { images } from '../../util/common'

export const Footer = () => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ height: '10em', marginTop: 'auto' }} />
      <footer className="footer">
        <div>
          <a href="https://toska.dev/">
            <div className="footer text">
              <p>{t('aboutPage:broughtBy')}</p>
            </div>
            <div className="footer logo">
              <img alt="toska-logo" src={images.toska_color} style={{ width: '75px', height: 'auto' }} />
            </div>
          </a>
        </div>
      </footer>
    </>
  )
}
