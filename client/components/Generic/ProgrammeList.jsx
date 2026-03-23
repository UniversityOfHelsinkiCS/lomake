import { Fragment, useState } from 'react'
import { useSelector } from 'react-redux'
import { Button, Icon, Accordion } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems } from '../../util/common'
import './Generic.scss'
import { formKeys } from '../../../config/data'

const Programme = ({ p, lang, selectedFaculties, form }) => {
  return (
    <Fragment key={p.key}>
      <span style={{ cursor: 'pointer' }}>{p.name[lang]}</span>
      {form &&
      form !== formKeys.EVALUATION_FACULTIES &&
      form !== formKeys.FACULTY_MONITORING &&
      !selectedFaculties.includes(p.primaryFaculty.code) &&
      !selectedFaculties.includes('allFaculties') ? (
        <span className="list-companion-icon">
          <Icon name="handshake outline" />
        </span>
      ) : null}
    </Fragment>
  )
}

const facultyLabels = {
  nowShowing: 'generic:nowShowing:faculties',
  chooseMore: 'generic:chooseMore:faculties',
}

const programmeLabels = {
  nowShowing: 'generic:nowShowing:programmes',
  chooseMore: 'generic:chooseMore:programmes',
}

const ProgrammeList = ({ programmes, setPicked, picked }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const selectedFaculties = useSelector(({ filters }) => filters.faculty)
  const form = useSelector(state => state.filters.form)
  const [isOpen, setIsOpen] = useState(false)

  const addToList = programme => {
    if (!picked.includes(programme)) {
      setPicked(() => [...picked, programme])
    }
  }

  const labels =
    form === formKeys.EVALUATION_FACULTIES || form === formKeys.FACULTY_MONITORING ? facultyLabels : programmeLabels

  return (
    <Accordion active data-cy="report-programmes-list" fluid style={{ maxHeight: '400px', overflowY: 'auto' }} styled>
      <Accordion.Title data-cy="report-select-all-accordion" onClick={() => setIsOpen(!isOpen)}>
        {t(labels.nowShowing)}
        <span>
          <Icon name={`caret ${isOpen ? 'down' : 'right'}`} />
        </span>
      </Accordion.Title>
      <Accordion.Content active={isOpen}>
        <p className="list-header">{t(labels.nowShowing)}</p>

        {programmes.all.length > 0 ? (
          <Fragment key={programmes}>
            {sortedItems(programmes.all, 'name', lang).map(p => {
              let pKey = p.key
              if (form === formKeys.EVALUATION_FACULTIES || form === formKeys.FACULTY_MONITORING) {
                pKey = p.code
              }
              return (
                programmes.chosen.includes(p) && (
                  <p
                    className="list-included"
                    data-cy={`report-list-programme-${pKey}`}
                    key={pKey}
                    onClick={() => addToList(p)}
                    role="presentation"
                  >
                    <Programme lang={lang} p={p} selectedFaculties={selectedFaculties} />
                  </p>
                )
              )
            })}
            <div className="ui divider" />
            <p className={`list-header${programmes.chosen.length === 0 ? '-alert' : ''}`}>
              {t(`${labels.chooseMore}`)}
            </p>
            {sortedItems(programmes.all, 'name', lang).map(p => {
              let pKey = p.key
              if (form === formKeys.EVALUATION_FACULTIES || form === formKeys.FACULTY_MONITORING) {
                pKey = p.code
              }
              return (
                !programmes.chosen.includes(p) && (
                  <p
                    className="list-excluded"
                    data-cy={`report-list-programme-${pKey}`}
                    key={pKey}
                    onClick={() => addToList(p)}
                    role="presentation"
                  >
                    <Programme form={form} lang={lang} p={p} selectedFaculties={selectedFaculties} />
                  </p>
                )
              )
            })}
          </Fragment>
        ) : (
          <h4>{t('noData')}</h4>
        )}
        <Button color="blue" data-cy="report-select-all" onClick={() => setPicked(programmes.all)}>
          {t('selectAll')}
        </Button>
        <Button onClick={() => setPicked([])}>{t('clearSelection')}</Button>
      </Accordion.Content>
    </Accordion>
  )
}

export default ProgrammeList
