import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button } from 'semantic-ui-react'

import { isAdmin } from '@root/config/common'
import ColorTableCell from './ColorTableCell'

const TableRow = ({ p, selectedAnswers, tableIds, setModalData, setProgramControlsToShow, form }) => {
  const oldAnswers = useSelector(state => state.oldAnswers)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const year = useSelector(({ filters }) => filters.year)
  const lang = useSelector(state => state.language)

  const programme = selectedAnswers.find(a => a.programme === p.key)

  let targetURL = `/form/${p.key}`
  if (form === 'evaluation') {
    targetURL = `/evaluation/form/${p.key}`
  } else if (form === 'degree-reform') {
    targetURL = `/degree-reform/form/${p.key}`
  } else if (form === 'degree-reform-individual') {
    targetURL = `/degree-reform-individual/form`
  }

  const lastYearsAnswers =
    oldAnswers && oldAnswers.years && oldAnswers.years.includes(year - 1)
      ? oldAnswers.data.filter(a => a.year === year - 1)
      : null

  const programmeLastYear = lastYearsAnswers ? lastYearsAnswers.find(a => a.programme === p.key) : null

  const hasManagementAccess = program => {
    if (isAdmin(currentUser)) return true
    return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
  }

  const ManageCell = ({ program }) => (
    <div className="table-container-manage-cell">
      <Button
        data-cy={`${program.key}-manage`}
        icon="user"
        circular
        onClick={() => setProgramControlsToShow(program)}
      />
    </div>
  )

  return (
    <React.Fragment key={p.key}>
      <div className="table-container">
        <Link data-cy={`colortable-link-to-${p.key}`} to={targetURL}>
          {p.name[lang]}
        </Link>
      </div>
      <div className="table-container">
        <Link to={targetURL}>{p.key}</Link>
      </div>
      {tableIds.map(idObject => (
        <ColorTableCell
          key={`${p.key}-${idObject.id}`}
          programmesName={p.name[lang]}
          programmesKey={p.key}
          programmesAnswers={programme && programme.data ? programme.data : {}}
          programmesOldAnswers={programmeLastYear && programmeLastYear.data ? programmeLastYear.data : null}
          questionId={idObject.id}
          questionType={idObject.type}
          setModalData={setModalData}
        />
      ))}
      {hasManagementAccess(p.key) ? <ManageCell program={p} /> : <div />}
    </React.Fragment>
  )
}

export default TableRow
