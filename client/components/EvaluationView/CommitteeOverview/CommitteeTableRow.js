import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'
import { useTranslation } from 'react-i18next'

const getCommitteeGap = ({ topLevel, gridColumnSize, index }) => {
  if (topLevel === 'university' && gridColumnSize === 3 && index === 0) return true
  if (topLevel === 'university' && gridColumnSize === 5 && index === 1) return true
  if (topLevel === 'university' && gridColumnSize === 7 && index === 2) return true

  return false
}

const isItEmptyCell = ({ questionId, upperLevel, level }) => {
  // This is used to create empty cells for the table when the question is not supposed to be shown in the table
  if (questionId === 'evaluation_group_development_targets_and_actionable_items' && upperLevel === 'university') {
    return true
  }
  if (
    level === 'overall' &&
    questionId !== 'university_ease_of_study_actions' &&
    questionId !== 'university_programme_structure_actions'
  ) {
    return true
  }
  if (questionId === 'evaluation_group_overall_actions' && upperLevel === 'university') {
    return true
  }
  return false
}

const isItHiddenCell = ({ questionId, upperLevel, level }) => {
  if (
    questionId === 'evaluation_group_development_targets_and_actionable_items' &&
    upperLevel === 'arviointi' &&
    level === 'master'
  ) {
    return true
  }
  return false
}

const TableRow = ({
  question,
  selectedAnswers,
  tableIds,
  setModalData,
  form,
  committee,
  gridColumnSize = null,
  finnishFormForTrafficLights,
}) => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  let formCode = `${committee.code}`
  if (lang === 'en') {
    formCode = `${committee.code}_EN`
  } else if (lang === 'se') {
    formCode = `${committee.code}_SE`
  }

  const targetURL = `/evaluation-university/form/${form}/${formCode}#${question.id}`

  let questionLabel = question.label[lang]

  if (question.id.includes('_actions')) {
    questionLabel = t('overview:developmentTarget')
  }
  const acualQuestionId = question.id

  return (
    <React.Fragment key={question.id}>
      <div className="table-container-row-link-committee">
        <Link data-cy="colortable-link-to-[question-fill-this]" to={targetURL}>
          {questionLabel}
        </Link>
      </div>

      {tableIds.map(upperLevel => {
        return upperLevel.levels.map((level, index) => {
          const isGap = getCommitteeGap({ topLevel: upperLevel.title, gridColumnSize, index })

          if (isItEmptyCell({ questionId: question.id, upperLevel: upperLevel.title, level })) {
            return (
              <>
                <div key={`${question.id}-${upperLevel.title}-${level}`} />
                {isGap && <div className="committee-table-square-gap" />}
              </>
            )
          }
          if (isItHiddenCell({ questionId: question.id, upperLevel: upperLevel.title, level })) {
            return null
          }
          const tempLevel =
            question.id === 'evaluation_group_development_targets_and_actionable_items' ? 'overall' : level
          const questionId = `${question.id}-${upperLevel.title}-${tempLevel}`
          return (
            <Fragment key={`${question.id}-${upperLevel.title}-${level}`}>
              <ColorTableCell
                programmesName={committee.name[lang]}
                programmesKey={committee.code}
                programmesAnswers={selectedAnswers}
                programmesOldAnswers={null}
                questionId={questionId}
                questionType={question.type}
                setModalData={setModalData}
                form={form}
                questionLabel={questionLabel}
                questionData={{ rawQuestionId: question.id, topLevel: upperLevel.title, level, questionLabel }}
                gridColumnSize={gridColumnSize}
                uniFormTrafficLights={finnishFormForTrafficLights}
                acualQuestionId={acualQuestionId}
              />
              {isGap && <div className="committee-table-square-gap" />}
            </Fragment>
          )
        })
      })}
    </React.Fragment>
  )
}

export default TableRow
