import React from 'react'
import { cleanText, colors } from 'Utilities/common'

const getActionsAnswerForUniversity = (data, id) => {
  if (!data) return ''
  if (data[`${id}-text`]) return data[`${id}_text`]
  if (data[`${id}-1-text`]) {
    let actions = []
    let i = 1
    while (i < 6) {
      const actionData = data[`${id}-${i}-text`]
      let actionAreas = ''
      let actionActions = ''
      if (actionData) {
        if (actionData.title.length > 0) {
          actionAreas = cleanText(actionData.title)
        }
        if (actionData.actions.length > 0) {
          actionActions = cleanText(actionData.actions)
        }
        if (actionData.actions.length > 0 || actionData.title.length > 0) {
          actions = actions.concat({ title: actionAreas, actions: actionActions })
        }
      }
      i++
    }
    return actions
  }

  return []
}

const Square = ({ setModalData, programmesAnswers, questionId, t, questionData, showText }) => {
  const actions = getActionsAnswerForUniversity(programmesAnswers, questionId, t)
  const { level } = questionData
  const { topLevel } = questionData
  const tempModalData = {
    header: `${t(`generic:level:${topLevel}`)} - ${t(`uniAnswerLevels:${level}`)}`,
    content: actions,
    color: 'blue',
    programme: questionData.questionLabel,
    arviointi: true,
    type: 'actions',
  }
  if (actions.length === 0) {
    return <div data-cy={`${questionId}`} className="square" style={{ background: colors.background_gray }} />
  }
  if (!showText) {
    return (
      <div
        onClick={() => setModalData(tempModalData)}
        className="square-actions"
        style={{ background: colors.background_blue }}
      >
        <p style={{ fontSize: '1rem', fontWeight: 'bold' }} key={`${actions}`}>
          {actions.length}
        </p>
      </div>
    )
  }
  return (
    <div>
      {actions.map(action => (
        <div
          key={action.title}
          onClick={() => setModalData(tempModalData)}
          className="square-actions"
          style={{ background: colors.background_blue }}
        >
          <p style={{ fontSize: '1rem', fontWeight: 'bold' }} key={`${actions}`}>
            {action.title}
          </p>
        </div>
      ))}
    </div>
  )
}

export default Square
