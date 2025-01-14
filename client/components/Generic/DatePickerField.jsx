import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateFormField } from '../../util/redux/formReducer'
import DatePicker, { registerLocale } from 'react-datepicker'
import { fi, enGB, sv } from 'date-fns/locale'
import './Generic.scss'
import { useTranslation } from 'react-i18next'

const DatePickerField = ({ id, form, setError }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const startFieldName = `${id}_start_date_text`
  const endFieldName = `${id}_end_date_text`
  const startLabel = t('formView:facultyStartLabel')
  const endLabel = t('formView:facultyEndLabel')
  const viewOnly = useSelector(({ form }) => form.viewOnly)
  const lang = useSelector(state => state.language)
  const startValue = useSelector(({ form }) => form.data[startFieldName] || '')
  const endValue = useSelector(({ form }) => form.data[endFieldName] || '')
  const [startDate, setStartDate] = useState(startValue)
  const [endDate, setEndDate] = useState(endValue)

  registerLocale('fi', fi)
  registerLocale('en', enGB)
  registerLocale('se', sv)

  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      setError('startDateEndDateError')
    } else {
      setError(null)
    }
  }, [startDate, endDate])

  const handleChange = (date, type) => {
    if (type === 'start') {
      setStartDate(date)
      dispatch(updateFormField(startFieldName, date, form))
    } else if (type === 'end') {
      setEndDate(date)
      dispatch(updateFormField(endFieldName, date, form))
    }
  }

  if (viewOnly && (!startValue || !startValue.trim().length) && (!endValue || !endValue.trim().length)) return null

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 6px', width: '100%' }}>
        <b style={{ marginBottom: '4px' }}>{startLabel}</b>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          onChange={date => handleChange(date, 'start')}
          selected={startDate}
          disabled={!form}
          locale={lang}
          showYearDropdown
          showMonthDropdown
          fixedHeight
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: '0px 6px', width: '100%' }}>
        <b style={{ marginBottom: '4px' }}>{endLabel}</b>
        <DatePicker
          dateFormat="dd.MM.yyyy"
          onChange={date => handleChange(date, 'end')}
          selected={endDate}
          disabled={!form}
          locale={lang}
          showYearDropdown
          showMonthDropdown
          fixedHeight
        />
      </div>
    </>
  )
}

export default DatePickerField
