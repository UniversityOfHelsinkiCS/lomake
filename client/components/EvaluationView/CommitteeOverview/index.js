import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { isEvaluationUniversityUser } from '@root/config/common'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'

import PDFDownload from 'Components/Generic/PDFDownload'
import { committeeList } from '../../../../config/data'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import CommitteeColorTable from './CommitteeColorTable'

export default () => {
  const { t } = useTranslation()
  const componentRef = useRef()
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const [selectedLevels, setSelectedLevels] = useState({ bachelor: false, master: false, doctoral: false })

  const form = 6
  const formType = 'evaluation'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  const hasRights = currentUser => isEvaluationUniversityUser(currentUser)

  const handleSelectedLevels = level => {
    setSelectedLevels({ ...selectedLevels, [level]: !selectedLevels[level] })
  }

  // show faculty overview to those that have access to some programmes in tilannekuvalomake
  const usersProgrammes = useMemo(() => {
    if (!hasRights(currentUser)) return []
    return ['UNI']
  }, [programmes, currentUser])
  return (
    <>
      {modalData && (
        <CustomModal title={modalData.header} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              {modalData?.type === 'actions' ? (
                <div>
                  {modalData.content &&
                    modalData.content.map(({ title, actions }) => {
                      return (
                        <div style={{ marginBottom: '1em' }} key={`${title}-${actions}`}>
                          <h2>{title}</h2>
                          <ReactMarkdown>{actions}</ReactMarkdown>
                        </div>
                      )
                    })}
                </div>
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
          <div className="wide-header-committee">
            <h2 className="view-title">{t('evaluation').toUpperCase()}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', height: '8em' }}>
              {Object.keys(selectedLevels).map(level => (
                <Radio
                  toggle
                  key={level}
                  className="committee-level-filter"
                  data-cy={`committee-level-filter-${level}`}
                  onClick={() => handleSelectedLevels(level)}
                  label={t(level)}
                />
              ))}
            </div>
            <PDFDownload componentRef={componentRef} />
          </div>
          <div style={{ marginTop: '1em' }} ref={componentRef}>
            <CommitteeColorTable
              committees={committeeList}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              setStatsToShow={null}
              form={form}
              formType={formType}
              selectedLevels={selectedLevels}
            />
          </div>
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
