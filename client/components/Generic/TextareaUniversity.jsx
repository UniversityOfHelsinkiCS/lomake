import Textarea from './Textarea'

const TextareaUniversity = ({ label, id, summaryData, form, marginTop }) => {
  const showOnlyOverall = id === 'evaluation_group_development_targets_and_actionable_items'
  return (
    <div data-cy={`university-textarea-${id}`} style={{ marginTop: marginTop ?? 0 }}>
      {showOnlyOverall ? (
        <Textarea form={form} id={`${id}-arviointi-overall`} summaryData={summaryData} />
      ) : (
        <>
          <Textarea form={form} id={`${id}-bachelor`} label={label} summaryData={summaryData} />
          <Textarea form={form} id={`${id}-master`} label={label} summaryData={summaryData} />
          <Textarea form={form} id={`${id}-doctoral`} label={label} summaryData={summaryData} />
        </>
      )}
    </div>
  )
}

export default TextareaUniversity
