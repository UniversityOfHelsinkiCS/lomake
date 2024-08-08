import React from 'react'
import { useTranslation } from 'react-i18next'

const QuestionTitle = ({ id, answerColors, programmeName }) => {
  const { t } = useTranslation()
  if (typeof answerColors === 'object' && Object.keys(answerColors).length === 3) {
    const trafficLights = ['bachelor', 'master', 'doctoral'].map((level, index) => {
      return (
        <label key={`${id}-${level}`} className="answer-title">
          {index === 0 && <span>{programmeName}</span>}
          <div className="question-title-faculty">
            <span>{t(level)}</span>
            <span className={`answer-circle-${answerColors[level]}`} />
          </div>
        </label>
      )
    })
    return trafficLights
  }
  return (
    <label key={id} className="answer-title">
      <div className="question-title-programme">
        <span>{programmeName}</span>
        <span className={`answer-circle-${answerColors}`} />
      </div>
    </label>
  )
}

export default QuestionTitle
