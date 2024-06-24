import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Accordion, Button, Icon, Grid, Tab } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import ProgrammeList from 'Components/Generic/ProgrammeList'
import { formKeys } from '@root/config/data'
import { setForm } from 'Utilities/redux/filterReducer'

import QuestionList from 'Components/Generic/QuestionList'
import { answersByYear, filteredProgrammes, modifiedQuestions, answersByQuestions } from 'Utilities/common'
import useDebounce from 'Utilities/useDebounce'
import FilterTray from './FilterTray'
import ColorAnswers from './ColorAnswers'
import WrittenAnswers from './WrittenAnswers'
import './ReportPage.scss'

export default () => {
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
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const faculties = useSelector(state => state.faculties.data)
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline: nextDeadline,
    form: filters.form,
  })

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${t('report:reportPage')}`
  }, [lang])

  useEffect(() => {
    const url = window.location.href
    const facStart = url.indexOf('form=')
    if (facStart !== -1) {
      const formNumber = Number(url.substring(facStart + 5))
      dispatch(setForm(formNumber))
    } else {
      dispatch(setForm(1))
    }
  }, [])

  let programmes
  if (filters.form === formKeys.EVALUATION_FACULTIES) {
    const filterFakeFaculties = faculties.filter(f => f.code !== 'UNI' && f.code !== 'HTEST')
    programmes = filteredProgrammes(lang, filterFakeFaculties, picked, debouncedFilter, filters)
  } else {
    // Handles all filtering
    programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)
  }

  const questionsList = modifiedQuestions(lang, filters.form)

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
                ? answersByQuestions({
                    chosenProgrammes: programmes.chosen,
                    selectedAnswers,
                    questionsList,
                    usersProgrammes,
                    lang,
                    t,
                    form: filters.form,
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
      menuItem: t('trafficLights'),
      render: () => (
        <Tab.Pane className="tab-pane">
          <ColorAnswers
            year={year}
            questionsList={questionsList}
            chosenProgrammes={programmes.chosen}
            allAnswers={
              programmes.chosen
                ? answersByQuestions({
                    chosenProgrammes: programmes.chosen,
                    selectedAnswers,
                    questionsList,
                    usersProgrammes,
                    lang,
                    t,
                    form: filters.form,
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

  if (!usersProgrammes || !selectedAnswers) return <div />
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
