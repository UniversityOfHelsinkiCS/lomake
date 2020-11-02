import React from 'react'
import { useSelector } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'


const CompanionFilter = ({ showCompanion, setShowCompanion }) => {
  const lang = useSelector((state) => state.language)

  return (
    <div className="companion-filter">
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={translations.companionFilter[lang]}
              name='companion'
              value='companion'
              checked={showCompanion}
              onChange={() => setShowCompanion(!showCompanion)}
              toggle
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default CompanionFilter