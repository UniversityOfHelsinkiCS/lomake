import React from 'react'
import './Generic.scss'
import Actions from './Actions'

const ActionsUniversity = ({
  id,
  label,
  description,
  form,
  required,
  extrainfo,
  programme,
  summaryData,
  noUniversityLevel,
}) => {
  const universityTitle = {
    level: 'university',
    fi: 'Yliopistotason arviointi',
    en: 'University level evaluation',
    sv: 'Universitetsnivå utvärdering',
  }

  const evaluationTitle = {
    level: 'arviointi',
    fi: 'Arviointiryhmän esittämät kehittämiskohteet ja toimenpiteet',
    se: 'Utvecklingsobjekt och åtgärder av utvärderingsgruppen',
    en: 'Areas for development and measures identified by the evaluation group',
  }

  const questionLevels = [universityTitle, evaluationTitle]

  if (noUniversityLevel === true) {
    questionLevels.shift()
  }

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
      borderColor: 'green',
      backgroundColor: '#f0f5f1',
      borderWidth: 5,
      paddingTop: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 30,
    }
  }

  return (
    <div>
      {questionLevels.map(questionLevel => {
        const isArviointi = questionLevel.level === 'arviointi'
        return (
          <div style={styleFor(questionLevel)} key={`uni-${id}-${questionLevel.level}`}>
            <Actions
              id={`${id}-${questionLevel.level}-bachelor`}
              isArviointi={isArviointi}
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
              id={`${id}-${questionLevel.level}-master`}
              isArviointi={isArviointi}
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
              id={`${id}-${questionLevel.level}-doctoral`}
              isArviointi={isArviointi}
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
            {questionLevel.level === 'arviointi' && !noUniversityLevel && (
              <Actions
                id={`${id}-${questionLevel.level}-overall`}
                isArviointi={isArviointi}
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
        )
      })}
    </div>
  )
}

export default ActionsUniversity
