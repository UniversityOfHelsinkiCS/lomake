import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'
import { useTranslation } from 'react-i18next'
import PieForFaculty from './PieForFaculty'

const TableRow = ({ faculty, selectedAnswers, tableIds, setModalData, form, showDataByProgramme }) => {
  const lang = useSelector(state => state.language)
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
      <div>
        <p style={{ margin: '0' }}>{t('bachelor')}</p>
        <p style={{ margin: '0' }}>{t('master')}</p>
        <p style={{ margin: '0' }}>{t('doctoral')}</p>
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
      <div />
    </React.Fragment>
  )
}

export default TableRow
