import React from 'react'
import { useTranslation } from 'react-i18next'

const QuestionTitle = ({ id, answerColors, programmeName }) => {
  const { t } = useTranslation()
  if (typeof answerColors === 'object' && Object.keys(answerColors).length === 3) {
    const trafficLights = ['bachelor', 'master', 'doctoral'].map((level, index) => {
      return (
        <label className="answer-title">
          {index === 0 && <span>{programmeName}</span>}
          <div key={`${id}-${level}`} className="question-title-faculty">
            <span>{t(level)}</span>
            <span className={`answer-circle-${answerColors[level]}`} />
          </div>
        </label>
      )
    })
    return trafficLights
  }
  return (
    <label className="answer-title">
      <div key={id} className="question-title-programme">
        <span>{programmeName}</span>
        <span className={`answer-circle-${answerColors}`} />
      </div>
    </label>
  )
}

export default QuestionTitle
