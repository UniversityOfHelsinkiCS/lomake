import React from 'react'
import { Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const StudyLevelHeader = () => {
  // If overview shows study level (bachelor, master, doctoral) then this is needed
  return (
    <div className="sticky-header">
      <p style={{ fontWeight: 'bold' }}>Levels</p>{' '}
    </div>
  )
}

const TableHeader = ({ tableIds, sort, title, showStudyLevel, meta = false }) => {
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
      {tableIds.map(idObject => {
        
        let shortLabel = meta ? `${idObject.id} ${idObject.shortLabel}` : idObject.shortLabel
        let label = meta ? `${idObject.id} ${idObject.label}` : shortLabel

        if (meta) {
          if (shortLabel.startsWith('T')) shortLabel = shortLabel.substring(1);
          if (label.startsWith('T')) label = label.substring(1);
        }
        
        return (
          <div key={idObject.id} className="sticky-header-categories">
            <Popup trigger={<span className="vertical-text">{shortLabel}</span>}>{label}</Popup>
          </div>
        )
      })}
      <div className="sticky-header" />
    </>
  )
}

export default TableHeader
