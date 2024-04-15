import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const CommitteeTableHeader = ({ tableIds }) => {
  const { t } = useTranslation()
  const gridColumnSize = tableIds[0].levels.length * 2 + 1
  return (
    <>
      <div className={`committee-table-header-${gridColumnSize}-left-padding`} />
      <div className={`committee-table-header-${gridColumnSize}-university`}>
        <Header block style={{ minHeight: '5em', height: 'max-content' }}>
          {' '}
          {t('overview:uniTableHeaderHY')}
        </Header>
      </div>
      <div className={`committee-table-header-${gridColumnSize}-gap`} />
      <div className={`committee-table-header-${gridColumnSize}-committee`}>
        <Header block style={{ minHeight: '5em', height: 'max-content' }}>
          {' '}
          {t('overview:uniTableHeaderCommittee')}
        </Header>
      </div>
      <div className="sticky-header" />
      {tableIds.map((upperLevel, index) => (
        <Fragment key={upperLevel.title}>
          {upperLevel.levels.map(level => (
            <div key={`${upperLevel.title}-${level}`} className={`sticky-header-categories-${gridColumnSize}`}>
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
