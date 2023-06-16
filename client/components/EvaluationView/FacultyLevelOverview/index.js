import React, { useState, useEffect, useMemo } from 'react'
import { Redirect } from 'react-router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { isAdmin } from '@root/config/common'
import useDebounce from 'Utilities/useDebounce'

import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'
import FacultyColorTable from './FacultyColorTable'

export default () => {
  const { t } = useTranslation()
  const [modalData, setModalData] = useState(null)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)

  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)
  const faculties = useSelector(({ faculties }) => faculties.data)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  const form = 5
  const formType = 'evaluation'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  if (!isAdmin(currentUser)) return <Redirect to="/" />

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
              <ReactMarkdown>{modalData.content}</ReactMarkdown>
            </div>
          </>
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="wide-header">
            <h2 className="view-title">{t('evaluation').toUpperCase()}</h2>
          </div>
          <div style={{ marginTop: '1em' }}>
            <FacultyColorTable
              faculties={filteredFaculties}
              setModalData={setModalData}
              setProgramControlsToShow={null}
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
