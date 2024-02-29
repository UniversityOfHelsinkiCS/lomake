import React from 'react'
import { useTranslation } from 'react-i18next'

const QuestionTitle = ({ id, answerColors }) => {
  const { t } = useTranslation()
  if (Object.keys(answerColors).length === 3) {
    const trafficLights = ['bachelor', 'master', 'doctoral'].map((level, index) => {
      if (index === 0) {
        return (
          <div key={`${id}-${level}`} className="question-title">
            <span>{t(level)}</span>
            <span className={`answer-circle-${answerColors[level]}`} />
          </div>
        )
      }
      return (
        <div key={`${id}-${level}`} className="question-title">
          <span>{t(level)}</span>
          <span className={`answer-circle-${answerColors[level]}`} />
        </div>
      )
    })
    return trafficLights
  }
  return <span className={`answer-circle-${answerColors}`} />
}

export default QuestionTitle
