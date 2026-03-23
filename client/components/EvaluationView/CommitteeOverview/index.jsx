/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useMemo, useRef } from 'react'
import { Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import {
  isAdmin,
  isEvaluationUniversityUser,
  isKatselmusProjektiOrOhjausryhma,
  isBasicUser,
  isEmployeeOnly,
} from '../../../../config/common'
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

  const form = 6

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang])

  // all have rights!
  const hasRights = currentUser =>
    (isBasicUser(currentUser) || isEvaluationUniversityUser(currentUser)) && !isEmployeeOnly(currentUser)
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
      {modalData ? (
        <CustomModal
          borderColor={modalData.color.single}
          closeModal={() => setModalData(null)}
          title={modalData.header}
        >
          <>
            <div style={{ paddingBottom: '1em' }}>{modalData.programme}</div>
            <div style={{ fontSize: '1.2em' }}>
              {modalData?.type === 'actions' ? (
                <div>
                  {modalData.content?.map(({ title, actions, index }) => {
                    return (
                      <div key={`${title}-${actions}`} style={{ marginBottom: '1em' }}>
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
      ) : null}
      {programControlsToShow ? (
        <CustomModal
          closeModal={() => setProgramControlsToShow(null)}
          title={`${t('overview:accessRights')} - ${programControlsToShow.name[lang] ?? programControlsToShow.name.en}`}
        >
          <ProgramControlsContent programKey={programControlsToShow.code} />
        </CustomModal>
      ) : null}

      {usersProgrammes.length > 0 ? (
        <>
          <div className="wide-header-committee">
            <h2>{t('evaluation').toUpperCase()}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', height: '8em', justifyContent: 'space-evenly' }}>
              <Radio label={t(`overview:colorBlindMode`)} onClick={() => dispatch(setColorBlindMode())} toggle />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {isAdmin(currentUser) || isKatselmusProjektiOrOhjausryhma(currentUser) ? (
                <>
                  <h4>{t(`overview:print`)}</h4>
                  <PDFDownload componentRef={printingRefHyBachelorMaster} linkName="uniBachelorMaster" />
                  <PDFDownload componentRef={printingRefHyDoctoral} linkName="uniDoctoral" />
                  <PDFDownload componentRef={printingRefArviointiBachelorMaster} linkName="arviointiBachelorMaster" />
                  <PDFDownload componentRef={printingRefArviointiDoctoral} linkName="arviointiDoctoral" />
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
              ) : null}
            </div>
          </div>
          <div className="committee-color-table-wrapper" style={{ marginTop: '1em' }}>
            <CommitteeColorTable
              committees={committeeList}
              form={form}
              setModalData={setModalData}
              setStatsToShow={null}
            />
          </div>
        </>
      ) : (
        <NoPermissions requestedForm={t('evaluation')} t={t} />
      )}
    </>
  )
}
