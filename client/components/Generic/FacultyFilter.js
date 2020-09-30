import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select } from 'semantic-ui-react'
import { setSelectedFaculty } from 'Utilities/redux/facultyReducer'
import { translations } from 'Utilities/translations'
import './Filters.scss'


// To be moved to faculties.json
const options = {
  fi: [
    {
      key: "allFaculties",
      text: "Kaikki tiedekunnat",
      value: "allFaculties",
    },
    {
      key: 'H57',
      text: 'Bio- ja ympäristötieteellinen tiedekunta',
      value: 'H57',
    },
    {
      key: 'H20',
      text: 'Oikeustieteellinen tiedekunta',
      value: 'H20',
    },
    {
      key: 'H90',
      text: 'Eläinlääketieteellinen tiedekunta',
      value: 'H90',
    },
    {
      key: 'H55',
      text: 'Farmasian tiedekunta',
      value: 'H55',
    },
    {
      key: 'H70',
      text: 'Valtiotieteellinen tiedekunta',
      value: 'H70',
    },
    {
      key: 'H40',
      text: 'Humanistinen tiedekunta',
      value: 'H40',
    },
    {
      key: 'H60',
      text: 'Kasvatustieteellinen tiedekunta',
      value: 'H60',
    },
    {
      key: 'H30',
      text: 'Lääketieteellinen tiedekunta',
      value: 'H30',
    },
    {
      key: 'H10',
      text: 'Teologinen tiedekunta',
      value: 'H10',
    },
    {
      key: 'H50',
      text: 'Matemaattis-luonnontieteellinen',
      value: 'H50',
    },
    {
      key: 'H74',
      text: 'Svenska social- och kommunalhögskola',
      value: 'H74',
    },
    {
      key: 'H80',
      text: 'Maatalous-metsätieteellinen tiedekunta',
      value: 'H80'
    },
  ],
  en: [
    {
      key: "allFaculties",
      text: "All faculties",
      value: "allFaculties",
    },
    {
      key: 'H57',
      text: 'Faculty of Biological and Environmental Sciences',
      value: 'H57',
    },
    {
      key: 'H20',
      text: 'Faculty of Law',
      value: 'H20',
    },
    {
      key: 'H90',
      text: 'Faculty of Veterinary Medicine',
      value: 'H90',
    },
    {
      key: 'H55',
      text: 'Faculty of Pharmacy',
      value: 'H55',
    },
    {
      key: 'H70',
      text: 'Faculty of Social Sciences',
      value: 'H70',
    },
    {
      key: 'H40',
      text: 'Faculty of Arts',
      value: 'H40',
    },
    {
      key: 'H60',
      text: 'Faculty of Educational Sciences',
      value: 'H60',
    },
    {
      key: 'H30',
      text: 'Faculty of Medicine',
      value: 'H30',
    },
    {
      key: 'H10',
      text: 'Faculty of Theology',
      value: 'H10',
    },
    {
      key: 'H50',
      text: 'Faculty of Science',
      value: 'H50',
    },
    {
      key: 'H74',
      text: 'Swedish School of Social Science',
      value: 'H74',
    },
    {
      key: 'H80',
      text: 'Faculty of Agriculture and Forestry',
      value: 'H80'
    }
  ], 
  se: [
    {
      key: "allFaculties",
      text: "All faculties",
      value: "allFaculties",
    },
    {
      key: 'H57',
      text: 'Faculty of Biological and Environmental Sciences',
      value: 'H57',
    },
    {
      key: 'H20',
      text: 'Faculty of Law',
      value: 'H20',
    },
    {
      key: 'H90',
      text: 'Faculty of Veterinary Medicine',
      value: 'H90',
    },
    {
      key: 'H55',
      text: 'Faculty of Pharmacy',
      value: 'H55',
    },
    {
      key: 'H70',
      text: 'Faculty of Social Sciences',
      value: 'H70',
    },
    {
      key: 'H40',
      text: 'Faculty of Arts',
      value: 'H40',
    },
    {
      key: 'H60',
      text: 'Faculty of Educational Sciences',
      value: 'H60',
    },
    {
      key: 'H30',
      text: 'Faculty of Medicine',
      value: 'H30',
    },
    {
      key: 'H10',
      text: 'Faculty of Theology',
      value: 'H10',
    },
    {
      key: 'H50',
      text: 'Faculty of Science',
      value: 'H50',
    },
    {
      key: 'H74',
      text: 'Swedish School of Social Science',
      value: 'H74',
    },
    {
      key: 'H80',
      text: 'Faculty of Agriculture and Forestry',
      value: 'H80'
    }
  ],
}


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
        placeholder={options[lang]["allFaculties"]}
        fluid
        selection
        options={options[lang]}
        onChange={handleChange}
        value={selectedFaculty}
      />
    </div>
  )
}

export default LevelFilter