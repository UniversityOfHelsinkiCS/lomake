import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'

import { useTranslation } from 'react-i18next'
import { clearLevelSpecificFilters, setCompanion } from '../../util/redux/filterReducer'
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
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              data-cy="companion-filter"
              label={t('generic:companionFilter')}
              name="companion"
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
