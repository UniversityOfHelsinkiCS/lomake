import Textarea from './Textarea'

const TextareaUniversity = ({ label, id, required, summaryData, form, maxLength, marginTop }) => {
  const showOnlyOverall = id === 'evaluation_group_development_targets_and_actionable_items'
  return (
    <div data-cy={`university-textarea-${id}`} style={{ marginTop: marginTop ?? 0 }}>
      {showOnlyOverall ? (
        <Textarea
          form={form}
          id={`${id}-arviointi-overall`}
          label={label}
          maxLength={maxLength}
          required={required}
          summaryData={summaryData}
        />
      ) : (
        <>
          <Textarea
            form={form}
            id={`${id}-bachelor`}
            label={label}
            maxLength={maxLength}
            required={required}
            summaryData={summaryData}
          />
          <Textarea
            form={form}
            id={`${id}-master`}
            label={null}
            maxLength={maxLength}
            required={required}
            summaryData={summaryData}
          />
          <Textarea
            form={form}
            id={`${id}-doctoral`}
            label={null}
            maxLength={maxLength}
            required={required}
            summaryData={summaryData}
          />
        </>
      )}
    </div>
  )
}

export default TextareaUniversity
