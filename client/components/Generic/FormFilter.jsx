/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { setForm } from '../../redux/filterReducer'
import './Generic.scss'

const FormFilter = ({ version = null, comparison = false }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [options, setOptions] = useState([
    { text: t('yearlyAssessment'), value: 1 },
    //  { text: t('degree-reform-group'), value: 2 },
    // { text: t('degree-reform-individual'), value: 3 },
    { text: t('common:formFilter:evaluation'), value: 4 },
    { text: t('evaluationFaculty'), value: 5 },
    { text: t('metaevaluation'), value: 7 },
    { text: t('common:facultymonitoring'), value: 8 },
  ])

  const filterForm = useSelector(({ filters }) => filters.form)

  useEffect(() => {
    if (version === 'compareByFaculty') {
      const filteredOptions = options.filter(option => option.value !== 5 && option.value !== 7 && option.value !== 8)
      setOptions(filteredOptions)
    }
  }, [])

  const handleChange = (e, { value }) => {
    dispatch(setForm(value))
  }

  if (comparison)
    return (
      <div className="year-filter-small">
        <label style={{ paddingRight: '1em' }}>{t('chooseForm')}</label>
        <Select
          className="button basic gray"
          data-cy="form-filter"
          fluid
          onChange={handleChange}
          options={options}
          selection
          style={{ width: '280px' }}
          value={filterForm}
        />
      </div>
    )

  return (
    <div className={filterForm !== 4 ? `form-filter-small` : `form-filter-small-${filterForm}`}>
      <label style={{ paddingRight: '1em' }}>{t('chooseForm')}</label>
      <Select
        className="button basic gray"
        data-cy="form-filter"
        fluid
        onChange={handleChange}
        options={options}
        selection
        style={{ width: '280px' }}
        value={filterForm}
      />
    </div>
  )
}

export default FormFilter
