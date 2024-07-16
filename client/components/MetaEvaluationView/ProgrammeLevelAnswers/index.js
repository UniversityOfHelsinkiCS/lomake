import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Button, Loader, Icon, Dropdown } from 'semantic-ui-react'
import { modifiedQuestions, answersByQuestions } from 'Utilities/common'
import { setQuestions } from 'Utilities/redux/filterReducer'
import WrittenAnswers from 'Components/ReportPage/WrittenAnswers'
import { formKeys } from '@root/config/data'
import FacultyDropdown from '../ProgrammeLevelOverview/FacultyDropdown'

const doctoralBasedFilter = (doctoral, items, attribute) => {
  return doctoral
    ? items.filter(item => item[attribute].includes('T'))
    : items.filter(item => !item[attribute].includes('T'))
}

const ProgrammeLevelAnswers = ({ doctoral = false }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const history = useHistory()
  const answers = useSelector(state => state.tempAnswers)
  const year = 2024
  const form = formKeys.META_EVALUATION
  const programmes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const [showing, setShowing] = useState(-1)

  const questionsList = modifiedQuestions(lang, form)
  const faculties = useSelector(state => state.faculties)
  const [usersProgrammes, setUsersProgrammes] = useState([])
  const [filter, setFilter] = useState('both')
  const filteredQuestions = doctoralBasedFilter(doctoral, questionsList, 'id')
  let filteredProgrammes = []

  const getLabel = question => {
    if (!question) return ''
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${question.label}`
  }

  const questionLabels = filteredQuestions.map(q => getLabel(q))

  useEffect(() => {
    document.title = `${t('evaluation')}`
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
    dispatch(getTempAnswersByFormAndYear(form, year))
    setUsersProgrammes(programmes)
  }, [lang, t, dispatch, programmes])

  if (!answers.data || !usersProgrammes || usersProgrammes.length === 0) return <Loader active />

  filteredProgrammes = doctoralBasedFilter(doctoral, usersProgrammes, 'key')

  const answersList =
    answers.data &&
    answersByQuestions({
      chosenProgrammes: filteredProgrammes,
      selectedAnswers: answers.data,
      questionsList,
      usersProgrammes,
      lang,
      t,
      form,
    })

  const filterOptions = [
    { key: 'both', text: t('showBoth'), value: 'both' },
    { key: 'answers', text: t('showOnlyAnswers'), value: 'answers' },
    { key: 'comments', text: t('showOnlyComments'), value: 'comments' },
  ]

  const filterAnswers = answers => {
    return answers.map(answer => ({
      ...answer,
      answer: filter === 'comments' ? undefined : answer.answer,
      comment: filter === 'answers' ? undefined : answer.comment,
    }))
  }

  const filteredAnswersList = new Map(Array.from(answersList).map(([key, value]) => [key, filterAnswers(value)]))

  return (
    <div>
      <div className="wide-header">
        <h1>{t('metaEvaluationAnswers').toUpperCase()}</h1>
        <Button onClick={() => history.goBack()}>
          <Icon name="arrow left" />
          {t('backToFrontPage')}
        </Button>
        <FacultyDropdown
          t={t}
          programmes={programmes}
          setUsersProgrammes={setUsersProgrammes}
          doctoral={doctoral}
          faculties={faculties}
          lang={lang}
        />
        <Dropdown
          data-cy="content-type-dropdown"
          selection
          options={filterOptions}
          value={filter}
          onChange={(e, { value }) => setFilter(value)}
        />
      </div>
      <WrittenAnswers
        year={year}
        questionsList={filteredQuestions}
        chosenProgrammes={filteredProgrammes}
        usersProgrammes={filteredProgrammes}
        allAnswers={filteredAnswersList}
        showing={showing}
        setShowing={setShowing}
        form={form}
      />
    </div>
  )
}

export default ProgrammeLevelAnswers
