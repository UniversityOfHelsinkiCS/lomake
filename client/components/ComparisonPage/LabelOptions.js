import React from 'react'
import { Radio, FormControl } from '@mui/material'
import { useTranslation } from 'react-i18next'

const LabelOptions = ({ unit, setUnit }) => {
  const { t } = useTranslation()

  const handleChange = (e, { value }) => {
    setUnit(value)
  }

  return (
    <div className="level-filter">
      <label>{t('comparison:labelOptions')}</label>
      <FormControl>
        <Radio
          label={t('comparison:percentage')}
          name="chart-unit"
          value="percentage"
          checked={unit === 'percentage'}
          onChange={handleChange}
        />
        <Radio
          label={t('comparison:programmeAmount')}
          name="chart-unit"
          value="programmeAmount"
          checked={unit === 'programmeAmount'}
          onChange={handleChange}
        />
      </FormControl>
    </div>
  )
}

export default LabelOptions
