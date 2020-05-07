import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import questions from '../../questions.json'

const lightEmojiMap = {
  green: 'smile outline',
  yellow: 'meh outline',
  red: 'frown outline',
}

const backgroundColorMap = {
  green: '#9dff9d',
  yellow: '#ffffb1',
  red: '#ff7f7f',
}

const SmileyTableCell = ({
  programmesKey,
  programmesAnswers,
  questionId,
  questionType,
  questionIndex,
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
      <td key={`${programmesKey}-${questionId}`}>
        <div
          data-cy={`${programmesKey}-${questionId}`}
          className="square"
          style={{ background: backgroundColorMap[lightAnswer] }}
        >
          <Icon
            name={lightEmojiMap[lightAnswer]}
            style={{ cursor: 'pointer' }}
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
                programme: programmesKey,
                content: textAnswer,
                color: lightAnswer,
              })
            }
          />
        </div>
      </td>
    )
  }

  if (textAnswer && questionType !== 'ENTITY') {
    return (
      <td key={`${programmesKey}-${questionId}`}>
        <div
          data-cy={`${programmesKey}-${questionId}`}
          className="square"
          style={{ background: '#daedf4' }}
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
                programme: programmesKey,
                content: textAnswer,
                color: lightAnswer,
              })
            }
          />
        </div>
      </td>
    )
  }

  return (
    <td key={`${programmesKey}-${questionId}`}>
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: 'whitesmoke' }}
      />
    </td>
  )
}

export default SmileyTableCell
