import { IconButton, Input, InputAdornment } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SearchIcon from '@mui/icons-material/Search'
import './Generic.scss'

const ProgrammeFilter = ({ onEmpty, handleChange, filter, label, t, size = 'normal' }) => (
  <div className={`programme-filter-${size}`}>
    <label>{label}</label>
    <Input
      className="programme-filter-input"
      data-cy="programme-filter"
      name="filter"
      onChange={handleChange}
      placeholder={t('programmeFilter')}
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon />
        </InputAdornment>
      }
      value={filter}
    />
    <IconButton basic className="empty-answer" onClick={onEmpty}>
      <CloseIcon color="error" fontSize="medium" />
    </IconButton>
  </div>
)

export default ProgrammeFilter
