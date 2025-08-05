import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'
import ColorTableCell from '../../OverviewPage/ColorTableCell'
import { useTranslation } from 'react-i18next'
import { isAdmin } from '../../../../config/common'
import PieForFaculty from './PieForFaculty'
import { useGetAuthUserQuery } from '@/client/redux/auth'

const ManageCell = ({ faculty, setProgramControlsToShow }) => (
  <div className="table-container-manage-cell">
    <Button data-cy={`${faculty.code}-manage`} icon="user" circular onClick={() => setProgramControlsToShow(faculty)} />
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
  const currentUser = useGetAuthUserQuery()
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
            key={`${faculty.code}-${idObject.id}`}
            questionId={idObject.id}
            selectedAnswers={selectedAnswers}
            facultyName={faculty.name[lang]}
            facultyKey={faculty.code}
            programmesAnswers={answers}
            form={form}
            setModalData={setModalData}
          />
        ))
        : tableIds.map(idObject => (
          <ColorTableCell
            key={`${faculty.code}-${idObject.id}`}
            programmesName={faculty.name[lang]}
            programmesKey={faculty.code}
            programmesAnswers={answers}
            programmesOldAnswers={null}
            questionId={idObject.id}
            questionType={idObject.type}
            setModalData={setModalData}
            form={form}
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
