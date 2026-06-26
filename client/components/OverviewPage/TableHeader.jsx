import { useTranslation } from 'react-i18next'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import { Tooltip } from '@mui/material'

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
          {title ?? t('programmeHeader')}
          <SwapVertIcon fontSize="small" />
        </div>
      </div>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('key')}>
          {t('code')}
          <SwapVertIcon fontSize="small" />
        </div>
      </div>
      {showStudyLevel ? <StudyLevelHeader showStudyLevel={showStudyLevel} /> : null}
      {tableIds.map(idObject => {
        let shortLabel = meta ? `${idObject.id} ${idObject.shortLabel}` : idObject.shortLabel
        let label = meta ? `${idObject.id} ${idObject.label}` : shortLabel

        if (meta) {
          if (shortLabel.startsWith('T')) shortLabel = shortLabel.substring(1)
          if (label.startsWith('T')) label = label.substring(1)
        }
        return (
          <div className={meta ? 'sticky-header-meta' : 'sticky-header-categories'} key={idObject.id}>
            <Tooltip position="top center" title={label}>
              <span className="vertical-text">{shortLabel}</span>
            </Tooltip>
          </div>
        )
      })}
      <div className="sticky-header" />
    </>
  )
}

export default TableHeader
