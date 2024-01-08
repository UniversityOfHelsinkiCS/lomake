import React from 'react'
import './Generic.scss'
import Actions from './Actions'

const ActionsUniversity = ({ id, label, description, form, required, extrainfo, programme, summaryData }) => {
  const universityTitle = {
    level: 'university',
    fi: 'Yliopistotason arviointi',
    en: 'University level evaluation',
    sv: 'Universitetsnivå utvärdering',
  }

  const evaluationTitle = {
    level: 'arviointi',
    fi: 'Arviointiryhmän arvio',
    en: "Evaluation committee's evaluation",
    sv: 'Bedömningsgruppens bedömning',
  }

  const questionLevels = [universityTitle, evaluationTitle]

  return (
    <div>
      {questionLevels.map(questionLevel => (
        <>
          <Actions
            id={`${id}-${questionLevel.level}_bachelor`}
            label={label}
            description={description}
            form={form}
            required={required}
            extrainfo={extrainfo}
            programme={programme}
            summaryData={summaryData}
            questionLevel={questionLevel}
          >
            {' '}
          </Actions>
          <Actions
            id={`${id}-${questionLevel.level}_master`}
            label={label}
            description={description}
            form={form}
            required={required}
            extrainfo={extrainfo}
            programme={programme}
            summaryData={summaryData}
          >
            {' '}
          </Actions>
          <Actions
            id={`${id}-${questionLevel.level}_doctoral`}
            label={label}
            description={description}
            form={form}
            required={required}
            extrainfo={extrainfo}
            programme={programme}
            summaryData={summaryData}
          >
            {' '}
          </Actions>
        </>
      ))}
    </div>
  )
}

export default ActionsUniversity
