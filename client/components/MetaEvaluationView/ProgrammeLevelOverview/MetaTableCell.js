import React from 'react'
import { Button } from 'semantic-ui-react'

const MetaTableCell = ({ question, answer, onButtonClick }) => {
  if (answer === undefined) {
    return (
      <td>
        <Button aria-label="Undefined Answer" />
      </td>
    )
  }
  return (
    <td key={`${question.id} - ${answer}`}>
      <Button onClick={() => onButtonClick(question, answer)} color="green" aria-label={`Answer for ${question}`} />
    </td>
  )
}

export default MetaTableCell
