import React from 'react'
import { useSelector } from 'react-redux'
import { Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { colors, getMeasuresAnswer } from 'Utilities/common'
import { formKeys } from '@root/config/data'
import DegreeReformCell from './DegreeReformCell'
import Square from '../EvaluationView/CommitteeOverview/Square'
import {
  yearlyQuestions,
  evaluationQuestions,
  degreeReformIndividualQuestions,
  universityEvaluationQuestions,
  facultyEvaluationQuestions,
} from '../../questionData'
import MeasuresCell from './MeasuresCell'

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
  questionData = null,
  uniFormTrafficLights = null,
}) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const { colorBlindMode } = useSelector(state => state.filters)
  const questionMap = {
    1: yearlyQuestions,
    2: degreeReformIndividualQuestions,

    4: evaluationQuestions,
    5: facultyEvaluationQuestions,
    6: universityEvaluationQuestions,
  }

  const questions = questionMap[form] || yearlyQuestions
  if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
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

  const textId = `${questionId}_text`
  let colorId = `${questionId}_light`
  let textAnswer = programmesAnswers[textId] || getMeasuresAnswer(programmesAnswers, textId)
  let colorAnswer = null

  const getModalConfig = () => {
    // Kysymys - ylätaso - alataso
    let tempQuestionId = questionId
    let tempSubtitle = programmesName
    if (programmesKey === 'UNI') {
      tempQuestionId = questionData.rawQuestionId
      const whichLevel = questionId.match('bachelor|master|doctoral|overall')[0]
      tempSubtitle = t(`overview:selectedLevels:${whichLevel}`)
    }
    return {
      header: questions.reduce((acc, cur) => {
        if (acc) return acc
        const header = cur.parts.reduce((acc, cur) => {
          if (acc) return acc
          if (cur.id === tempQuestionId) return cur.description[lang]
          return acc
        }, '')

        if (header) return header

        return acc
      }, ''),
      programme: tempSubtitle,
      content: textAnswer,
      color: colorAnswer,
    }
  }
  if (form === formKeys.EVALUATION_FACULTIES) {
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
  } else if (form === formKeys.EVALUATION_COMMTTEES) {
    colorAnswer = { single: uniFormTrafficLights[colorId] }
    if (questionType === 'TEXTAREA_UNIVERSITY') {
      const textId = `${acualQuestionId}-overall_text`
      textAnswer = programmesAnswers[textId]
    }
  } else if (programmesAnswers[colorId] === undefined) {
    colorAnswer = null
  } else {
    colorAnswer = { single: programmesAnswers[colorId] }
  }

  if (form === formKeys.EVALUATION_COMMTTEES && questionId.includes('_actions')) {
    return (
      <Square
        setModalData={setModalData}
        programmesAnswers={programmesAnswers}
        questionId={questionId}
        t={t}
        questionData={questionData}
      />
    )
  }

  // below is a bit 🍝 but the basic idea is that we only want to show the
  // dialog to explain the icon arrows when they are shown🔥🔥🔥🔥

  let IconElement = null

  const modalConfig = getModalConfig(questions, questionId, lang, programmesName, textAnswer, colorAnswer)

  if (textAnswer && questionType === 'ENTITY_NOLIGHT') {
    return (
      <MeasuresCell
        programmesAnswers={programmesAnswers}
        programmesKey={programmesKey}
        questionId={questionId}
        modalConfig={modalConfig}
        setModalData={setModalData}
        form={form}
        textAnswer={textAnswer}
      />
    )
  }

  if ((!colorAnswer || !colorAnswer.single) && !textAnswer) {
    return (
      <div
        data-cy={`${programmesKey}-${questionId}`}
        className="square"
        style={{ background: colors.background_gray }}
      />
    )
  }
  if (questionType === 'TEXTAREA_UNIVERSITY') {
    if (!textAnswer) return null
    return (
      <div
        key={`${programmesKey}-${questionId}`}
        data-cy={`${programmesKey}-${questionId}`}
        className="square-blue"
        onClick={() => {
          setModalData(getModalConfig(modalConfig))
        }}
      />
    )
  }

  const getIcon = () => {
    if (!programmesOldAnswers) return null

    const oldColorAnswer = programmesOldAnswers[colorId]
    if (!oldColorAnswer || oldColorAnswer === colorAnswer.single) return null

    const difference = colorScoreMap[colorAnswer.single] - colorScoreMap[oldColorAnswer]

    if (difference > 0) return 'angle up'
    if (difference < 0) return 'angle down'

    return [null, colorAnswer]
  }

  const icon = getIcon()
  IconElement = (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {Object.entries(colorAnswer).map(([key, value]) => {
        return (
          <div
            key={`${programmesKey}-${questionId}-${key}`}
            data-cy={`${programmesKey}-${questionId}-${key}`}
            className={`square-${value}`}
            onClick={() => {
              setModalData(getModalConfig(modalConfig))
            }}
          >
            {colorBlindMode && t(value)}
            {icon && <Icon name={icon} style={{ margin: '0 auto' }} size="large" />}
          </div>
        )
      })}
    </div>
  )

  if (!icon) return IconElement
  return (
    <Popup trigger={IconElement}>
      <Icon name={icon} style={{ margin: '0 auto' }} size="large" />{' '}
      {icon === 'angle up' ? t('overview:betterThanLastYear') : t('overview:worseThanLastYear')}
    </Popup>
  )
}

export default ColorTableCell
