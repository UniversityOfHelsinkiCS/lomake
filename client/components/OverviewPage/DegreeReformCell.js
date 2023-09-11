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
  sixth: 'formView:doNotKnow',
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

  const answers = {
    first: 0,
    second: 0,
    third: 0,
    fourth: 0,
    fifth: 0,
  }
  const answerValues = Object.keys(answers)

  const answeredQuestionKeys = questionKeys.filter(k => programmesAnswers[k])

  let sum = 0
  // eslint-disable-next-line no-restricted-syntax
  for (const key of answeredQuestionKeys) {
    const answer = programmesAnswers[key]
    const val = answerValues.indexOf(answer) + 1
    answers[answer] += 1
    sum += val
  }

  const n = answeredQuestionKeys.length
  const notOnlyIdk = n > 0 && Object.values(answers).some(v => v > 0 && v < 5)

  const average = notOnlyIdk && n > 0 ? (sum / n).toFixed(1) : ''

  const background = degreeReformBackgroundColor(average)

  const content = answeredQuestionKeys.reduce((acc, key) => {
    const part = questionOfCell.parts.find(p => p.id === key)
    const label = part.label[lang]
    const answer = t(mapToTranslation[programmesAnswers[key]])
    return `${acc}\n\n${label}:  **${answer}**`
  }, '')

  const modalData = () =>
    setModalData({
      header: questionOfCell.title[lang],
      programme: programmesName,
      color: background,
      content,
    })

  return (
    <div data-cy={`${programmesKey}-${questionId}`} className="square" style={{ background }} onClick={modalData}>
      {average}
    </div>
  )
}

export default DegreeReformCell
