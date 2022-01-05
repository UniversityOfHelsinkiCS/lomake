import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Accordion, Button, Icon, Grid, Tab } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import ProgrammeList from 'Components/Generic/ProgrammeList'
import QuestionList from 'Components/Generic/QuestionList'
import YearSelector from 'Components/Generic/YearSelector'
import {
  answersByYear,
  cleanText,
  filteredProgrammes,
  getMeasuresAnswer,
  modifiedQuestions,
  programmeNameByKey as programmeName,
} from 'Utilities/common'
import { reportPageTranslations as translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import ColorAnswers from './ColorAnswers'
import WrittenAnswers from './WrittenAnswers'
import rawQuestions from '../../questions.json'
import './ReportPage.scss'

export default () => {
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
  const { year, faculty, level } = filters
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const draftYear = useSelector(state => state.deadlines.draftYear)
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
  })

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    setPicked(programmes.all)
    document.title = `${translations.reportPage[lang]}`
  }, [lang])

  // Handles all filtering
  const programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)

  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  if (!selectedAnswers) return <></>

  const questionsList = modifiedQuestions(rawQuestions, lang)

  const answersByQuestions = chosenProgrammes => {
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
        for (const p of programmesMissing) {
          const earlierAnswers = answerMap.get(key)
          answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: p.key, color: 'emptyAnswer' }])
        }
      }
    })

    return answerMap
  }

  const handleTabChange = (e, { activeIndex }) => setActiveTab(activeIndex)

  const panes = [
    {
      menuItem: translations.reportHeader.written[lang],
      render: () => (
        <Tab.Pane className="report-page-tab">
          <WrittenAnswers
            year={year}
            questionsList={questionsList}
            chosenProgrammes={programmes.chosen}
            usersProgrammes={usersProgrammes}
            allAnswers={programmes.chosen ? answersByQuestions(programmes.chosen) : []}
            showing={showing}
            setShowing={setShowing}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.reportHeader.colors[lang],
      render: () => (
        <Tab.Pane>
          <ColorAnswers
            year={year}
            questionsList={questionsList}
            chosenProgrammes={programmes.chosen}
            allAnswers={programmes.chosen ? answersByQuestions(programmes.chosen) : []}
            setActiveTab={setActiveTab}
            setShowing={setShowing}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!usersProgrammes) return <></>
  if (usersProgrammes.length < 1) return <NoPermissions lang={lang} />

  return (
    <>
      <div className="report-info-header noprint" />
      <Grid doubling columns={2} padded="vertically" className="report-filter-container noprint">
        <Grid.Column width={10}>
          <Button as={Link} to="/" icon labelPosition="left" size="small" style={{ marginBottom: '3em' }}>
            <Icon name="arrow left" />
            {translations.backToFrontPage[lang]}
          </Button>
          <h1>{translations.reportPage[lang]}</h1>
          <YearSelector size="small" />
          {usersProgrammes && usersProgrammes.length > 5 && (
            <>
              <FacultyFilter size="small" label={translations.facultyFilter[lang]} />
              <LevelFilter />
              {faculty !== 'allFaculties' && (level === 'doctoral' || level === 'master' || level === 'bachelor') && (
                <CompanionFilter />
              )}
              {faculty === 'allFaculties' && level === 'doctoral' && <DoctoralSchoolFilter />}
              <ProgrammeFilter
                handleChange={handleSearch}
                filter={filter}
                onEmpty={() => setFilter('')}
                lang={lang}
                label={translations.programmeFilter[lang]}
              />
            </>
          )}
          <Accordion fluid styled className="question-filter">
            <Accordion.Title
              className={`question-filter-title${openQuestions ? '-active' : ''} noprint`}
              active
              onClick={() => setOpenQuestions(!openQuestions)}
            >
              {translations.selectQuestions[lang]}{' '}
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
    </>
  )
}
