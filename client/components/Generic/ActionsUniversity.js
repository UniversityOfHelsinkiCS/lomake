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
    fi: 'Arviointiryhmän toimenpide-ehdotukset',
    en: "Evaluation committee's evaluation",
    sv: 'Bedömningsgruppens bedömning',
  }

  const questionLevels = [universityTitle, evaluationTitle]

  const styleFor = ({ level }) => {
    if (level === 'university') {
      return {
        marginTop: 30,
      }
    }

    // eslint-disable-next-line consistent-return
    return {
      marginTop: 30,
      marginBottom: 10,
      borderStyle: 'solid',
      borderColor: 'gray',
      borderWidth: 5,
      paddingTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 30,
    }
  }

  return (
    <div>
      {questionLevels.map(questionLevel => (
        <div style={styleFor(questionLevel)}>
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
          {questionLevel.level === 'arviointi' && (
            <Actions
              id={`${id}-${questionLevel.level}_overall`}
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
          )}
        </div>
      ))}
    </div>
  )
}

export default ActionsUniversity
