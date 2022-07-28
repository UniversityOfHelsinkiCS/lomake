import React from 'react'
import { Form, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const LabelOptions = ({ unit, setUnit }) => {
  const { t } = useTranslation()

  const handleChange = (e, { value }) => {
    setUnit(value)
  }

  return (
    <div className="level-filter">
      <label>{t('comparison:labelOptions')}</label>
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={t('comparison:percentage')}
              name="chart-unit"
              value="percentage"
              checked={unit === 'percentage'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={t('comparison:programmeAmount')}
              name="chart-unit"
              value="programmeAmount"
              checked={unit === 'programmeAmount'}
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LabelOptions
