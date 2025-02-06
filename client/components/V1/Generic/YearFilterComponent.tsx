import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../util/store';
import { setYear, clearLevelSpecificFilters } from '../../../util/redux/filterReducer'

import {
  MenuItem,
  FormControl,
} from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';


const YearFilterComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const selectedYear = useSelector((state: RootState) => state.filters.year)
  
  // TODO: How do we handle years?
  const years = [
    { key: 0, value: '2025', text: '2025' },
  ]

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    // TODO: Consult! What does this do?
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string;
    dispatch(setYear(value))
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          id="level-filter"
          value={selectedYear}
          onChange={handleChange}
        >
          {years.map((option) => (
            <MenuItem key={option.key} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default YearFilterComponent
