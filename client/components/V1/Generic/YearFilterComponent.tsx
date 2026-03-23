import { setKeyDataYear, clearLevelSpecificFilters } from '../../../redux/filterReducer'

import { MenuItem, FormControl } from '@mui/material'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import { inProduction } from '@/config/common'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

const YearFilterComponent = () => {
  const dispatch = useAppDispatch()
  const selectedYear = useAppSelector(state => state.filters.keyDataYear)

  // TODO: figure out a policy how allowed years are determined

  // If an invalid year is selected, the user will see the year as an greyed out option and state will not be updated.
  // allow 2024 when running tests
  const allowedYears = !inProduction ? ['2024', '2025', '2026'] : ['2025', '2026']

  const handleChange = (event: SelectChangeEvent<string>) => {
    dispatch(clearLevelSpecificFilters())

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const value = event.target.value as string
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    allowedYears.includes(value) && dispatch(setKeyDataYear(value))
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          data-cy="year-filter"
          displayEmpty
          onChange={handleChange}
          renderValue={value => (allowedYears.includes(value) ? value : <span style={{ opacity: 0.4 }}>{value}</span>)}
          value={selectedYear}
        >
          {allowedYears.map(option => (
            <MenuItem data-cy="year-filter-option" key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default YearFilterComponent
