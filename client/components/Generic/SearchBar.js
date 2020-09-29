import React from 'react'
import { Input } from 'semantic-ui-react'
import { translations } from 'Utilities/translations'
import './SearchBar.scss'

const SearchBar = ({handleChange, filter, lang}) => (
  <div className="search-bar">
    <label>{translations.searchBar[lang]}</label>
    <Input
      data-cy="overviewpage-filter"
      name="filter"
      className="search-bar-input"
      icon="search"
      placeholder={translations.filter[lang]}
      onChange={handleChange}
      value={filter}
    />
  </div>
)

export default SearchBar