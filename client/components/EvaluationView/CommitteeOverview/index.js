import React, { useState, useEffect, useMemo } from 'react'
import { Accordion, Icon, Radio, Checkbox } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ReactMarkdown from 'react-markdown'
import { isEvaluationUniversityUser } from '@root/config/common'
import CustomModal from 'Components/Generic/CustomModal'
import NoPermissions from 'Components/Generic/NoPermissions'

import { committeeList } from '../../../../config/data'
import ProgramControlsContent from '../../OverviewPage/ProgramControlsContent'
import CommitteeColorTable from './CommitteeColorTable'
import { TextQuestionGroup } from '../../ReformAnswers'
import { degreeReformIndividualQuestions as questionData } from '../../../questionData'

const TextualAnswers = ({ reformAnswers }) => {
  const { data } = reformAnswers

  if (!data) {
    return
  }

  // eslint-disable-next-line consistent-return
  return (
    <div>
      {questionData.slice(1).map(group => (
        <TextQuestionGroup key={group.id} questionGroup={group} answers={data} />
      ))}
    </div>
  )
}

export default () => {
  const { t } = useTranslation()
  const [modalData, setModalData] = useState(null)
  const [accordionsOpen, setAccordionsOpen] = useState({})
  const [programControlsToShow, setProgramControlsToShow] = useState(null)
  const [textualVisible, setTextualVisible] = useState(false)
  const reformAnswers = useSelector(state => state.reformAnswers)
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
                <Accordion className="modal-accordion-container" exclusive={false}>
                  {modalData.content
                    ? modalData.content
                        .sort((a, b) => {
                          if (a[0] === 'green' && b[0] === 'yellow') return -1
                          if (a[0] === 'yellow' && b[0] === 'red') return -1
                          if (a[0] === 'green' && b[0] === 'red') return -1
                          if (a[0] === 'yellow' && b[0] === 'green') return 1
                          if (a[0] === 'red' && b[0] === 'green') return 1
                          if (a[0] === 'red' && b[0] === 'yellow') return 1

                          return 0
                        })

                        .map(({ title, actions }) => {
                          return (
                            <div key={`${title}-${actions}`}>
                              <Accordion.Title
                                className={`accordion-title-${title}`}
                                active={accordionsOpen[title] === true}
                                onClick={() =>
                                  setAccordionsOpen({ ...accordionsOpen, [title]: !accordionsOpen[title] })
                                }
                              >
                                <Icon name="angle down" />
                                <span style={{ fontSize: '22px' }}> {title}</span>
                              </Accordion.Title>
                              <Accordion.Content
                                className={`accordion-content-${title}`}
                                key={title}
                                active={accordionsOpen[title] === true}
                              >
                                <ReactMarkdown>{actions}</ReactMarkdown>
                              </Accordion.Content>
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
            <div style={{ display: 'flex', flexDirection: 'column', height: '8em' }}>
              {Object.keys(selectedLevels).map(level => (
                <Checkbox
                  key={level}
                  className="committee-level-filter"
                  active={selectedLevels[level]}
                  onClick={() => handleSelectedLevels(level)}
                  label={t(level)}
                />
              ))}
            </div>
          </div>
          <div style={{ marginTop: '1em' }}>
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
          <div style={{ marginTop: 50 }}>
            <h3>{t('generic:individualTxt')}</h3>
            <Radio
              style={{ marginRight: 'auto', marginBottom: '2em' }}
              toggle
              onChange={() => setTextualVisible(!textualVisible)}
              checked={textualVisible}
              label={t('formView:showAnswers')}
            />
          </div>

          {textualVisible && <TextualAnswers reformAnswers={reformAnswers} />}
        </>
      ) : (
        <NoPermissions t={t} />
      )}
    </>
  )
}
