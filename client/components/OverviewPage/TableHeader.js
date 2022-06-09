import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { overviewPageTranslations as translations } from 'Utilities/translations'

const TableHeader = ({ tableIds, sort }) => {
  const lang = useSelector(state => state.language)

  return (
    <>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('name')}>
          {translations.programmeNameHeader[lang]}
          <Icon name="sort" />
        </div>
      </div>
      <div className="sticky-header">
        <div className="sorter" onClick={() => sort('key')}>
          {translations.programmeCodeHeader[lang]}
          <Icon name="sort" />
        </div>
      </div>
      {tableIds.map(idObject => (
        <div key={idObject.id} className="sticky-header-categories">
          <span className="vertical-text">{idObject.shortLabel}</span>
        </div>
      ))}
      <div />
    </>
  )
}

export default TableHeader
