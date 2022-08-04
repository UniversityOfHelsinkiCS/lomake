import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems } from 'Utilities/common'
import './Generic.scss'

const ProgrammeList = ({ programmes, setPicked, picked }) => {
  const { t } = useTranslation()
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
        <p className="list-header">{t('generic:nowShowing')}</p>
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
                    role="presentation"
                  >
                    <Programme p={p} />
                  </p>
                )
            )}
            <div className="ui divider" />
            <p className={`list-header${programmes.chosen.length === 0 ? '-alert' : ''}`}>{t('generic:chooseMore')}</p>
            {sortedItems(programmes.all, 'name', lang).map(
              p =>
                !programmes.chosen.includes(p) && (
                  <p
                    className="list-excluded"
                    data-cy={`report-list-programme-${p.key}`}
                    onClick={() => addToList(p)}
                    key={p.key}
                    role="presentation"
                  >
                    <Programme p={p} />
                  </p>
                )
            )}
          </>
        ) : (
          <h4>{t('noData')}</h4>
        )}
      </Segment>
      <Button color="blue" onClick={() => setPicked(programmes.all)} data-cy="report-select-all">
        {t('selectAll')}
      </Button>
      <Button onClick={() => setPicked([])}>{t('clearSelection')}</Button>
    </>
  )
}

export default ProgrammeList
