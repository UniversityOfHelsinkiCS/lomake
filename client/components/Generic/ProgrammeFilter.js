import React from 'react'
import { Button, Input } from 'semantic-ui-react'

import { useTranslation } from 'react-i18next'
import './Generic.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, label, size = 'normal' }) => {
  const { t } = useTranslation()
  return (
    <div className={`programme-filter-${size}`}>
      <label>{label}</label>
      <Input
        data-cy="programme-filter"
        name="filter"
        className="programme-filter-input"
        icon="search"
        placeholder={t('programmeFilter')}
        onChange={handleChange}
        value={filter}
      />
      <Button onClick={onEmpty} className="empty-answer" basic color="red" icon="close" />
    </div>
  )
}

export default ProgrammeFilter
