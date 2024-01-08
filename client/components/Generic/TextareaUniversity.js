import React from 'react'
import Textarea from './Textarea'

const TextareaUniversity = ({ label, id, required, summaryData, form, maxLength, marginTop }) => {
  return (
    <div data-cy={`university-textarea-${id}`} style={{ marginTop: marginTop || 0 }}>
      <h2>Kandi</h2>

      <Textarea
        id={`${id}_bachelor`}
        label={label}
        required={required}
        form={form}
        summaryData={summaryData}
        maxLength={maxLength}
      />
      <h2>Maisteri</h2>

      <Textarea
        id={`${id}_master`}
        label={null}
        required={required}
        form={form}
        summaryData={summaryData}
        maxLength={maxLength}
      />
      <h2>Tohtori</h2>
      <Textarea
        id={`${id}_doctoral`}
        label={null}
        required={required}
        form={form}
        summaryData={summaryData}
        maxLength={maxLength}
      />
    </div>
  )
}

export default TextareaUniversity
