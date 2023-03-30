import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import { isAdmin } from '@root/config/common'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'
import bigWheel from 'Assets/big_wheel.jpg'
import DegreeReformForm from './DegreeReformForm'
import questionData from '../../../degreeReformQuestions.json'
import individualQuestionData from '../../../degreeReformIndividualQuestions.json'

const DegreeReformIndividual = () => {
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)

  if (!isAdmin(user)) return <Redirect to="/" />

  const formType = 'degree-reform-individual'

  const questions = questionData.map(q => {
    if (q.id === 0 && q.parts.length === 1) {
      q.parts = individualQuestionData.concat(q.parts)
      return q
    }
    return q
  })

  return (
    <div className="form-container">
      <NavigationSidebar form={formType} />
      <div className="the-form">
        <div className="form-instructions">
          <div className="hide-in-print-mode">
            <img alt="form-header-calendar" className="img-responsive" src={bigWheel} />
          </div>
          <h3 style={{ marginTop: '0' }} data-cy="formview-title">
            {t('degree-reform-individual')} 2023
          </h3>
        </div>
        <DegreeReformForm questionData={questions} form={formType} />
      </div>
    </div>
  )
}
export default DegreeReformIndividual
