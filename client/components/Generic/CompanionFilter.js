import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FormControl, Radio } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { clearLevelSpecificFilters, setCompanion } from 'Utilities/redux/filterReducer'
import './Generic.scss'

const CompanionFilter = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const companion = useSelector(({ filters }) => filters.companion)

  const handleChange = () => {
    dispatch(clearLevelSpecificFilters())
    dispatch(setCompanion(!companion))
  }

  return (
    <div className="companion-filter">
      <FormControl>
        <Radio
          data-cy="companion-filter"
          label={t('generic:companionFilter')}
          name="companion"
          checked={companion}
          onChange={handleChange}
          toggle
        />
      </FormControl>
    </div>
  )
}

export default CompanionFilter
