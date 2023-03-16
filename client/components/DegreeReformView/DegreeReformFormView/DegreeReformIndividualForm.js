import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'

import { isAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import Form from './DegreeReformForm'

import questions from '../../../koulutusuudistusQuestions.json'

const DegreeReformIndividualForm = () => {
  const history = useHistory()
  const { t } = useTranslation()
  // const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  if (!isAdmin(user)) return <Redirect to="/" />

  const formType = 'degree-reform-individual'

  return (
    <div className="form-container">
      <NavigationSidebar form={formType} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <div style={{ marginBottom: '2em' }}>
              <Button onClick={() => history.push('/')} icon="arrow left" />
            </div>
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('koulutusuudistus')} 2023
          </h3>
        </div>
        <Form questions={questions} form={formType} />
      </div>
    </div>
  )
}
export default DegreeReformIndividualForm
