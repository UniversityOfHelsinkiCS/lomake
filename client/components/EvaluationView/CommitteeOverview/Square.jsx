import { cleanText, colors } from '../../../util/common'

export const getActionsAnswerForUniversity = (data, id) => {
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
          actions = actions.concat({ index: i, title: actionAreas, actions: actionActions })
        }
      }
      i++
    }
    return actions
  }

  return []
}

const Square = ({ setModalData, programmesAnswers, questionId, t, questionData }) => {
  const actions = getActionsAnswerForUniversity(programmesAnswers, questionId, t)
  const { level } = questionData
  const { topLevel } = questionData
  const tempModalData = {
    header: `${t(`generic:level:${topLevel}`)} - ${t(`overview:selectedLevels:${level}`)}`,
    content: actions,
    color: 'blue',
    programme: questionData.questionLabel,
    arviointi: true,
    type: 'actions',
  }
  if (actions.length === 0) {
    return <div className="square" data-cy={`${questionId}`} style={{ background: colors.background_gray }} />
  }
  return (
    <div
      className="square-actions"
      data-cy={`${questionId}`}
      onClick={() => setModalData(tempModalData)}
      style={{ background: colors.background_blue }}
    >
      <p key={`${actions}`} style={{ fontSize: '1.5em', fontWeight: 'bold' }}>
        {actions.length}
      </p>
    </div>
  )
}

export default Square
