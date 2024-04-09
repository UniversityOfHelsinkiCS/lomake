import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'
import { useTranslation } from 'react-i18next'
import { TestingHeader } from './CommitteeTableHeader'

const getCommitteeGap = ({ topLevel, gridColumnSize, index }) => {
  if (topLevel === 'university' && gridColumnSize === 3 && index === 0) return true
  if (topLevel === 'university' && gridColumnSize === 5 && index === 1) return true
  if (topLevel === 'university' && gridColumnSize === 7 && index === 2) return true

  return false
}

const TableRow = ({ question, selectedAnswers, tableIds, setModalData, form, committee, gridColumnSize = null }) => {
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
  return (
    <React.Fragment key={question.id}>
      <div className="hide-in-print-mode">
        <div className="table-container-row-link-committee">
          <Link data-cy="colortable-link-to-[question-fill-this]" to={targetURL}>
            {questionLabel}
          </Link>
        </div>
      </div>
      {tableIds.map(upperLevel => {
        return upperLevel.levels.map((level, index) => {
          if (
            level === 'overall' &&
            question.id !== 'university_ease_of_study_actions' &&
            question.id !== 'university_programme_structure_actions'
          ) {
            return <div key={`${question.id}-${upperLevel.title}-${level}`} />
          }
          const isGap = getCommitteeGap({ topLevel: upperLevel.title, gridColumnSize, index })

          return (
            <Fragment key={`${question.id}-${upperLevel.title}-${level}`}>
              <TestingHeader upperLevel={upperLevel} level={level} index={index} />
              <ColorTableCell
                programmesName={committee.name[lang]}
                programmesKey={committee.code}
                programmesAnswers={selectedAnswers}
                programmesOldAnswers={null}
                questionId={`${question.id}-${upperLevel.title}-${level}`}
                questionType={question.type}
                setModalData={setModalData}
                form={form}
                questionLabel={questionLabel}
                questionData={{ rawQuestionId: question.id, topLevel: upperLevel.title, level, questionLabel }}
                gridColumnSize={gridColumnSize}
              />
              {isGap && <div className="committee-table-square-gap" />}
            </Fragment>
          )
        })
      })}
      <div className="committee-table-row-right-padding" />
    </React.Fragment>
  )
}

export default TableRow
