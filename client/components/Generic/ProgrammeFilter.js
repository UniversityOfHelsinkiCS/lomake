import React from 'react'
import { Button, Input } from 'semantic-ui-react'

import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, label, size = 'normal', lang }) => (
  <div className={`programme-filter-${size}`}>
    <label>{label}</label>
    <Input
      data-cy="programme-filter"
      name="filter"
      className="programme-filter-input"
      icon="search"
      placeholder={translations.filter[lang]}
      onChange={handleChange}
      value={filter}
    />
    <Button onClick={onEmpty} className="empty-answer" basic color="red" icon="close" />
  </div>
)

export default ProgrammeFilter
