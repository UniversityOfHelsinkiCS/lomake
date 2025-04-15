import React from 'react'
import { Dropdown, Radio } from 'semantic-ui-react'

const DegreeLevelDropdown = ({ t, radioFilter, setRadioFilter }) => {
  return (
    <Dropdown className="button basic gray" text={t('facultyTracking:selectDegree')} simple>
      <Dropdown.Menu>
        <Dropdown.Item active={radioFilter === 'bachelor'} onClick={() => setRadioFilter('bachelor')}>
          <Radio
            label={t('facultyTracking:bachelor')}
            checked={radioFilter === 'bachelor'}
            onChange={() => setRadioFilter('bachelor')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'master'} onClick={() => setRadioFilter('master')}>
          <Radio
            label={t('facultyTracking:master')}
            checked={radioFilter === 'master'}
            onChange={() => setRadioFilter('master')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'both'} onClick={() => setRadioFilter('both')}>
          <Radio
            label={t('facultyTracking:both')}
            checked={radioFilter === 'both'}
            onChange={() => setRadioFilter('both')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'all'} onClick={() => setRadioFilter('all')}>
          <Radio label={t('showAll')} checked={radioFilter === 'all'} onChange={() => setRadioFilter('all')} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DegreeLevelDropdown
