import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { Button } from 'semantic-ui-react'

import { isAdmin } from '../../../config/common'
import ColorTableCell from './ColorTableCell'

const ManageCell = ({ program, setProgramControlsToShow }) => (
  <div className="table-container-manage-cell">
    <Button circular data-cy={`${program.key}-manage`} icon="user" onClick={() => setProgramControlsToShow(program)} />
  </div>
)

const TableRow = ({ p, selectedAnswers, tableIds, setModalData, setProgramControlsToShow, formType, form }) => {
  const oldAnswers = useSelector(state => state.oldAnswers)
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const year = useSelector(({ filters }) => filters.year)
  const lang = useSelector(state => state.language)

  const programme = selectedAnswers.find(a => a.programme === p.key && a.form === form)

  let targetURL = `/yearly/form/${form}/${p.key}`
  if (formType === 'evaluation') {
    targetURL = `/evaluation/form/${form}/${p.key}`
  } else if (formType === 'degree-reform') {
    targetURL = `/degree-reform/form/${p.key}`
  } else if (formType === 'degree-reform-individual') {
    targetURL = `/individual`
  } else if (formType === 'meta-evaluation' || formType === 'meta-doctoral') {
    targetURL = `/meta-evaluation/form/${form}/${p.key}`
  }

  const lastYearsAnswers = oldAnswers?.years?.includes(year - 1)
    ? oldAnswers.data.filter(a => a.year === year - 1)
    : null

  const programmeLastYear = lastYearsAnswers ? lastYearsAnswers.find(a => a.programme === p.key) : null

  const hasManagementAccess = program => {
    if (isAdmin(currentUser)) return true
    return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
  }

  return (
    <React.Fragment key={p.key}>
      <div className="table-container-row-link">
        <Link data-cy={`colortable-link-to-${p.key}`} to={targetURL}>
          {p.name[lang]}
        </Link>
      </div>
      <div className="table-container-row-link">
        <Link to={targetURL}>{p.key}</Link>
      </div>
      {tableIds.map(idObject => (
        <ColorTableCell
          acualQuestionId={idObject.acual_id}
          form={form}
          key={`${p.key}-${idObject.id}`}
          programmesAnswers={programme?.data ?? {}}
          programmesKey={p.key}
          programmesName={p.name[lang]}
          programmesOldAnswers={programmeLastYear?.data ?? null}
          questionId={idObject.id}
          questionType={idObject.type}
          setModalData={setModalData}
        />
      ))}
      {hasManagementAccess(p.key) ? (
        <ManageCell program={p} setProgramControlsToShow={setProgramControlsToShow} />
      ) : (
        <div />
      )}
    </React.Fragment>
  )
}

export default TableRow
