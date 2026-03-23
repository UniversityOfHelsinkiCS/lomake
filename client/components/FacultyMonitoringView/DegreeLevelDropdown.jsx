import { Dropdown, Radio } from 'semantic-ui-react'

const DegreeLevelDropdown = ({ t, radioFilter, setRadioFilter }) => {
  return (
    <Dropdown className="button basic gray" simple text={t('facultyTracking:selectDegree')}>
      <Dropdown.Menu>
        <Dropdown.Item active={radioFilter === 'bachelor'} onClick={() => setRadioFilter('bachelor')}>
          <Radio
            checked={radioFilter === 'bachelor'}
            label={t('facultyTracking:bachelor')}
            onChange={() => setRadioFilter('bachelor')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'master'} onClick={() => setRadioFilter('master')}>
          <Radio
            checked={radioFilter === 'master'}
            label={t('facultyTracking:master')}
            onChange={() => setRadioFilter('master')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'both'} onClick={() => setRadioFilter('both')}>
          <Radio
            checked={radioFilter === 'both'}
            label={t('facultyTracking:both')}
            onChange={() => setRadioFilter('both')}
          />
        </Dropdown.Item>

        <Dropdown.Item active={radioFilter === 'all'} onClick={() => setRadioFilter('all')}>
          <Radio checked={radioFilter === 'all'} label={t('showAll')} onChange={() => setRadioFilter('all')} />
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default DegreeLevelDropdown
