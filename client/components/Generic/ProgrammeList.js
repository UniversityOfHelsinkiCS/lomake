import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Segment } from 'semantic-ui-react'
import { sortedItems } from 'Utilities/common'
import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const ProgrammeList = ({ programmes, setPicked, picked }) => {
  const lang = useSelector(state => state.language)
  const faculty = useSelector(({ filters }) => filters.faculty)

  const addToList = programme => {
    if (!picked.includes(programme)) {
      setPicked(() => [...picked, programme])
    }
  }

  const Programme = ({ p }) => (
    <>
      {p.name[lang]}
      {p.primaryFaculty.code !== faculty && faculty !== 'allFaculties' && (
        <span className="list-companion-icon">
          <Icon name="handshake outline" />
        </span>
      )}
    </>
  )

  return (
    <>
      <Segment className="list-container" data-cy="report-programmes-list">
        <p className="list-header">{translations.nowShowing[lang]}</p>
        {programmes.all.length > 0 ? (
          <>
            {sortedItems(programmes.all, 'name', lang).map(
              p =>
                programmes.chosen.includes(p) && (
                  <p
                    className="list-included"
                    data-cy={`report-list-programme-${p.key}`}
                    onClick={() => addToList(p)}
                    key={p.key}
                  >
                    <Programme p={p} />
                  </p>
                )
            )}
            <div className="ui divider" />
            <p className={`list-header${programmes.chosen.length === 0 ? '-alert' : ''}`}>
              {translations.chooseMore[lang]}
            </p>
            {sortedItems(programmes.all, 'name', lang).map(
              p =>
                !programmes.chosen.includes(p) && (
                  <p
                    className="list-excluded"
                    data-cy={`report-list-programme-${p.key}`}
                    onClick={() => addToList(p)}
                    key={p.key}
                  >
                    <Programme p={p} />
                  </p>
                )
            )}
          </>
        ) : (
          <h4>{translations.noData[lang]}</h4>
        )}
      </Segment>
      <Button color="blue" onClick={() => setPicked(programmes.all)} data-cy="report-select-all">
        {translations.selectAll[lang]}
      </Button>
      <Button onClick={() => setPicked([])}>{translations.clearSelection[lang]}</Button>
    </>
  )
}

export default ProgrammeList
