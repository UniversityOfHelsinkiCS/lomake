import React from 'react'
import { Icon } from 'semantic-ui-react'
import { colors } from '../../util/common'
import { formKeys } from '../../../config/data'

const MeasuresCell = ({
  programmesAnswers,
  programmesKey,
  questionId,
  modalConfig,
  setModalData,
  form,
  textAnswer,
}) => {
  const getMeasuresCount = () => {
    let i = 1
    while (i < 6) {
      if (programmesAnswers[`${questionId}_${i}_text`]) {
        i++
      } else {
        break
      }
    }

    return i - 1
  }
  return (
    <div
      data-cy={`${programmesKey}-${questionId}`}
      className="square"
      style={{ background: colors.background_blue }}
      onClick={() => {
        setModalData(modalConfig)
      }}
    >
      {questionId === 'measures' || questionId === 'measures_faculty' ? (
        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {form !== formKeys.EVALUATION_COMMTTEES && getMeasuresCount()}
          {form === formKeys.EVALUATION_COMMTTEES && textAnswer}
        </span>
      ) : (
        <Icon name="discussions" size="large" />
      )}
    </div>
  )
}

export default MeasuresCell
