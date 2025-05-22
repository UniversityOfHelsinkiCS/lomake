import { useTranslation } from 'react-i18next'
import { setLevel, clearLevelSpecificFilters } from '../../../util/redux/filterReducer'

import { MenuItem, FormControl, Tooltip } from '@mui/material'

import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

const LevelFilterComponent = () => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const selectedLevel = useAppSelector(state => state.filters.level)

  // Available levels hardcoded for now
  const allowedLevels = [
    { key: 0, value: 'allProgrammes', text: t('allProgrammes') },
    { key: 1, value: 'bachelor', text: t('bachelor') },
    { key: 2, value: 'master', text: t('master') },
    { key: 3, value: 'doctoral', text: t('doctoral'), tooltip: t('keyData:doctoralTooltip') },
    // { key: 4, value: 'international', text: t('international') }, todo: fix this
  ]

  // If selectedLevel is not found in allowedLevels, fallback to allProgrammes
  useEffect(() => {
    const allowedLevelsValues = allowedLevels.map(level => level.value)
    const isValid = selectedLevel === 'allProgrammes' || allowedLevelsValues.includes(selectedLevel)

    if (!isValid) {
      dispatch(setLevel('allProgrammes'))
    }
  }, [selectedLevel])

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string
    dispatch(setLevel(value))
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select data-cy="level-filter" value={selectedLevel} onChange={handleChange}>
          {allowedLevels.map(option => (
            <MenuItem
              key={option.key}
              value={option.value}
              data-cy="level-filter-option"
              disabled={option.value === 'doctoral'}
              style={option.value === 'doctoral' ? { pointerEvents: 'auto' } : {}}
            >
              {option.tooltip ? (
                <Tooltip title={option.tooltip} placement="bottom" arrow>
                  <span>{option.text}</span>
                </Tooltip>
              ) : (
                option.text
              )}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default LevelFilterComponent
