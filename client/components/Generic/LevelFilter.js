import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Form, Radio } from 'semantic-ui-react'
import { translations } from 'Utilities/translations' 
import { setProgrammeLevel } from 'Utilities/redux/programmeLevelReducer'
import './LevelFilter.scss'


const LevelFilter = () => {
  const dispatch = useDispatch()
  const level = useSelector((state) => state.programmeLevel)
  const languageCode = useSelector((state) => state.language)

  const handleChange = (e, { value }) => {
    dispatch(setProgrammeLevel(value))
  }

  return (
    <div className="level-form">
      <Form>
        <Form.Field>
          <Radio
            label={translations.allProgrammes[languageCode]}
            name='allProgrammes'
            value='allProgrammes'
            checked={level === 'allProgrammes'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={translations.bachelor[languageCode]}
            name='bachelor'
            value='bachelor'
            checked={level === 'bachelor'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={translations.master[languageCode]}
            name='master'
            value='master'
            checked={level === 'master'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={translations.doctoral[languageCode]}
            name='doctoral'
            value='doctoral'
            checked={level === 'doctoral'}
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field>
          <Radio
            label={translations.otherProgrammes[languageCode]}
            name='otherProgrammes'
            value='otherProgrammes'
            checked={level === 'otherProgrammes'}
            onChange={handleChange}
          />
        </Form.Field>
      </Form>
    </div>
  )
}

export default LevelFilter