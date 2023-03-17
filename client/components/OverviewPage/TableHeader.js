import React from 'react'
import { Icon } from '@mui/material'
import { useTranslation } from 'react-i18next'

const TableHeader = ({ tableIds, sort }) => {
  const { t } = useTranslation()

  return (
    <>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('name')}>
          {t('programmeHeader')}
          <Icon name="sort" />
        </div>
      </div>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('key')}>
          {t('code')}
          <Icon name="sort" />
        </div>
      </div>
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
