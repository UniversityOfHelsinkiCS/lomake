import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '@root/config/common'

const ManageCell = ({ faculty, setProgramControlsToShow }) => (
  <div className="table-container-manage-cell">
    <Button data-cy={`${faculty.code}-manage`} icon="user" circular onClick={() => setProgramControlsToShow(faculty)} />
  </div>
)

const TableRow = ({ question, selectedAnswers, tableIds, setModalData, form, setProgramControlsToShow, committee }) => {
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const { t } = useTranslation()
  const targetURL = `/evaluation-university/form/${form}/${committee.code}#${question.id}`

  const hasManagementAccess = program => {
    if (isAdmin(currentUser)) return true
    return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
  }
  return (
    <React.Fragment key={form}>
      <div className="table-container-row-link">
        <Link data-cy="colortable-link-to-[question-fill-this]" to={targetURL}>
          {question.label[lang]}
        </Link>
      </div>
      <div className="table-container-row-link">
        <Link to={targetURL}>{committee.code}</Link>
      </div>
      <div style={{ marginRight: '0.5em' }}>
        <p style={{ margin: '0' }}>{t('bachelorShort')}</p>
        <p style={{ margin: '0' }}>{t('masterShort')}</p>
        <p style={{ margin: '0' }}>{t('doctoralShort')}</p>
      </div>

      {tableIds.map(idObject => (
        <ColorTableCell
          key={`${question.id}-${idObject.id}`}
          programmesName={committee.name[lang]}
          programmesKey={committee.code}
          programmesAnswers={selectedAnswers}
          programmesOldAnswers={null}
          questionId={committee.id}
          questionType={committee.type}
          setModalData={setModalData}
          form={form}
        />
      ))}

      {hasManagementAccess(committee.code) ? (
        <ManageCell faculty={committee} setProgramControlsToShow={setProgramControlsToShow} />
      ) : (
        <div />
      )}
    </React.Fragment>
  )
}

export default TableRow
