import React, { Fragment } from 'react'
import { Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const defaultTableIds = [
  { title: 'university', levels: ['master', 'doctoral'] },
  { title: 'arviointi', levels: ['master', 'doctoral', 'overall'] },
]

export const TestingHeader = ({ upperLevel, index }) => {
  const { t } = useTranslation()
  if (upperLevel.title === 'university' && index === 0) {
    return (
      <Header block style={{ minHeight: '5em', height: 'max-content', gridColumn: 'span 3' }}>
        {' '}
        {t('overview:uniTableHeaderHY')}
      </Header>
    )
  }
  if (upperLevel.title === 'arviointi' && index === 0) {
    return (
      <Header block style={{ minHeight: '5em', height: 'max-content', gridColumn: 'span 3' }}>
        {' '}
        {t('overview:uniTableHeaderCommittee')}
      </Header>
    )
  }
  return null
}
const CommitteeTableHeader = ({ tableIds = defaultTableIds }) => {
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
      <div className={`committee-table-header-${gridColumnSize}-right-padding`} />
      <div className="sticky-header" />
      {tableIds.map((upperLevel, index) => (
        <Fragment key={upperLevel.levels}>
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
