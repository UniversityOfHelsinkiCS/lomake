import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { sortedItems } from 'Utilities/common'
import { reportPageTranslations as translations } from 'Utilities/translations'


const ProgrammeList = ({ programmes, setPicked, picked }) => {
  const lang = useSelector((state) => state.language)

  const addToList = (programme) => {
    if (!picked.includes(programme)) {
      setPicked(() => ([...picked, programme]))
    }
  }

  return (
    <Segment className="report-list-container" data-cy="report-programmes-list">
      <p className="report-programmes-header">{translations.nowShowing[lang]}</p>
      {programmes.all.length > 0 ?
        <>
          {sortedItems(programmes.all, 'name', lang).map((p) =>
            programmes.chosen.includes(p) &&
            <p
              className="report-list-included"
              onClick={() => addToList(p)}
              key={p.key}
            >
              {p.name[lang] ? p.name[lang] : p.name['en']}
            </p>
          )}
          <div className="ui divider" />
          <p className="report-programmes-header">{translations.chooseMore[lang]}</p>
          {sortedItems(programmes.all, 'name', lang).map((p) =>
            !programmes.chosen.includes(p) &&
            <p
              className="report-list-excluded"
              onClick={() => addToList(p)}
              key={p.key}
            >
              {p.name[lang] ? p.name[lang] : p.name['en']}
            </p>
          )}
        </>
        :
        <h4>{translations.noData[lang]}</h4>
      }
    </Segment>
  )
}


export default ProgrammeList