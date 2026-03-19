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
              checked={level === 'allProgrammes'}
              label={t('allProgrammes')}
              name="allProgrammes"
              onChange={handleChange}
              value="allProgrammes"
            />
          </Form.Field>
          <Form.Field>
            <Radio
              checked={level === 'bachelor'}
              disabled={!levels.bachelor}
              label={t('bachelor')}
              name="bachelor"
              onChange={handleChange}
              value="bachelor"
            />
          </Form.Field>
          <Form.Field>
            <Radio
              checked={level === 'master'}
              data-cy="master-filter"
              disabled={!levels.master}
              label={t('master')}
              name="master"
              onChange={handleChange}
              value="master"
            />
          </Form.Field>
          <Form.Field>
            <Radio
              checked={level === 'doctoral'}
              data-cy="doctoral-filter"
              disabled={!levels.doctoral}
              label={t('doctoral')}
              name="doctoral"
              onChange={handleChange}
              value="doctoral"
            />
          </Form.Field>
          <Form.Field>
            <Radio
              checked={level === 'international'}
              disabled={!levels.international}
              label={t('international')}
              name="international"
              onChange={handleChange}
              value="international"
            />
          </Form.Field>
        </Form.Group>
      </Form>
    </div>
  )
}

export default LevelFilter
