import React from 'react'
import { Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const StudyLevelHeader = () => {
  // If overview shows study level (bachelor, master, doctoral) then this is needed
  return (
    <div className="sticky-header">
      <p style={{ fontWeight: 'bold' }}>Levels</p>{' '}
    </div>
  )
}

const TableHeader = ({ tableIds, sort, title, showStudyLevel }) => {
  const { t } = useTranslation()

  return (
    <>
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
      {tableIds.map(idObject => (
        <div key={idObject.id} className="sticky-header-categories">
          <span className="vertical-text">{idObject.shortLabel}</span>
        </div>
      ))}
      <div className="sticky-header" />
    </>
  )
}

export default TableHeader
