import React, { useEffect } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Button, Icon } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
// import { Link } from 'react-router-dom'
import { isAdmin, isSuperAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
// import StatusMessage from 'Components/FormView/StatusMessage'
// import SaveIndicator from 'Components/FormView/SaveIndicator'
// import FacultyForm from 'Components/EvaluationView/FacultyForm'

import postItImage from 'Assets/post_it.jpg'
import { colors } from 'Utilities/common'

// import {
//   facultyEvaluationQuestions as questions,
//   evaluationQuestions as programmeQuestions,
// } from '../../../questionData'

const FacultyFormView = ({ room, formString }) => {
  const history = useHistory()
  const form = parseInt(formString, 10) || null
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  // placeHolder
  const faculties = useSelector(state => state.faculties.data)
  const faculty = faculties ? faculties.find(f => f.code === room) : null

  const oodiFacultyURL = `https://oodikone.helsinki.fi/evaluationoverview/faculty/${room}`

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
  }, [lang, room])

  // TO FIX To be removed
  if (!isAdmin(user)) return <Redirect to="/" />

  // if (!room || !form) return <Redirect to="/" />

  return (
    <>
      {!isSuperAdmin(user) ? (
        <>
          <div style={{ marginBottom: '2em' }}>
            <Button onClick={() => history.push('/evaluation-faculty')} icon="arrow left" />
          </div>
          Saavuit tiedekunnan {room} lomakesivulle! Tämä näkymä on vielä kehitysvaiheessa.
        </>
      ) : (
        <div className="form-container">
          <NavigationSidebar programmeKey={room} formType="evaluation" formNumber={form} />
          <div className="the-form">
            <div className="form-instructions">
              <div className="hide-in-print-mode">
                {/* <SaveIndicator /> */}
                <div style={{ marginBottom: '2em' }}>
                  <Button onClick={() => history.push('/evaluation-faculty')} icon="arrow left" />
                </div>
                <img alt="form-header-calendar" className="img-responsive" src={postItImage} />
              </div>
              <h1 style={{ color: colors.blue }}>{faculty?.name[lang]}</h1>
              <h3 style={{ marginTop: '0' }} data-cy="formview-title">
                {t('evaluation')} 2023
              </h3>

              <div className="hide-in-print-mode">
                {/* <StatusMessage programme={room} form={form} /> */}
                <div
                  style={{
                    lineHeight: 2,
                    backgroundColor: colors.background_blue,
                    padding: '1.5em 0.5em',
                    borderRadius: '5px',
                    margin: '2em 0em 1em 0em',
                  }}
                >
                  <p>
                    <Trans i18nKey="formView:evaluationInfo1" />
                    {/* TO FIX -> tiedekunnan */}
                  </p>
                </div>
                <p>{t('formView:info2')}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="big-circle-green" />
                {t('positive')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="big-circle-yellow" />
                {t('neutral')}
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="big-circle-red" />
                {t('negative')}
              </div>

              <div style={{ marginTop: '2em' }}>
                <h4 data-cy="formview-links">Taustamateriaali</h4>
                <p>
                  Alla olevasta linkistä voitte tarkastella kootusti kaikkia tiedekunnan katselmointikierroksella
                  kirjattuja vastauksia.
                </p>
                <p>
                  Lisäksi tässä lomakkeessa on kunkin kysymyksen yhteyteen lisätty tiivistelmä tiedekunnan
                  katselmointikysymysten vastauksista.
                </p>
                <p>
                  Oodikoneseen on luotu näkymä katselmoinnin tueksi. Tähän näkymään on kerätty keskeisimpiä tilastoja
                  tiedekuntanne opiskelijoista ja heidän opintojensa etenemisestä. Alla linkki tiedekuntatason näkymään.
                </p>
              </div>

              <div
                className="past-answers-link"
                style={{
                  lineHeight: 2,
                  backgroundColor: colors.background_blue,
                  padding: '1.5em 0.5em',
                  borderRadius: '5px',
                  margin: '2em 0em 1em 0em',
                }}
              >
                {/* <Link data-cy={`link-to-old-${room}-answers`} to={summaryURL} target="_blank">
                  <h4 style={{ marginBottom: '0.5em' }}>
                    Tarkastele kaikkia aiempien vuosiseurontojen vastauksia <Icon name="external" />{' '}
                  </h4>
                </Link> */}
                <a href={oodiFacultyURL} data-cy={`link-to-oodikone-faculty-${room}`} target="_blank" rel="noreferrer">
                  <h4>
                    Tarkastele tiedekunnan tietoja Oodikonessa <Icon name="external" />{' '}
                  </h4>
                </a>
              </div>
            </div>
            {/* <div style={{ paddingBottom: '6em' }}>
              <FacultyForm facultyKey={faculty.code} questions={questions} form={form} />
            </div> */}
          </div>
        </div>
      )}
    </>
  )
}

export default FacultyFormView
