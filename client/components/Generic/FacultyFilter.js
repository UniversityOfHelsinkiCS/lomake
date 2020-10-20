import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedFaculty } from 'Utilities/redux/facultyReducer'
import faculties from '../../facultyTranslations'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'


const LevelFilter = () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const selectedFaculty = useSelector(({ faculties }) => faculties.selectedFaculty)

  const handleChange = (e, { value }) => {
    dispatch(setSelectedFaculty(value))
  }

  return (
    <div className="faculty-filter">
      <label>{translations.facultyFilter[lang]}</label>
      <Select
        data-cy="faculty-filter"
        placeholder={faculties[lang]["allFaculties"]}
        fluid
        selection
        options={faculties[lang]}
        onChange={handleChange}
        value={selectedFaculty}
      />
    </div>
  )
}

export default LevelFilter