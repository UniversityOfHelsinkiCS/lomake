import { Fragment } from 'react'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CommitteeTableHeader = ({ tableIds }) => {
  const { t } = useTranslation()
  const gridColumnSize = tableIds[0].levels.length * 2 + 1
  return (
    <>
      <div className={`committee-table-header-${gridColumnSize}-left-padding`} />
      <div className={`committee-table-header-${gridColumnSize}-university`}>
        <Typography block style={{ minHeight: '5em', height: 'max-content' }}>
          {' '}
          {t('overview:uniTableHeaderHY')}
        </Typography>
      </div>
      <div className={`committee-table-header-${gridColumnSize}-gap`} />
      <div className={`committee-table-header-${gridColumnSize}-committee`}>
        <Typography sx={{ minHeight: '5em', height: 'max-content' }}>
          {' '}
          {t('overview:uniTableHeaderCommittee')}
        </Typography>
      </div>
      <div className="sticky-header" />
      {tableIds.map((upperLevel, index) => (
        <Fragment key={upperLevel.title}>
          {upperLevel.levels.map(level => (
            <div className={`sticky-header-categories-${gridColumnSize}`} key={`${upperLevel.title}-${level}`}>
              <span>{t(`overview:selectedLevels:${level}`)}</span>
            </div>
          ))}
          {index === 0 && <div className="committee-table-header-second-level-gap" />}
        </Fragment>
      ))}
    </>
  )
}

export default CommitteeTableHeader
