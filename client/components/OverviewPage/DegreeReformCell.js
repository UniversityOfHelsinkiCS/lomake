import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { degreeReformBackgroundColor } from 'Utilities/common'

// TODO this is likely a copy paste from somewhere
const mapToTranslation = {
  first: 'formView:stronglyDisagree',
  second: 'formView:partiallyDisagree',
  third: 'formView:neitherNor',
  fourth: 'formView:partiallyAgree',
  fifth: 'formView:stronglyAgree',
  idk: 'formView:doNotKnow',
}

const DegreeReformCell = ({
  programmesKey,
  questionId,
  acualQuestionId,
  programmesAnswers,
  questions,
  setModalData,
  programmesName,
}) => {
  const { t } = useTranslation()
  const questionOfCell = questions.find(q => q.id === acualQuestionId)
  const questionKeys = questionOfCell.parts.filter(p => p.radioOptions === 'numbers').map(p => p.id)
  const lang = useSelector(state => state.language)

  const answerValues = ['first', 'second', 'third', 'fourth', 'fifth']

  const answeredQuestionKeys = questionKeys.filter(k => programmesAnswers[k])

  const noIdkKeys = answeredQuestionKeys.filter(k => {
    return programmesAnswers[k] !== 'idk'
  })

  const sum = noIdkKeys.reduce((sum, key) => {
    const answer = programmesAnswers[key]
    return sum + answerValues.indexOf(answer) + 1
  }, 0)

  const noIdkCount = noIdkKeys.length

  const average = noIdkCount > 0 ? (sum / noIdkCount).toFixed(1) : ''

  const textAnswerKey = `${questionOfCell.parts.find(p => p.type === 'TEXTAREA').id}_text`
  const possibleTextAnswer = programmesAnswers[textAnswerKey]

  const background = acualQuestionId === 10 && possibleTextAnswer ? '#E5E4E2' : degreeReformBackgroundColor(average)

  const getContent = () => {
    const radioAnswers = answeredQuestionKeys.reduce((acc, key) => {
      const part = questionOfCell.parts.find(p => p.id === key)
      const label = part.label[lang]
      const answer = t(mapToTranslation[programmesAnswers[key]])
      return `${acc}\n\n${label}:  **${answer}**`
    }, '')

    return possibleTextAnswer ? `${radioAnswers}\n\n\n*${possibleTextAnswer}*` : radioAnswers
  }

  const modalData = () =>
    setModalData({
      header: questionOfCell.title[lang],
      programme: programmesName,
      color: background,
      content: getContent(),
    })

  return (
    <div data-cy={`${programmesKey}-${questionId}`} className="square" style={{ background }} onClick={modalData}>
      {average}
    </div>
  )
}

export default DegreeReformCell
