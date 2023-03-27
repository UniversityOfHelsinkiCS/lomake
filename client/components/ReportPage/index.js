import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Accordion, Button, Icon, Grid, Tab } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import ProgrammeList from 'Components/Generic/ProgrammeList'
import QuestionList from 'Components/Generic/QuestionList'
import {
  answersByYear,
  cleanText,
  filteredProgrammes,
  getMeasuresAnswer,
  modifiedQuestions,
  programmeNameByKey as programmeName,
  getSelectionAnswer,
  getOrderAnswer,
} from 'Utilities/common'
import useDebounce from 'Utilities/useDebounce'
import FilterTray from './FilterTray'
import ColorAnswers from './ColorAnswers'
import WrittenAnswers from './WrittenAnswers'
import rawQuestions from '../../questions.json'
import './ReportPage.scss'

const getAnswersByQuestions = ({ chosenProgrammes, selectedAnswers, questionsList, usersProgrammes, lang }) => {
  const answerMap = new Map()
  const chosenKeys = chosenProgrammes.map(p => p.key)
  selectedAnswers.forEach(programme => {
    const key = programme.programme

    if (chosenKeys.includes(key)) {
      const { data } = programme
      questionsList.forEach(question => {
        let answersByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
        const color = data[question.color] ? data[question.color] : 'emptyAnswer'
        const name = programmeName(usersProgrammes, programme, lang)
        let answer = ''

        if (question.id.startsWith('measures')) answer = getMeasuresAnswer(data, question.id)
        else if (question.id.endsWith('selection')) answer = getSelectionAnswer(data, question, lang)
        else if (question.id.endsWith('_order')) answer = getOrderAnswer(data, question, lang)
        else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

        answersByProgramme = [...answersByProgramme, { name, key, color, answer }]
        answerMap.set(question.id, answersByProgramme)
      })
    }
  })

  // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
  // So empty answers need to be added.
  answerMap.forEach((value, key) => {
    const answeredProgrammes = value.map(p => p.key)
    const programmesMissing = chosenProgrammes.filter(p => !answeredProgrammes.includes(p.key))
    if (programmesMissing) {
      programmesMissing.forEach(p => {
        const earlierAnswers = answerMap.get(key)
        answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: p.key, color: 'emptyAnswer' }])
      })
    }
  })

  return answerMap
}

export default ({ form = 1 }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [openQuestions, setOpenQuestions] = useState(false)
  const [filter, setFilter] = useState('')
  const [picked, setPicked] = useState([])
  const [showing, setShowing] = useState(-1)
  const [activeTab, setActiveTab] = useState(0)
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const filters = useSelector(state => state.filters)
  const { year } = filters
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines) // TO FIX handle multiples
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline: nextDeadline,
    form,
  })

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${t('report:reportPage')}`
  }, [lang])

  // Handles all filtering
  const programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)

  const questionsList = modifiedQuestions(rawQuestions, lang)

  const handleTabChange = (e, { activeIndex }) => setActiveTab(activeIndex)

  const panes = [
    {
      menuItem: t('writtenAnswers'),
      render: () => (
        <Tab.Pane className="tab-pane">
          <WrittenAnswers
            year={year}
            questionsList={questionsList}
            chosenProgrammes={programmes.chosen}
            usersProgrammes={usersProgrammes}
            allAnswers={
              programmes.chosen
                ? getAnswersByQuestions({
                    chosenProgrammes: programmes.chosen,
                    selectedAnswers,
                    questionsList,
                    usersProgrammes,
                    lang,
                  })
                : []
            }
            showing={showing}
            setShowing={setShowing}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('smileyColors'),
      render: () => (
        <Tab.Pane className="tab-pane">
          <ColorAnswers
            year={year}
            questionsList={questionsList}
            chosenProgrammes={programmes.chosen}
            allAnswers={
              programmes.chosen
                ? getAnswersByQuestions({
                    chosenProgrammes: programmes.chosen,
                    selectedAnswers,
                    questionsList,
                    usersProgrammes,
                    lang,
                  })
                : []
            }
            setActiveTab={setActiveTab}
            setShowing={setShowing}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!usersProgrammes || !selectedAnswers) return <></>
  if (usersProgrammes.length < 1) return <NoPermissions t={t} />

  return (
    <div className="report">
      <div className="info-header noprint" />
      <Grid doubling columns={2} padded="vertically" className="filter-container noprint">
        <Grid.Column width={10}>
          <Button as={Link} to="/" icon labelPosition="left" size="small" style={{ marginBottom: '3em' }}>
            <Icon name="arrow left" />
            {t('backToFrontPage')}
          </Button>
          <h1>{t('report:reportPage')}</h1>
          <FilterTray filter={filter} setFilter={setFilter} />
          <Accordion fluid styled className="question-filter">
            <Accordion.Title active onClick={() => setOpenQuestions(!openQuestions)}>
              {t('report:selectQuestions')}{' '}
              <span className="noprint">
                <Icon name={`caret ${openQuestions ? 'down' : 'right'}`} />
              </span>
            </Accordion.Title>
            <Accordion.Content active={openQuestions}>
              <QuestionList label="" questionsList={questionsList} />
            </Accordion.Content>
          </Accordion>
        </Grid.Column>
        <Grid.Column width={6}>
          <ProgrammeList programmes={programmes} setPicked={setPicked} picked={picked} />
        </Grid.Column>
      </Grid>
      <Tab
        className="report-tab"
        onTabChange={handleTabChange}
        activeIndex={activeTab}
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
    </div>
  )
}
