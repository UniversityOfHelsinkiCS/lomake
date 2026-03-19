import { Form, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { formKeys } from '../../../config/data'

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
              checked={unit === 'percentage'}
              label={t('comparison:percentage')}
              name="chart-unit"
              onChange={handleChange}
              value="percentage"
            />
          </Form.Field>
          <Form.Field>
            <Radio
              checked={unit === 'programmeAmount'}
              label={amountLabel}
              name="chart-unit"
              onChange={handleChange}
              value="programmeAmount"
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LabelOptions
