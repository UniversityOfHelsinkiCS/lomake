import React from 'react'
import { Button, Input } from '@mui/material'

import './Generic.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, label, t, size = 'normal' }) => (
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

export default ProgrammeFilter
