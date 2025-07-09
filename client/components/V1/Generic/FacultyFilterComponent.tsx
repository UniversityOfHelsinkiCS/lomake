import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import type { Faculty } from '@/shared/lib/types'
import { clearLevelSpecificFilters, setFaculty } from '@/client/redux/filterReducer'

import { MenuItem, FormControl, Checkbox, ListItemText } from '@mui/material'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import _ from 'lodash'
import { useAppSelector, useAppDispatch } from '@/client/util/hooks'

/*
This is a purpose built component for filtering faculties.
*/

const FacultyFilterComponent = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const lang = useAppSelector(state => state.language)
  const faculties = useAppSelector(state => state.faculties.data)
  const selectedFaculties = useAppSelector(state => state.filters.faculty)
  const allowedFaculties = useMemo(() => {
    return faculties ? faculties.filter((f: Faculty) => f.code !== 'HTEST' && f.code !== 'UNI') : []
  }, [faculties])

  const options = useMemo(() => {
    const defaultOption = [{ key: 'allFaculties', value: 'allFaculties', text: t('generic:allFaculties') }]
    const mappedFaculties = allowedFaculties.map((f: Faculty) => ({
      key: f.code,
      value: f.code,
      text: f.name[lang as 'en' | 'fi' | 'se'],
    }))
    const sortedFaculties = _.orderBy(mappedFaculties, ['text'], ['asc'])

    return [...defaultOption, ...sortedFaculties]
  }, [lang, allowedFaculties, faculties])

  // If selectedFaculties is not found in allowedFaculties, fallback to allFaculties
  useEffect(() => {
    const allowedFacultiesCodes = allowedFaculties.map((f: Faculty) => f.code)
    const isValid =
      selectedFaculties[0] === 'allFaculties' ||
      selectedFaculties.every((f: Faculty) => allowedFacultiesCodes.includes(f))

    if (!isValid) {
      dispatch(setFaculty(['allFaculties']))
    }
  }, [selectedFaculties, allowedFaculties])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string[]

    if (value.length === 0) {
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

  const getFacultyName = (selected: string[]) =>
    selected.map(value => options.find(option => option.value === value)?.text)

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          data-cy="faculty-filter"
          multiple
          value={selectedFaculties}
          onChange={handleChange}
          renderValue={selected => getFacultyName(selected).join(', ')}
        >
          {options?.map(option => (
            <MenuItem key={option.key} value={option.value} data-cy="faculty-filter-option">
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
