import React, { useState, useEffect, useMemo } from 'react'
import { Accordion, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'

import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import { data } from '../../../../config/data'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import CommitteeColorTable from './CommitteeColorTable'

export default () => {
  const { t } = useTranslation()
  const [modalData, setModalData] = useState(null)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [accordionsOpen, setAccordionsOpen] = useState({})
  const [programControlsToShow, setProgramControlsToShow] = useState(null)

  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)
  const faculties = useSelector(({ faculties }) => faculties.data)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const form = 6
  const formType = 'evaluation'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  // show faculty overview to those that have access to some programmes in tilannekuvalomake
  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(currentUser.access)
    return isAdmin(currentUser) ? programmes : programmes.filter(program => usersPermissionsKeys.includes(program.key))
  }, [programmes, currentUser])

  const filteredFaculties = useMemo(() => {
    if (!faculties) return []
    return faculties.filter(f => {
      if (!currentUser.access[f.code] && !isAdmin(currentUser)) {
        return false
      }
      const name = f.name[lang]
      const { code } = f
      return (
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        code.toLowerCase().includes(debouncedFilter.toLowerCase())
      )
    })
  }, [usersProgrammes, faculties, lang, debouncedFilter])

  return (
    <>
      {modalData && (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              {modalData?.content?.answer ? (
                <Accordion className="modal-accordion-container" exclusive={false}>
                  {modalData.content
                    ? Object.entries(modalData.content)
                        .sort((a, b) => {
                          if (a[0] === 'green' && b[0] === 'yellow') return -1
                          if (a[0] === 'yellow' && b[0] === 'red') return -1
                          if (a[0] === 'green' && b[0] === 'red') return -1
                          if (a[0] === 'yellow' && b[0] === 'green') return 1
                          if (a[0] === 'red' && b[0] === 'green') return 1
                          if (a[0] === 'red' && b[0] === 'yellow') return 1

                          return 0
                        })
                        .map(([key, value]) => {
                          return (
                            <div key={`${key}-${value}`}>
                              <Accordion.Title
                                className={`accordion-title-${key}`}
                                active={accordionsOpen[key] === true}
                                onClick={() => setAccordionsOpen({ ...accordionsOpen, [key]: !accordionsOpen[key] })}
                              >
                                <Icon name="angle down" />
                                <span style={{ fontSize: '22px' }}> {t(`overview:${key}ModalAccordion`)}</span>
                              </Accordion.Title>
                              {value.map(answerContent => {
                                const programmeName = data
                                  .find(f => f.code === modalData.facultyKey)
                                  .programmes.find(p => p.key === answerContent.programme).name[lang]
                                return (
                                  <Accordion.Content
                                    className={`accordion-content-${key}`}
                                    key={answerContent.programme}
                                    active={accordionsOpen[key] === true}
                                  >
                                    <h4>{programmeName}</h4>
                                    <ReactMarkdown>{answerContent.answer}</ReactMarkdown>
                                  </Accordion.Content>
                                )
                              })}
                            </div>
                          )
                        })
                    : null}
                </Accordion>
              ) : (
                <ReactMarkdown>{modalData.content}</ReactMarkdown>
              )}
            </div>
          </>
        </CustomModal>
      )}
      {programControlsToShow && (
        <CustomModal
          title={`${t('overview:accessRights')} - ${
            programControlsToShow.name[lang] ? programControlsToShow.name[lang] : programControlsToShow.name.en
          }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.code} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="wide-header">
            <h2 className="view-title">{t('evaluation').toUpperCase()}</h2>
          </div>
          <div style={{ marginTop: '1em' }}>
            <CommitteeColorTable
              faculties={filteredFaculties}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={null}
              isBeingFiltered={debouncedFilter !== ''}
              handleFilterChange={handleFilterChange}
              filterValue={filter}
              form={form}
              formType={formType}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
