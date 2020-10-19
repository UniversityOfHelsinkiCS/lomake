import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { setProgrammeLevel } from 'Utilities/redux/programmeLevelReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'


const LevelFilter = ({ comparison }) => {
  const dispatch = useDispatch()
  const level = useSelector((state) => state.programmeLevel)
  const lang = useSelector((state) => state.language)

  const handleChange = (e, { value }) => {
    dispatch(setProgrammeLevel(value))
  }

  return (
    <div className="level-filter">
      <label>
        {comparison ?
          translations.compareLevel[lang]
          :
          translations.levelFilter[lang]}
      </label>
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={translations.allProgrammes[lang]}
              name='allProgrammes'
              value='allProgrammes'
              checked={level === 'allProgrammes'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.bachelor[lang]}
              name='bachelor'
              value='bachelor'
              checked={level === 'bachelor'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              data-cy='master-filter'
              label={translations.master[lang]}
              name='master'
              value='master'
              checked={level === 'master'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.doctoral[lang]}
              name='doctor'
              value='doctor'
              checked={level === 'doctor'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.international[lang]}
              name='international'
              value='international'
              checked={level === 'international'}
              onChange={handleChange}
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LevelFilter