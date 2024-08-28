import React from 'react'
import { MenuItem, Dropdown } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setLevel } from '../../../util/redux/degreeReducer'

const DegreeDropdown = () => {
  const { t } = useTranslation()
  const { selectedLevel } = useSelector(state => state.degree)
  const dispatch = useDispatch()

  return (
    <MenuItem>
      <Dropdown data-cy="degreeDropdown" className="button basic gray" direction="left" text={t(selectedLevel)}>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              dispatch(setLevel('bachelorMasterToggle'))
            }}
          >
            <p data-cy="bachelorOptionText">{t('bachelorMasterToggle')}</p>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              dispatch(setLevel('doctoral'))
            }}
          >
            <p data-cy="doctoralOptionText">{t('doctoral')}</p>
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              dispatch(setLevel('master'))
            }}
          >
            <p data-cy="masterOptionText">{t('master')}</p>
          </Dropdown.Item>

          <Dropdown.Item
            onClick={() => {
              dispatch(setLevel('bachelor'))
            }}
          >
            <p data-cy="bachelorOptionText">{t('bachelor')}</p>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </MenuItem>
  )
}

export default DegreeDropdown
