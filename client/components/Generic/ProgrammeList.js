import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems } from 'Utilities/common'
import './Generic.scss'
import { formKeys } from '@root/config/data'

const Programme = ({ p, lang, faculty, form }) => {
  return (
    <Fragment key={p.key}>
      {p.name[lang]}
      {form &&
        form !== formKeys.EVALUATION_FACULTIES &&
        p.primaryFaculty.code !== faculty &&
        faculty !== 'allFaculties' && (
          <span className="list-companion-icon">
            <Icon name="handshake outline" />
          </span>
        )}
    </Fragment>
  )
}

const ProgrammeList = ({ programmes, setPicked, picked }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const faculty = useSelector(({ filters }) => filters.faculty)
  const form = useSelector(state => state.filters.form)

  const addToList = programme => {
    if (!picked.includes(programme)) {
      setPicked(() => [...picked, programme])
    }
  }

  return (
    <>
      <Segment className="list-container" data-cy="report-programmes-list">
        <p className="list-header">{t('generic:nowShowing')}</p>
        {programmes.all.length > 0 ? (
          <Fragment key={programmes}>
            {sortedItems(programmes.all, 'name', lang).map(p => {
              let pKey = p.key
              if (form === formKeys.EVALUATION_FACULTIES) {
                pKey = p.code
              }
              return (
                programmes.chosen.includes(p) && (
                  <p
                    className="list-included"
                    data-cy={`report-list-programme-${pKey}`}
                    onClick={() => addToList(p)}
                    key={pKey}
                    role="presentation"
                  >
                    <Programme p={p} lang={lang} faculty={faculty} />
                  </p>
                )
              )
            })}
            <div className="ui divider" />
            <p className={`list-header${programmes.chosen.length === 0 ? '-alert' : ''}`}>{t('generic:chooseMore')}</p>
            {sortedItems(programmes.all, 'name', lang).map(p => {
              let pKey = p.key
              if (form === formKeys.EVALUATION_FACULTIES) {
                pKey = p.code
              }
              return (
                !programmes.chosen.includes(p) && (
                  <p
                    className="list-excluded"
                    data-cy={`report-list-programme-${pKey}`}
                    onClick={() => addToList(p)}
                    key={pKey}
                    role="presentation"
                  >
                    <Programme p={p} lang={lang} faculty={faculty} form={form} />
                  </p>
                )
              )
            })}
          </Fragment>
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
