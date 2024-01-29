import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { colors } from 'Utilities/common'
import DegreeReformCell from './DegreeReformCell'
import { yearlyQuestions, evaluationQuestions, degreeReformIndividualQuestions } from '../../questionData'

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
  form = 1,
  acualQuestionId,
}) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const questionMap = {
    1: yearlyQuestions,
    2: degreeReformIndividualQuestions,

    4: evaluationQuestions,
  }

  const questions = questionMap[form] || yearlyQuestions

  if (form === 2) {
    return (
      <DegreeReformCell
        programmesKey={programmesKey}
        questionId={questionId}
        acualQuestionId={acualQuestionId}
        programmesAnswers={programmesAnswers}
        questions={questionMap[2]}
        setModalData={setModalData}
        programmesName={programmesName}
      />
    )
  }

  const getMeasuresAnswer = () => {
    if (!programmesAnswers) return null
    if (programmesAnswers[`${questionId}_text`]) return programmesAnswers[`${questionId}_text`]

    if (programmesAnswers[`${questionId}_1_text`]) {
      let measures = ''
      let i = 1
      while (i < 6) {
        if (programmesAnswers[`${questionId}_${i}_text`])
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
      if (programmesAnswers[`${questionId}_${i}_text`]) {
        i++
      } else {
        break
      }
    }

    return i - 1
  }

  const textId = `${questionId}_text`
  let colorId = `${questionId}_light`
  const textAnswer = programmesAnswers[textId] || getMeasuresAnswer()
  let colorAnswer = null

  if (form === 5) {
    colorId = [
      `${questionId}_light`,
      `${questionId}_bachelor_light`,
      `${questionId}_master_light`,
      `${questionId}_doctoral_light`,
    ]
    if (programmesAnswers[colorId[0]]) {
      colorAnswer = programmesAnswers[colorId[0]]
    } else {
      colorAnswer = {
        bachelor: programmesAnswers[colorId[1]],
        master: programmesAnswers[colorId[2]],
        doctoral: programmesAnswers[colorId[3]],
      }
      if (
        colorAnswer.bachelor === undefined &&
        colorAnswer.master === undefined &&
        colorAnswer.doctoral === undefined
      ) {
        colorAnswer = null
      }
    }
  } else {
    colorAnswer = programmesAnswers[colorId]
  }

  // below is a bit 🍝 but the basic idea is that we only want to show the
  // dialog to explain the icon arrows when they are shown🔥🔥🔥🔥

  let IconElement = null

  if (
    textAnswer &&
    questionType !== 'ENTITY' &&
    questionType !== 'ENTITY_LEVELS' &&
    questionType !== 'ENTITY_UNIVERSITY'
  ) {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: colors.background_blue }}
        onClick={() => {
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
        }}
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
  if ((form !== 5 && form !== 6) || typeof colorAnswer === 'string') {
    IconElement = (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className={`square-${colorAnswer}`}
        onClick={() => {
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
        }}
      >
        {icon && <Icon name={icon} style={{ margin: '0 auto' }} size="large" />}
      </div>
    )
  } else {
    IconElement = (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {Object.entries(colorAnswer).map(([key, value]) => {
          return (
            <div
              key={`${programmesKey}-${questionId}-${key}`}
              data-cy={`${programmesKey}-${questionId}-${key}`}
              className={`square-${value}`}
              onClick={() => {
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
                  color: value,
                })
              }}
            >
              {icon && <Icon name={icon} style={{ margin: '0 auto' }} size="large" />}
            </div>
          )
        })}
      </div>
    )
  }

  if (!icon) return IconElement
  return (
    <Popup trigger={IconElement}>
      <Icon name={icon} style={{ margin: '0 auto' }} size="large" />{' '}
      {icon === 'angle up' ? t('overview:betterThanLastYear') : t('overview:worseThanLastYear')}
    </Popup>
  )
}

export default ColorTableCell
