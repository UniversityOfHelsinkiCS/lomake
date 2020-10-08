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
  const languageCode = useSelector((state) => state.language)

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

  const textId = `${questionId}_text`
  const lightId = `${questionId}_light`
  const textAnswer = programmesAnswers[textId] || getMeasuresAnswer()
  const lightAnswer = programmesAnswers[lightId]

  if (lightAnswer) {
    const getIconAndColor = () => {
      if (!programmesOldAnswers) return [lightEmojiMap[lightAnswer], lightAnswer]

      const oldLightAnswer = programmesOldAnswers[lightId]
      if (!oldLightAnswer || oldLightAnswer === lightAnswer) return ['minus', lightAnswer]

      const difference = lightScoreMap[lightAnswer] - lightScoreMap[oldLightAnswer]

      if (difference > 0) return ['angle up', 'green']
      if (difference < 0) return ['angle down', 'red']

      return ['minus', lightAnswer]
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

                if (cur.id === questionId) return cur.description[languageCode]

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
        <Icon name={icon} style={{ margin: '0 auto' }} size="big" />
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
                  return cur.description[languageCode]
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
        <Icon name="discussions" size="big" />
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
