import React from 'react'
import { useSelector } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

const LabelOptions = ({ unit, setUnit }) => {
  const lang = useSelector(state => state.language)

  const handleChange = (e, { value }) => {
    setUnit(value)
  }

  return (
    <div className="level-filter">
      <label>{translations.labelOptions[lang]}</label>
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={translations.percentage[lang]}
              name="chart-unit"
              value="percentage"
              checked={unit === 'percentage'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.programmeAmount[lang]}
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
