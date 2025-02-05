import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { RootState } from '../../../util/store';
import { setLevel, clearLevelSpecificFilters } from '../../../util/redux/filterReducer'

import {
  MenuItem,
  FormControl,
} from '@mui/material';

import Select, { SelectChangeEvent } from '@mui/material/Select';


const LevelFilterComponent = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const usersProgrammes = useSelector((state: RootState) => state.studyProgrammes.data)
  const selectedLevel = useSelector((state: RootState) => state.filters.level)

  if (!usersProgrammes) return null

  
  const levels = [
    { key: 0, value: 'allProgrammes', text: 'Kaikki ohjelmatasot' },
    { key: 1, value: 'bachelor', text: t('bachelor') },
    { key: 2, value: 'master', text: t('master') },
    { key: 3, value: 'doctoral', text: t('doctoral') },
    { key: 4, value: 'international', text: t('international') },
  ]
  
  // HMMM, WHATS THIS? CONSULT
  // const levels = {
  //   bachelor: false,
  //   master: false,
  //   doctoral: false,
  //   international: false,
  // }
  // Disable levels from the filter that the user has no access to
  // usersProgrammes.forEach(p => {
  //   if (p.level === 'master' && p.international) levels.international = true
  //   levels[p.level] = true
  // })

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    dispatch(clearLevelSpecificFilters())

    const value = event.target.value as string;
    dispatch(setLevel(value))
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 350 }}>
        <Select
          id="level-filter"
          value={selectedLevel}
          onChange={handleChange}
        >
          {levels.map((option) => (
            <MenuItem key={option.key} value={option.value}>
              {option.text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}

export default LevelFilterComponent
