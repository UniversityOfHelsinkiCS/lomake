import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import ColorTableCell from '../../OverviewPage/ColorTableCell'
import { isAdmin } from '../../../../config/common'
import PieForFaculty from './PieForFaculty'

const ManageCell = ({ faculty, setProgramControlsToShow }) => (
  <div className="table-container-manage-cell">
    <Button circular data-cy={`${faculty.code}-manage`} icon="user" onClick={() => setProgramControlsToShow(faculty)} />
  </div>
)

const TableRow = ({
  faculty,
  selectedAnswers,
  tableIds,
  setModalData,
  form,
  showDataByProgramme,
  setProgramControlsToShow,
}) => {
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const { t } = useTranslation()
  let answers = []
  if (showDataByProgramme) {
    const programmeAnswers = selectedAnswers.filter(a => faculty.ownedProgrammes.find(p => p.key === a.programme))
    answers = programmeAnswers
  } else {
    const facultyAnswers = selectedAnswers.find(a => a.programme === faculty.code && a.form === form)
    answers = facultyAnswers ? facultyAnswers.data : {}
  }
  const targetURL = `/evaluation-faculty/form/${form}/${faculty.code}`

  const hasManagementAccess = program => {
    if (isAdmin(currentUser)) return true
    return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
  }

  return (
    <React.Fragment key={faculty.code}>
      <div className="table-container-row-link">
        <Link data-cy={`colortable-link-to-${faculty.code}`} to={targetURL}>
          {faculty.name[lang]}
        </Link>
      </div>
      <div className="table-container-row-link">
        <Link to={targetURL}>{faculty.code}</Link>
      </div>
      <div style={{ marginRight: '0.5em' }}>
        {!showDataByProgramme ? (
          <>
            <p style={{ margin: '0' }}>{t('bachelorShort')}</p>
            <p style={{ margin: '0' }}>{t('masterShort')}</p>
            <p style={{ margin: '0' }}>{t('doctoralShort')}</p>
          </>
        ) : (
          <p style={{ marginTop: '0.5em', wordWrap: 'break-word' }}>{t('overview:facultySummary')}</p>
        )}
      </div>
      {showDataByProgramme
        ? tableIds.map(idObject => (
            <PieForFaculty
              facultyKey={faculty.code}
              facultyName={faculty.name[lang]}
              form={form}
              key={`${faculty.code}-${idObject.id}`}
              programmesAnswers={answers}
              questionId={idObject.id}
              selectedAnswers={selectedAnswers}
              setModalData={setModalData}
            />
          ))
        : tableIds.map(idObject => (
            <ColorTableCell
              form={form}
              key={`${faculty.code}-${idObject.id}`}
              programmesAnswers={answers}
              programmesKey={faculty.code}
              programmesName={faculty.name[lang]}
              programmesOldAnswers={null}
              questionId={idObject.id}
              questionType={idObject.type}
              setModalData={setModalData}
            />
          ))}

      {hasManagementAccess(faculty.code) ? (
        <ManageCell faculty={faculty} setProgramControlsToShow={setProgramControlsToShow} />
      ) : (
        <div />
      )}
    </React.Fragment>
  )
}

export default TableRow
