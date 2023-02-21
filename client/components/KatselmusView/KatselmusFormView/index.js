import React, { useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { isAdmin } from '@root/config/common'
import { colors } from 'Utilities/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import calendarImage from 'Assets/calendar.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import EvaluationForm from './KatselmusForm'

import questions from '../../../katselmusQuestions.json'
import yearlyQuestions from '../../../questions.json'

const KatselmusFormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  // const programme = useSelector(state => state.studyProgrammes.singleProgram)
  // ^ might need to create a new state to not mess with vuosikatsaus?

  const allOldAnswers = useSelector(state => state.oldAnswers.data.filter(a => a.programme === room))

  // temporary fix for programme being lost in refresh
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('katselmus')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  const findAnswers = relatedQuestion => {
    const years = [2020, 2021, 2022]
    const result = {}
    years.forEach(year => {
      const yearData = allOldAnswers.find(a => a.year === year)
      const text = yearData.data[`${relatedQuestion}_text`]
      const light = yearData.data[`${relatedQuestion}_light`]

      result[year] = { text, light }
    })
    result.details = yearlyQuestions.flatMap(section => section.parts).find(part => part.id === relatedQuestion)
    return result
  }

  const yearlyAnswers = useMemo(() => {
    const result = {}
    questions.forEach(q => {
      q.parts.forEach(part => {
        if (part.relatedYearlyQuestions) {
          part.relatedYearlyQuestions.forEach(relatedQuestion => {
            if (result[part.id] === undefined) {
              result[part.id] = {}
            }
            result[part.id][relatedQuestion] = findAnswers(relatedQuestion)
          })
        }
      })
    })
    return result
  }, [room, user])

  // To be removed
  if (!isAdmin(user)) return <Redirect to="/" />

  if (!room) return <Redirect to="/" />

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  const targetURL = `/katselmus/previous-years/${room}`

  return (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} katselmus />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={calendarImage} />
          </div>
          <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('katselmus')} 2023
          </h3>

          <div className="hide-in-print-mode">
            <p>
              Katselmuksessa tarkastellaan koulutusohjelman tilannetta laajemmin <b>kolmen viime vuoden ajalta</b>.
            </p>
            <p>Keskustelkaa koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista.</p>
            <p>{t('formView:info2')}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              alt="positive-emoji"
              src={positiveEmoji}
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {t('positive')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
            <img
              src={neutralEmoji}
              alt="neutral-emoji"
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '5px',
                marginTop: '5px',
                marginBottom: '5px',
              }}
            />{' '}
            {t('neutral')}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
            <img
              src={negativeEmoji}
              alt="negative-emoji"
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {t('negative')}
          </div>

          <div>
            <br /> <br />
            <p>
              Alla linkistä voitte tarkastella kootusti kaikkia vuosiseurannassa kirjattuja vastauksia edellisen kolmen
              vuoden ajalta.
            </p>
            <p>
              Lisäksi tässä lomakkeessa on kunkin kysymyksen yhteyteen lisätty tiivistelmä kyseiseen teemaan
              vuosiseurannan kysymysten vastauksista.
            </p>
          </div>

          <div
            className="past-answers-link"
            style={{
              lineHeight: 2,
              backgroundColor: colors.background_blue,
              padding: '1.5em 0.5em',
              borderRadius: '5px',
              margin: '4em 0em 1em 0em',
            }}
          >
            <Link data-cy={`link-to-old-${room}-answers`} to={targetURL} target="_blank">
              <h4>
                Tarkastele kolmen edellisen vuoden vastauksia <Icon name="external" />{' '}
              </h4>
            </Link>
          </div>
        </div>
        <EvaluationForm programmeKey={programme.key} questions={questions} yearlyAnswers={yearlyAnswers} />
      </div>
    </div>
  )
}

export default KatselmusFormView
