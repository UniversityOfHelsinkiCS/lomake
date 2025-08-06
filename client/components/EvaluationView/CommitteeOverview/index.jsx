import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { isAdmin, isEvaluationUniversityUser, isKatselmusProjektiOrOhjausryhma, isBasicUser } from '../../../../config/common'
import CustomModal from '../../Generic/CustomModal'
import NoPermissions from '../../Generic/NoPermissions'
import { setColorBlindMode } from '../../../redux/filterReducer'
import PDFDownload from '../../Generic/PDFDownload'
import { committeeList } from '../../../../config/data'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import CommitteeColorTable from './CommitteeColorTable'
import CommitteePrinting from './CommitteePrinting'

export default () => {
  const { t } = useTranslation()
  const printingRefHyBachelorMaster = useRef()
  const printingRefHyDoctoral = useRef()
  const printingRefArviointiBachelorMaster = useRef()
  const printingRefArviointiDoctoral = useRef()
  const dispatch = useDispatch()
  const [modalData, setModalData] = useState(null)
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser.data)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const [selectedLevels, setSelectedLevels] = useState({ master: false, doctoral: false })

  const form = 6
  const formType = 'evaluation'

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  // all have rights!
  const hasRights = currentUser => isBasicUser(currentUser) || isEvaluationUniversityUser(currentUser)

  // eslint-disable-next-line no-unused-vars
  const handleSelectedLevels = level => {
    setSelectedLevels({ ...selectedLevels, [level]: !selectedLevels[level] })
  }

  // show faculty overview to those that have access to some programmes in tilannekuvalomake
  const usersProgrammes = useMemo(() => {
    if (!hasRights(currentUser)) return []
    return ['UNI']
  }, [programmes, currentUser])

  // This is used for margin on printing
  const pageStyle = `
  @page {
    margin-top: 20cm;
    margin-bottom: 20cm;

  }
`
  return (
    <>
      {modalData && (
        <CustomModal
          title={modalData.header}
          closeModal={() => setModalData(null)}
          borderColor={modalData.color.single}
        >
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              {modalData?.type === 'actions' ? (
                <div>
                  {modalData.content &&
                    modalData.content.map(({ title, actions, index }) => {
                      return (
                        <div style={{ marginBottom: '1em' }} key={`${title}-${actions}`}>
                          <h2 data-cy={`modal-title-action-${index}`}>{title}</h2>
                          <div data-cy={`modal-content-action-${index}`}>
                            <ReactMarkdown>{actions}</ReactMarkdown>
                          </div>
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
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang] ? programControlsToShow.name[lang] : programControlsToShow.name.en
            }`}
          closeModal={() => setProgramControlsToShow(null)}
        >
          <ProgramControlsContent programKey={programControlsToShow.code} />
        </CustomModal>
      )}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="wide-header-committee">
            <h2>{t('evaluation').toUpperCase()}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', height: '8em', justifyContent: 'space-evenly' }}>
              <Radio toggle label={t(`overview:colorBlindMode`)} onClick={() => dispatch(setColorBlindMode())} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {(true || isAdmin(currentUser) || isKatselmusProjektiOrOhjausryhma(currentUser)) && (
                <>
                  <h4>{t(`overview:print`)}</h4>
                  <PDFDownload linkName="uniBachelorMaster" componentRef={printingRefHyBachelorMaster} />
                  <PDFDownload linkName="uniDoctoral" componentRef={printingRefHyDoctoral} />
                  <PDFDownload linkName="arviointiBachelorMaster" componentRef={printingRefArviointiBachelorMaster} />
                  <PDFDownload linkName="arviointiDoctoral" componentRef={printingRefArviointiDoctoral} />
                  <div className="testing-testing" ref={printingRefHyBachelorMaster}>
                    <style>{pageStyle}</style>
                    <CommitteePrinting type="uni-bachelor-master"> </CommitteePrinting>
                  </div>
                  <div className="testing-testing" ref={printingRefHyDoctoral}>
                    <style>{pageStyle}</style>
                    <CommitteePrinting type="uni-doctoral"> </CommitteePrinting>
                  </div>
                  <div className="testing-testing" ref={printingRefArviointiBachelorMaster}>
                    <style>{pageStyle}</style>
                    <CommitteePrinting type="arviointi-bachelor-master"> </CommitteePrinting>
                  </div>
                  <div className="testing-testing" ref={printingRefArviointiDoctoral}>
                    <style>{pageStyle}</style>
                    <CommitteePrinting type="arviointi-doctoral"> </CommitteePrinting>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="committee-color-table-wrapper" style={{ marginTop: '1em' }}>
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
        <NoPermissions t={t} requestedForm={t('evaluation')} />
      )}
    </>
  )
}
