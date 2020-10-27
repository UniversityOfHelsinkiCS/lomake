import React from 'react'
import { Button, Input } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, lang }) => (

  <div className="programme-filter">
    <label>{translations.programmeFilter[lang]}</label>
    <Input
      data-cy="programme-filter"
      name="filter"
      className="programme-filter-input"
      icon="search"
      placeholder={translations.filter[lang]}
      onChange={handleChange}
      value={filter}
    />
    <Button
      onClick={onEmpty}
      className="empty-answer"
      basic color="red"
      icon="close"
    />
  </div>
)

export default ProgrammeFilter