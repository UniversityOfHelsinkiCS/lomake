import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from 'Utilities/redux/formReducer'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi, enGB, sv } from 'date-fns/locale'

import './Generic.scss'

const DatePickerField = ({ label, id, form }) => {
  const dispatch = useDispatch()
  const fieldName = `${id}_text`
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const lang = useSelector(state => state.language)
  const value = useSelector(({ form }) => form.data[fieldName] || '')
  const [date, setDate] = useState(value)

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  const handleChange = date => {
    setDate(date)
    dispatch(updateFormField(fieldName, date, form))
  }

  if (viewOnly && (!value || !value.trim().length)) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 6px', width: '100%' }}>
      <b style={{ marginBottom: '4px' }}>{label}</b>
      <DatePicker dateFormat="dd.MM.yyyy" onChange={handleChange} selected={date} disabled={!form} locale={lang} />
    </div>
  )
}
export default DatePickerField
