import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { setLevel } from 'Utilities/redux/filterReducer'
import { clearLevelSpecificFilters } from 'Utilities/redux/filterReducer'
import { genericTranslations as translations } from 'Utilities/translations'
import './Filters.scss'

const LevelFilter = ({ comparison }) => {
  const dispatch = useDispatch()
  const usersProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.usersProgrammes)
  const level = useSelector(({ filters }) => filters.level)
  const lang = useSelector((state) => state.language)

  if (!usersProgrammes) return null

  const levels = {
    bachelor: false,
    master: false,
    doctoral: false,
    international: false
  }
  // Disable levels from the filter that the user has no access to 
  usersProgrammes.forEach((p) => {
    if (p.level === 'master' && p.international) levels['international'] = true
    levels[p.level] = true
  })

  const handleChange = (e, { value }) => {
    dispatch(setLevel(value))
    dispatch(clearLevelSpecificFilters())
  }

  return (
    <div className="level-filter">
      <label>{comparison ? translations.compareLevel[lang] : translations.levelFilter[lang]}</label>
      <Form>
        <Form.Group inline>
          <Form.Field>
            <Radio
              label={translations.allProgrammes[lang]}
              name="allProgrammes"
              value="allProgrammes"
              checked={level === 'allProgrammes'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.bachelor[lang]}
              disabled={!levels.bachelor}
              name="bachelor"
              value="bachelor"
              checked={level === 'bachelor'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              data-cy="master-filter"
              label={translations.master[lang]}
              disabled={!levels.master}
              name="master"
              value="master"
              checked={level === 'master'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              data-cy="doctoral-filter"
              label={translations.doctoral[lang]}
              disabled={!levels.doctoral}
              name="doctoral"
              value="doctoral"
              checked={level === 'doctoral'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={translations.international[lang]}
              disabled={!levels.international}
              name="international"
              value="international"
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
