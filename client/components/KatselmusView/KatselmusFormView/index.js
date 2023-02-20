import React, { useEffect } from 'react'
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
import Form from './KatselmusForm'

import questions from '../../../katselmusQuestions.json'

const KatselmusFormView = ({ room }) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  // const programme = useSelector(state => state.studyProgrammes.singleProgram)
  // ^ might need to create a new state to not mess with vuosikatsaus?

  // temporary fix for programme being lost in refresh
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('Katselmus')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

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

          <p
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
          </p>
        </div>
        <Form programmeKey={programme.key} questions={questions} />
      </div>
    </div>
  )
}

export default KatselmusFormView