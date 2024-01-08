import React from 'react'
import './Generic.scss'
import Actions from './Actions'

const ActionsUniversity = ({ id, label, description, form, required, extrainfo, programme, summaryData }) => {
  return (
    <div>
      <Actions
        id={`${id}_bachelor`}
        label={label}
        description={description}
        form={form}
        required={required}
        extrainfo={extrainfo}
        programme={programme}
        summaryData={summaryData}
      >
        {' '}
      </Actions>
      <Actions
        id={`${id}_master`}
        label={label}
        description={description}
        form={form}
        required={required}
        extrainfo={extrainfo}
        programme={programme}
        summaryData={summaryData}
      >
        {' '}
      </Actions>
      <Actions
        id={`${id}_doctoral`}
        label={label}
        description={description}
        form={form}
        required={required}
        extrainfo={extrainfo}
        programme={programme}
        summaryData={summaryData}
      >
        {' '}
      </Actions>
    </div>
  )
}

export default ActionsUniversity
