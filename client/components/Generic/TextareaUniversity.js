import React from 'react'
import Textarea from './Textarea'

const TextareaUniversity = ({ label, id, required, summaryData, form, maxLength, marginTop }) => {
  return (
    <div data-cy={`university-textarea-${id}`} style={{ marginTop: marginTop || 0 }}>
      <Textarea
        id={`${id}-bachelor`}
        label={label}
        required={required}
        form={form}
        summaryData={summaryData}
        maxLength={maxLength}
      />
      <Textarea
        id={`${id}-master`}
        label={null}
        required={required}
        form={form}
        summaryData={summaryData}
        maxLength={maxLength}
      />
      <Textarea
        id={`${id}-doctoral`}
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
