import React from 'react'
import { Icon, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const StudyLevelHeader = () => {
  // If overview shows study level (bachelor, master, doctoral) then this is needed
  return (
    <div className="sticky-header">
      <p style={{ fontWeight: 'bold' }}>Levels</p>{' '}
    </div>
  )
}

const CommitteeTableHeader = ({ tableIds, sort, title, showStudyLevel }) => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ gridColumn: '1/4' }} />
      <div style={{ gridColumn: '4/7' }}>
        <Header block> Helsingin yliopiston arvio ja toimenpide-ehdotukset </Header>
      </div>
      <div style={{ gridColumn: '7/10' }}>
        <Header style={{ height: '60px' }} block>
          {' '}
          Arviointiryhmän arvio ja toimenpide-ehdotukset
        </Header>
      </div>
      <div style={{ gridColumn: '10/15' }} />
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('name')}>
          {title || t('programmeHeader')}
          <Icon name="sort" />
        </div>
      </div>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('key')}>
          {t('code')}
          <Icon name="sort" />
        </div>
      </div>
      {showStudyLevel ? <StudyLevelHeader showStudyLevel={showStudyLevel} /> : null}

      {tableIds.map(upperLevel =>
        upperLevel.levels.map(level => (
          <div key={`${upperLevel.title}-${level}`} className="sticky-header-categories">
            <span>{level}</span>
          </div>
        )),
      )}
      <div className="sticky-header" />
    </>
  )
}

export default CommitteeTableHeader
