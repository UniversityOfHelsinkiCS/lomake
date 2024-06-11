import React from 'react'
import '../../EvaluationView/CommitteeOverview/OverviewPage.scss'

const MetaTableCell = ({ question, answer, onButtonClick }) => {
  const handleClick = () => {
    if (answer !== undefined && answer !== '') {
      onButtonClick(question, answer)
    }
  }

  return (
    <td>
      <div
        className={answer !== undefined && answer !== '' ? 'square-green' : 'square'}
        onClick={handleClick}
        tabIndex={answer !== undefined ? 0 : -1}
        role="button"
        aria-label={answer !== undefined ? `Answer for ${question.id}` : 'Undefined Answer'}
      >
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </div>
    </td>
  )
}

export default MetaTableCell
