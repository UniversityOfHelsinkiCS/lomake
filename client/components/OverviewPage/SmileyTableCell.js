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

const SmileyTableCell = ({
  programmesName,
  programmesKey,
  programmesAnswers,
  questionId,
  questionType,
  setModalData,
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
  const lighId = `${questionId}_light`
  const textAnswer = programmesAnswers[textId] || getMeasuresAnswer()
  const lightAnswer = programmesAnswers[lighId]

  if (lightAnswer) {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className={`square-${lightAnswer}`}
      >
        <Icon
          name={lightEmojiMap[lightAnswer]}
          style={{ cursor: 'pointer', margin: '0 auto' }}
          size="big"
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
        />
      </div>
    )
  }

  if (textAnswer && questionType !== 'ENTITY') {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: colors.background_blue }}
      >
        <Icon
          name="discussions"
          style={{ cursor: 'pointer' }}
          size="big"
          onClick={() =>
            setModalData({
              header: questions.reduce((acc, cur) => {
                if (acc) return acc
                const header = cur.parts.reduce((acc, cur) => {
                  if (acc) return acc

                  if (cur.id === questionId) {
                    if (cur.description) return cur.description[languageCode]
                    return cur.label[languageCode]
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
        />
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
