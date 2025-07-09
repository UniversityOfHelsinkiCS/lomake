import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { setLevel, clearLevelSpecificFilters } from '../../redux/filterReducer'
import './Generic.scss'

const LevelFilter = ({ comparison }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const usersProgrammes = useSelector(({ studyProgrammes }) => studyProgrammes.usersProgrammes)
  const level = useSelector(({ filters }) => filters.level)

  if (!usersProgrammes) return null

  const levels = {
    bachelor: false,
    master: false,
    doctoral: false,
    international: false,
  }
  // Disable levels from the filter that the user has no access to
  usersProgrammes.forEach(p => {
    if (p.level === 'master' && p.international) levels.international = true
    levels[p.level] = true
  })

  const handleChange = (e, { value }) => {
    dispatch(setLevel(value))
    dispatch(clearLevelSpecificFilters())
  }

  return (
    <div className="level-filter" style={{ display: 'flex', alignItems: 'center' }}>
      <Form>
        <Form.Group inline>
          <Form.Field>
            <label>{comparison ? t('generic:compareLevel') : t('generic:levelFilter')}</label>
          </Form.Field>

          <Form.Field>
            <Radio
              label={t('allProgrammes')}
              name="allProgrammes"
              value="allProgrammes"
              checked={level === 'allProgrammes'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={t('bachelor')}
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
              label={t('master')}
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
              label={t('doctoral')}
              disabled={!levels.doctoral}
              name="doctoral"
              value="doctoral"
              checked={level === 'doctoral'}
              onChange={handleChange}
            />
          </Form.Field>
          <Form.Field>
            <Radio
              label={t('international')}
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
