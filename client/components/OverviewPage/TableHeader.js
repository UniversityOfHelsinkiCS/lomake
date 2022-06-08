import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'

import { overviewPageTranslations as translations } from 'Utilities/translations'

const TableHeader = ({ tableIds, sort }) => {
  const lang = useSelector(state => state.language)

  const transformIdToTitle = (shortLabel, vertical = true) => {
    return <span style={vertical ? { writingMode: 'vertical-lr' } : {}}>{shortLabel}</span>
  }

  return (
    <>
      <div className="sticky-header">
        <div style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => sort('name')}>
          {translations.programmeNameHeader[lang]}
          <Icon name="sort" />
        </div>
      </div>
      <div className="sticky-header">
        <div style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => sort('key')}>
          {translations.programmeCodeHeader[lang]}
          <Icon name="sort" />
        </div>
      </div>
      {tableIds.map(idObject => (
        <div
          key={idObject.id}
          className="sticky-header"
          style={{
            wordWrap: 'break-word',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          {transformIdToTitle(idObject.shortLabel)}
        </div>
      ))}
      <div className="sticky-header" />
    </>
  )
}

export default TableHeader
