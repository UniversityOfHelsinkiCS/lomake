import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import CustomModal from 'Components/Generic/CustomModal'
import ReactMarkdown from 'react-markdown'

import { metareviewQuestions as questions } from '@root/client/questionData/index'
import MetaTable from './MetaTable'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const showAllProgrammes = false
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang, t])

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })

  const onButtonClick = (question, answer) => {
    const title = question.label[lang]
    const content = answer
    const color = 'green'
    setModalData({ title, content, color })
  }

  return (
    <>
      {modalData && (
        <CustomModal title={modalData.title} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <div style={{ fontSize: '1.2em' }}>
            <ReactMarkdown>{modalData.content}</ReactMarkdown>
          </div>
        </CustomModal>
      )}
      <div>
        <h1>Programme Level Overview</h1>
        <MetaTable programmes={usersProgrammes} questions={questions} onButtonClick={onButtonClick} />
      </div>
    </>
  )
}

export default ProgrammeLevelOverview
