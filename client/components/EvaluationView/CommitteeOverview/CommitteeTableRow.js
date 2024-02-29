import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'
import { isAdmin } from '@root/config/common'
import { useTranslation } from 'react-i18next'

const ManageCell = ({ faculty, setProgramControlsToShow }) => (
  <div className="table-container-manage-cell-committee">
    <Button data-cy={`${faculty.code}-manage`} icon="user" circular onClick={() => setProgramControlsToShow(faculty)} />
  </div>
)

const getCommitteeGap = ({ topLevel, gridColumnSize, index }) => {
  if (topLevel === 'university' && gridColumnSize === 3 && index === 0) return true
  if (topLevel === 'university' && gridColumnSize === 5 && index === 1) return true
  if (topLevel === 'university' && gridColumnSize === 7 && index === 2) return true

  return false
}

const TableRow = ({
  question,
  selectedAnswers,
  tableIds,
  setModalData,
  form,
  setProgramControlsToShow,
  committee,
  showText,
  gridColumnSize = null,
}) => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const targetURL = `/evaluation-university/form/${form}/${committee.code}#${question.id}`
  const hasManagementAccess = program => {
    if (isAdmin(currentUser)) return true
    return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
  }

  let questionLabel = question.label[lang]

  if (question.id.includes('_actions')) {
    questionLabel = t('overview:developmentTarget')
  }

  return (
    <React.Fragment key={question.id}>
      <div className="table-container-row-link-committee">
        <Link data-cy="colortable-link-to-[question-fill-this]" to={targetURL}>
          {questionLabel}
        </Link>
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
            <>
              <ColorTableCell
                key={`${question.id}-${upperLevel.title}-${level}`}
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
                showText={showText}
                gridColumnSize={gridColumnSize}
              />
              {isGap && <div className="committee-table-square-gap" />}
            </>
          )
        })
      })}

      {hasManagementAccess(committee.code) ? (
        <ManageCell faculty={committee} setProgramControlsToShow={setProgramControlsToShow} />
      ) : (
        <div />
      )}
    </React.Fragment>
  )
}

export default TableRow
