import React from 'react'
import { Icon, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const CommitteeTableHeader = ({ tableIds, sort, title }) => {
  const { t } = useTranslation()
  const gridColumnSize = tableIds[0].levels.length * 2 + 1
  return (
    <>
      <div className={`committee-table-header-${gridColumnSize}-left-padding`} />
      <div className={`committee-table-header-${gridColumnSize}-university`}>
        <Header block style={{ height: 'max-content' }}>
          {' '}
          Helsingin yliopiston arvio ja toimenpide-ehdotukset{' '}
        </Header>
      </div>
      <div className={`committee-table-header-${gridColumnSize}-committee`}>
        <Header style={{ height: 'max-content' }} block>
          {' '}
          Arviointiryhmän arvio ja toimenpide-ehdotukset
        </Header>
      </div>
      <div className={`committee-table-header-${gridColumnSize}-right-padding`} />
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('name')}>
          {title || t('programmeHeader')}
          <Icon name="sort" />
        </div>
      </div>
      {tableIds.map(upperLevel =>
        upperLevel.levels.map(level => (
          <div key={`${upperLevel.title}-${level}`} className={`sticky-header-categories-${gridColumnSize}`}>
            <span>{t(`overview:uniAnswerLevels:${level}`)}</span>
          </div>
        )),
      )}
    </>
  )
}

export default CommitteeTableHeader
