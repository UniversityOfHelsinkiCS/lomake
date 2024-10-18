import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { setForm } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const FormFilter = ({ version = null }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [options, setOptions] = useState([
    { text: t('yearlyAssessment'), value: 1 },
    //  { text: t('degree-reform-group'), value: 2 },
    // { text: t('degree-reform-individual'), value: 3 },
    { text: t('common:formFilter:evaluation'), value: 4 },
    { text: t('evaluationFaculty'), value: 5 },
    { text: t('metaevaluation'), value: 7 },
  ])

  const filterForm = useSelector(({ filters }) => filters.form)

  useEffect(() => {
    if (version === 'compareByFaculty') {
      const filteredOptions = options.filter(option => option.value !== 5 && option.value !== 7)
      setOptions(filteredOptions)
    }
  }, [])

  const handleChange = (e, { value }) => {
    dispatch(setForm(value))
  }

  return (
    <div className={filterForm !== 4 ? `form-filter-small` : `form-filter-small-${filterForm}`}>
      <label>{t('chooseForm')}</label>
      <Select
        className="button basic gray"
        style={{ width: '280px' }}
        data-cy="form-filter"
        fluid
        selection
        options={options}
        onChange={handleChange}
        value={filterForm}
      />
    </div>
  )
}

export default FormFilter
