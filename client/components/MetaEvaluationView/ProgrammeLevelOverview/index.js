import React, { useEffect, useState, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Message, Button } from 'semantic-ui-react'
import CustomModal from 'Components/Generic/CustomModal'
import ReactMarkdown from 'react-markdown'

import { metareviewQuestions as questions } from '@root/client/questionData/index'
import useDebounce from 'Utilities/useDebounce'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'
import MetaTable from './MetaTable'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const [modalData, setModalData] = useState(null)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const deadlineInfo = nextDeadline ? nextDeadline.find(item => item.form === 7) : null
  const [showAllProgrammes, setShowAllProgrammes] = useState(false)
  const history = useHistory()

  useEffect(() => {
    document.title = `${t('evaluation')}`
  }, [lang, t])

  const onButtonClick = (question, answer) => {
    const title = question.label[lang]
    const content = answer
    const color = 'green'
    setModalData({ title, content, color })
  }

  const handleFilterChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const handleShowProgrammes = () => {
    setShowAllProgrammes(!showAllProgrammes)
  }

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })
  const filteredProgrammes = useMemo(() => {
    return usersProgrammes.filter(prog => {
      const name = prog.name[lang]
      const code = prog.key
      return (
        name.toLowerCase().includes(debouncedFilter.toLowerCase()) ||
        code.toLowerCase().includes(debouncedFilter.toLowerCase())
      )
    })
  }, [usersProgrammes, lang, debouncedFilter])

  return (
    <>
      {modalData && (
        <CustomModal title={modalData.title} closeModal={() => setModalData(null)} borderColor={modalData.color}>
          <div style={{ fontSize: '1.2em' }}>
            <ReactMarkdown>{modalData.content}</ReactMarkdown>
          </div>
        </CustomModal>
      )}
      <div className="wide-header">
        <h1>{t('evaluation').toUpperCase()}</h1>
        <Button
          label={t('questionAnswers')}
          onClick={() => history.push('/meta-evaluation/answers')}
          icon="arrow right"
        />
      </div>
      {deadlineInfo && (
        <Message
          icon="clock"
          header={`${draftYear.year} ${t('formView:status:open')}`}
          content={`${t('formCloses')}: ${deadlineInfo.date}`}
        />
      )}
      <div>
        <MetaTable
          programmes={filteredProgrammes}
          questions={questions}
          onButtonClick={onButtonClick}
          handleFilterChange={handleFilterChange}
          filterValue={filter}
          handleShowProgrammes={handleShowProgrammes}
          showAllProgrammes={showAllProgrammes}
        />
      </div>
    </>
  )
}

export default ProgrammeLevelOverview
