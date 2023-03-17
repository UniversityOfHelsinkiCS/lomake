import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormControl, Radio } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { setLevel, clearLevelSpecificFilters } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const LevelFilter = ({ comparison }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const usersProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.usersProgrammes)
  const level = useSelector(({ filters }) => filters.level)

  if (!usersProgrammes) return null

  const levels = {
    bachelor: false,
    master: false,
    doctoral: false,
    international: false,
  }
  // Disable levels from the filter that the user has no access to
  usersProgrammes.forEach(p => {
    if (p.level === 'master' && p.international) levels.international = true
    levels[p.level] = true
  })

  const handleChange = (e, { value }) => {
    dispatch(setLevel(value))
    dispatch(clearLevelSpecificFilters())
  }

  return (
    <div className="level-filter">
      <label>{comparison ? t('generic:compareLevel') : t('generic:levelFilter')}</label>
      <FormControl>
        <Radio
          label={t('allProgrammes')}
          name="allProgrammes"
          value="allProgrammes"
          checked={level === 'allProgrammes'}
          onChange={handleChange}
        />
        <Radio
          label={t('bachelor')}
          disabled={!levels.bachelor}
          name="bachelor"
          value="bachelor"
          checked={level === 'bachelor'}
          onChange={handleChange}
        />
        <Radio
          data-cy="master-filter"
          label={t('master')}
          disabled={!levels.master}
          name="master"
          value="master"
          checked={level === 'master'}
          onChange={handleChange}
        />
        <Radio
          data-cy="doctoral-filter"
          label={t('doctoral')}
          disabled={!levels.doctoral}
          name="doctoral"
          value="doctoral"
          checked={level === 'doctoral'}
          onChange={handleChange}
        />
        <Radio
          label={t('international')}
          disabled={!levels.international}
          name="international"
          value="international"
          checked={level === 'international'}
          onChange={handleChange}
        />
      </FormControl>
    </div>
  )
}

export default LevelFilter
