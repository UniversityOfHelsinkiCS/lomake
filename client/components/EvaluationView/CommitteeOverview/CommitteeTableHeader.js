import React from 'react'
import { Icon, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const CommitteeTableHeader = ({ tableIds, sort, title }) => {
  const { t } = useTranslation()

  return (
    <>
      <div style={{ gridColumn: '1/2' }} />
      <div style={{ gridColumn: '2/5' }}>
        <Header block> Helsingin yliopiston arvio ja toimenpide-ehdotukset </Header>
      </div>
      <div style={{ gridColumn: '5/9' }}>
        <Header style={{ height: '60px' }} block>
          {' '}
          Arviointiryhmän arvio ja toimenpide-ehdotukset
        </Header>
      </div>
      <div style={{ gridColumn: '9/13' }} />
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('name')}>
          {title || t('programmeHeader')}
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
