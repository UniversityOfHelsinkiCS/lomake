/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Dimmer, Segment, Header } from 'semantic-ui-react'
import NavigationSidebar from '../../FormView/NavigationSidebar'
import bigWheel from '../../../assets/big_wheel.jpg'
import StatusMessage from '../../FormView/StatusMessage'

import { getSingleUsersAnswers } from '../../../redux/formReducer'
import { getYearToShow } from '../../../util/common'
import { degreeReformIndividualQuestions as questionData } from '../../../questionData'
import DegreeReformForm from './ProgramForm'

const DegreeReformIndividual = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formData = useSelector(state => state.form)
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const formNumber = 3

  useEffect(() => {
    document.title = `${t('degree-reform-individual')}`
  }, [lang])

  const formDeadline = nextDeadline ? nextDeadline.find(dl => dl.form === formNumber) : null

  const year = getYearToShow({ draftYear, nextDeadline, form: formNumber })

  const currentRoom = useSelector(state => state.room)
  useEffect(() => {
    if (formData.pending) return
    dispatch(getSingleUsersAnswers())
  }, [year, draftYear, user, formDeadline, currentRoom])

  const formType = 'degree-reform-individual'
  return (
    <div className="form-container" data-cy="reform-individual-form-container" lang={lang}>
      <NavigationSidebar formType={formType} questionData={questionData} />
      <Dimmer.Dimmable as={Segment} dimmed={formData.ready}>
        <Dimmer active={formData.ready} verticalAlign="top">
          <div style={{ marginTop: '5em' }}>
            <Header as="h2" inverted>
              {t('formView:formReady')}
            </Header>
          </div>
        </Dimmer>

        <div className="the-form">
          <div className="form-instructions">
            <div className="hide-in-print-mode">
              <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
            </div>
            <h3 data-cy="formview-title" style={{ marginTop: 10, fontSize: 32, marginBottom: 30 }}>
              {t('degree-reform')}
            </h3>
            <StatusMessage />
          </div>
          <DegreeReformForm formType={formType} questionData={questionData} />
          <p style={{ fontSize: '15px', textAlign: 'center' }}>{t('formView:canChange')}</p>
        </div>
      </Dimmer.Dimmable>
    </div>
  )
}
export default DegreeReformIndividual
