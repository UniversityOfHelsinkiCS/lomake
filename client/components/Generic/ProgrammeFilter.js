import React from 'react'
import { Input } from 'semantic-ui-react'
import { translations } from 'Utilities/translations'
import './Filters.scss'

const ProgrammeFilter = ({ handleChange, filter, lang }) => (


  <div className="programme-filter">
    <label>{translations.searchBar[lang]}</label>
    <Input
      data-cy="overviewpage-filter"
      name="filter"
      className="programme-filter-input"
      icon="search"
      placeholder={translations.filter[lang]}
      onChange={handleChange}
      value={filter}
    />
  </div>
)

export default ProgrammeFilter