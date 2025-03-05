import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../../../util/store'
import { setKeyDataYear, clearLevelSpecificFilters } from '../../../util/redux/filterReducer'

import { MenuItem, FormControl } from '@mui/material'

import Select, { SelectChangeEvent } from '@mui/material/Select'

const YearFilterComponent = () => {
  const dispatch = useDispatch()
  const selectedYear = useSelector((state: RootState) => state.filters.keyDataYear)

  // TODO: figure out a policy how allowed years are determined

  // If an invalid year is selected, the user will see the year as an greyed out option and state will not be updated.
  const allowedYears = ['2025', '2024', '2023', '2022']

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string
    allowedYears.includes(value) && dispatch(setKeyDataYear(value))
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          id="level-filter"
          value={selectedYear}
          onChange={handleChange}
          displayEmpty
          renderValue={value => (allowedYears.includes(value) ? value : <span style={{ opacity: 0.4 }}>{value}</span>)}
        >
          {allowedYears.map(option => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default YearFilterComponent
