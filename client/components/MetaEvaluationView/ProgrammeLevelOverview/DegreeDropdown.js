import React from 'react'
import { MenuItem, Dropdown } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { setLevel } from 'Utilities/redux/filterReducer'

const DegreeDropdown = () => {
  const { t } = useTranslation()
  const level = useSelector(({ filters }) => filters.level)
  const dispatch = useDispatch()

  const levelText = level === 'international' || level === 'allProgrammes' ? 'bachelorMasterToggle' : level

  return (
    <MenuItem>
      <Dropdown data-cy="degreeDropdown" className="button basic gray" direction="left" text={t(`${levelText}`)}>
        <Dropdown.Menu>
          <Dropdown.Item
            onClick={() => {
              dispatch(setLevel('allProgrammes'))
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
