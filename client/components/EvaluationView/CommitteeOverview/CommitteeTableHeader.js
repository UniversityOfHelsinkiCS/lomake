import React from 'react'
import { Icon, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const CommitteeTableHeader = ({ tableIds, sort, title }) => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ gridColumn: '1/3' }} />
      <div style={{ gridColumn: '3/6' }}>
        <Header block> Helsingin yliopiston arvio ja toimenpide-ehdotukset </Header>
      </div>
      <div style={{ gridColumn: '6/11' }}>
        <Header style={{ height: '60px' }} block>
          {' '}
          Arviointiryhmän arvio ja toimenpide-ehdotukset
        </Header>
      </div>
      <div style={{ gridColumn: '11/14' }} />
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
      {tableIds.map(upperLevel =>
        upperLevel.levels.map(level => (
          <div key={`${upperLevel.title}-${level}`} className="sticky-header-categories">
            <span>{t(level)}</span>
          </div>
        )),
      )}
      <div className="sticky-header" />
    </>
  )
}

export default CommitteeTableHeader
