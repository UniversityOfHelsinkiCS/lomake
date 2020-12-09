import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { images } from 'Utilities/common'
import { aboutPageTranslations as translations } from 'Utilities/translations'
import './AboutPage.scss'

export default () => {
  const lang = useSelector((state) => state.language)

  useEffect(() => {
    document.title = `${translations.title[lang]}`
  }, [lang])

  return (
    <>
      <div className="about-container">
        <h1>{translations.title[lang]}</h1>
        <div className="about-header-line"/>
        <h3>
          {translations.whatIsIt[lang]}
        </h3>
        <p>
          {translations.whatIsItReply[lang]}
        </p>
        <h3>
          {translations.howShouldItBeFilled[lang]}
        </h3>
        <p>
          {translations.howShouldItBeFilledReply[lang]}
        </p>
        <h3>
          {translations.whatElseIsThere[lang]}
        </h3>
        <p>
          {translations.whatElseIsThereReply[lang]}
        </p>
        <p>
          {translations.contactInfo[lang]}
        </p>
      </div>
      <div className="footer">
        <a href="https://toska.dev/">
          <div className="footer text">
            <p>{translations.broughtToYouBy[lang]}</p>
          </div>
          <div className="footer logo">
              <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="toska-logo" />
          </div>
        </a>
      </div>
    </>
  )
}
