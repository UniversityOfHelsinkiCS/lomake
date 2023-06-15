import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import ColorTableCell from 'Components/OverviewPage/ColorTableCell'

const TableRow = ({ faculty, selectedAnswers, tableIds, setModalData, form }) => {
  const lang = useSelector(state => state.language)

  // const programmeAnswers = selectedAnswers.filter(a => faculty.ownedProgrammes.find(p => p.key === a.programme)) This is for programme level summary piechart
  const facultyAnswers = selectedAnswers.find(a => a.programme === faculty.code && a.form === form)
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
      {tableIds.map(idObject => (
        <ColorTableCell
          key={`${faculty.code}-${idObject.id}`}
          programmesName={faculty.name[lang]}
          programmesKey={faculty.code}
          programmesAnswers={facultyAnswers && facultyAnswers.data ? facultyAnswers.data : {}}
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
