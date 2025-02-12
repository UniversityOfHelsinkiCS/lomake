import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '@/client/util/store'
import type { Faculty } from '@/shared/lib/types'
import { clearLevelSpecificFilters, setFaculty } from '@/client/util/redux/filterReducer'

import { MenuItem, FormControl, Checkbox, ListItemText } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'

/*
This is a purpose built component for filtering faculties.
*/

const FacultyFilterComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language)
  const faculties = useSelector((state: RootState) => state.faculties.data)
  const selectedFaculties = useSelector((state: RootState) => state.filters.faculty)
  const allowedFaculties = faculties.filter((f: Faculty) => f.code !== 'HTEST' && f.code !== 'UNI')

  // If selectedFaculties is not found in allowedFaculties, fallback to allFaculties
  useEffect(() => {
    const allowedFacultiesCodes = allowedFaculties.map((f: Faculty) => f.code)
    const isValid =
      selectedFaculties[0] === 'allFaculties' ||
      selectedFaculties.every((f: Faculty) => allowedFacultiesCodes.includes(f))

    if (!isValid) {
      dispatch(setFaculty(['allFaculties']))
    }
  }, [selectedFaculties])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string[]

    if (value.length < 1) {
      if (selectedFaculties[0] === 'allFaculties') {
        return
      }
      dispatch(setFaculty(['allFaculties']))
      return
    }

    const tempNewValue = value
    if (value[0] === 'allFaculties') {
      tempNewValue.shift()
    }

    if (tempNewValue.includes('allFaculties')) {
      dispatch(setFaculty(['allFaculties']))
      return
    }

    dispatch(setFaculty(tempNewValue))
  }

  const getOptions = () => {
    const facultiesWithAll = [{ key: 'allFaculties', value: 'allFaculties', text: t('generic:allFaculties') }]

    if (!allowedFaculties || allowedFaculties.length < 1) {
      return facultiesWithAll
    }

    return facultiesWithAll.concat(
      allowedFaculties.map((f: Faculty) => ({
        key: f.code,
        value: f.code,
        // TODO: Make a global type of lang options
        text: f.name[lang as 'en' | 'fi' | 'se'],
      })),
    )
  }
  const options = getOptions()

  const getFacultyName = (selected: string[]) =>
    selected.map(value => options.find(option => option.value === value)?.text)

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          id="faculty-filter"
          // data-cy="faculty-filter"
          multiple
          value={selectedFaculties}
          onChange={handleChange}
          renderValue={selected => getFacultyName(selected).join(', ')}
        >
          {options?.map(option => (
            <MenuItem key={option.key} value={option.value}>
              <Checkbox checked={selectedFaculties.includes(option.value)} />
              <ListItemText primary={option.text} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default FacultyFilterComponent
