import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import questions from '../../questions.json'
import { colors } from 'Utilities/common'
import { overviewPageTranslations as translations } from 'Utilities/translations'

const colorScoreMap = {
  green: 1,
  yellow: 0,
  red: -1,
}

const ColorTableCell = ({
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
  const colorId = `${questionId}_light`
  const textAnswer = programmesAnswers[textId] || getMeasuresAnswer()
  const colorAnswer = programmesAnswers[colorId]

  // below is a bit 🍝 but the basic idea is that we only want to show the
  // dialog to explain the icon arrows when they are shown

  let IconElement = null

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
            color: colorAnswer,
          })
        }
      >
        {questionId === 'measures' || questionId === 'measures_faculty' ? (
          <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{getMeasuresCount()}</span>
        ) : (
          <Icon name="discussions" size="large" />
        )}
      </div>
    )
  }

  if (!colorAnswer) {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: colors.background_gray }}
      />
    )
  }

  const getIcon = () => {
    if (!programmesOldAnswers) return null

    const oldColorAnswer = programmesOldAnswers[colorId]
    if (!oldColorAnswer || oldColorAnswer === colorAnswer) return null

    const difference = colorScoreMap[colorAnswer] - colorScoreMap[oldColorAnswer]

    if (difference > 0) return 'angle up'
    if (difference < 0) return 'angle down'

    return [null, colorAnswer]
  }

  const icon = getIcon()

  IconElement = (
    <div
      data-cy={`${programmesKey}-${questionId}`}
      className={`square-${colorAnswer}`}
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
          color: colorAnswer,
        })
      }
    >
      {icon && <Icon name={icon} style={{ margin: '0 auto' }} size="large" />}
    </div>
  )

  if (!icon) return IconElement

  return (
    <Popup trigger={IconElement}>
      <Icon name={icon} style={{ margin: '0 auto' }} size="large" />{' '}
      {icon === 'angle up'
        ? translations.betterThanLastYear[lang]
        : translations.worseThanLastYear[lang]}
    </Popup>
  )
}

export default ColorTableCell
