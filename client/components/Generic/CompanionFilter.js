import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'
import { clearDoctorFilters, setCompanion } from 'Utilities/redux/filterReducer'
import './Filters.scss'


const CompanionFilter = () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const companion = useSelector((state) => state.filter.companion)

  const handleChange = () => {
    dispatch(clearDoctorFilters())
    dispatch(setCompanion(!companion))
  }

  return (
    <div className="companion-filter">
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={translations.companionFilter[lang]}
              name='companion'
              value={companion}
              checked={companion}
              onChange={handleChange}
              toggle
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default CompanionFilter