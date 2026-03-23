import { Button, Input } from 'semantic-ui-react'

import './Generic.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, label, t, size = 'normal' }) => (
  <div className={`programme-filter-${size}`}>
    <label>{label}</label>
    <Input
      className="programme-filter-input"
      data-cy="programme-filter"
      icon="search"
      name="filter"
      onChange={handleChange}
      placeholder={t('programmeFilter')}
      value={filter}
    />
    <Button basic className="empty-answer" color="red" icon="close" onClick={onEmpty} />
  </div>
)

export default ProgrammeFilter
