import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { clearDoctorFilters, setDoctoralSchool } from 'Utilities/redux/filterReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'


const DoctoralSchoolFilter = () => {
  const dispatch = useDispatch()
  const doctoralSchool = useSelector((state) => state.filter.doctoralSchool)
  const lang = useSelector((state) => state.language)

  const handleChange = (e, { value }) => {
    dispatch(clearDoctorFilters())
    dispatch(setDoctoralSchool(value))
  }

  const options = [
    {
      "key": "allSchools",
      "text": translations.allDoctoralSchools[lang],
      "value": "allSchools"
    },
    {
      "key": "social",
      "text": translations.socialSchool[lang],
      "value": "social"
    },
    {
      "key": "sciences",
      "text": translations.sciencesSchool[lang],
      "value": "sciences"
    },
    {
      "key": "health",
      "text": translations.healthSchool[lang],
      "value": "health"
    },
    {
      "key": "environmental",
      "text": translations.environmentalSchool[lang],
      "value": "environmental"
    },
  ]

    return (
      <div className="doctoral-school-filter">
        <label>{translations.doctoralSchoolFilter[lang]}</label>
        <Select
          data-cy="doctoral-school-filter"
          fluid
          selection
          options={options}
          onChange={handleChange}
          value={doctoralSchool}
        />
      </div>
    )
}
  

export default DoctoralSchoolFilter