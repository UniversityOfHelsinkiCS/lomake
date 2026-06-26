import { useSelector } from 'react-redux'
import './Generic.scss'

const SimpleTextarea = ({ label, id }) => {
  const fieldName = `${id}_text`
  const value = useSelector(({ form }) => form.data[fieldName] ?? '')
  const viewOnly = true

  if (viewOnly && !value?.trim().length) return null // Dont render non-existing measures

  return (
    <div className="form-textarea">
      <label>{label}</label>
      {value}
    </div>
  )
}

export default SimpleTextarea
