import React from 'react'
import { Form, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { formKeys } from '../../../config/data'
import { useSelector } from 'react-redux'

const LabelOptions = ({ unit, setUnit }) => {
  const { t } = useTranslation()
  const form = useSelector(state => state.filters.form)

  const handleChange = (e, { value }) => {
    setUnit(value)
  }

  const amountLabel =
    form === formKeys.EVALUATION_FACULTIES ? t('comparison:facultyAmount') : t('comparison:programmeAmount')

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
              label={amountLabel}
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
