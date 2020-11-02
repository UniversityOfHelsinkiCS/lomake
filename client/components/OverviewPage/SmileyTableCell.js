import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import questions from '../../questions.json'
import { colors } from 'Utilities/common'

const lightEmojiMap = {
  green: 'smile outline',
  yellow: 'meh outline',
  red: 'frown outline',
}

const lightScoreMap = {
  green: 1,
  yellow: 0,
  red: -1,
}

const SmileyTableCell = ({
  programmesName,
  programmesKey,
  programmesAnswers,
  questionId,
  questionType,
  setModalData,
  programmesOldAnswers,
}) => {
  const lang = useSelector((state) => state.language)

  const getMeasuresAnswer = () => {
    if (!programmesAnswers) return null
    if (!!programmesAnswers[`${questionId}_text`]) return programmesAnswers[`${id}_text`]

    if (!!programmesAnswers[`${questionId}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (!!programmesAnswers[`${questionId}_${i}_text`])
          measures += `${i}) ${programmesAnswers[`${questionId}_${i}_text`]}  \n`
        i++
      }

      return measures
    }

    return null
  }

  const getMeasuresCount = () => {
    let i = 1
    while (i < 6) {
      if (!!programmesAnswers[`${questionId}_${i}_text`]) {
        i++
      } else {
        break
      }
    }

    return i - 1
  }

  const textId = `${questionId}_text`
  const lightId = `${questionId}_light`
  const textAnswer = programmesAnswers[textId] || getMeasuresAnswer()
  const lightAnswer = programmesAnswers[lightId]

  if (lightAnswer) {
    const getIconAndColor = () => {
      if (!programmesOldAnswers) return [null, lightAnswer]

      const oldLightAnswer = programmesOldAnswers[lightId]
      if (!oldLightAnswer || oldLightAnswer === lightAnswer) return [null, lightAnswer]

      const difference = lightScoreMap[lightAnswer] - lightScoreMap[oldLightAnswer]

      if (difference > 0) return ['angle up', 'green']
      if (difference < 0) return ['angle down', 'red']

      return [null, lightAnswer]
    }

    const [icon, color] = getIconAndColor()

    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className={`square-${color}`}
        onClick={() =>
          setModalData({
            header: questions.reduce((acc, cur) => {
              if (acc) return acc
              const header = cur.parts.reduce((acc, cur) => {
                if (acc) return acc

                if (cur.id === questionId) return cur.description[lang]

                return acc
              }, '')

              if (header) return header

              return acc
            }, ''),
            programme: programmesName,
            content: textAnswer,
            color: lightAnswer,
          })
        }
      >
        {icon && <Icon name={icon} style={{ margin: '0 auto' }} size="large" />}
      </div>
    )
  }

  if (textAnswer && questionType !== 'ENTITY') {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: colors.background_blue }}
        onClick={() =>
          setModalData({
            header: questions.reduce((acc, cur) => {
              if (acc) return acc
              const header = cur.parts.reduce((acc, cur) => {
                if (acc) return acc

                if (cur.id === questionId) {
                  return cur.description[lang]
                }

                return acc
              }, '')

              if (header) return header

              return acc
            }, ''),
            programme: programmesName,
            content: textAnswer,
            color: lightAnswer,
          })
        }
      >
        {questionId === 'measures' ? (
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getMeasuresCount()}</span>
        ) : (
          <Icon name="discussions" size="large" />
        )}
      </div>
    )
  }

  return (
    <div
      data-cy={`${programmesKey}-${questionId}`}
      className="square"
      style={{ background: colors.background_gray }}
    />
  )
}

export default SmileyTableCell
