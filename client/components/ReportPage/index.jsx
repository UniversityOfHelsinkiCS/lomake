/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import { Accordion, Button, Icon, Grid, Tab, Menu } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { getAllTempAnswersAction } from '../../redux/tempAnswersReducer'
import NoPermissions from '../Generic/NoPermissions'
import { formKeys } from '../../../config/data'
import { setForm } from '../../redux/filterReducer'

import { answersByYear, filteredProgrammes, modifiedQuestions, answersByQuestions } from '../../util/common'
import useDebounce from '../../util/useDebounce'
import YearSelector from '../Generic/YearSelector'
import ProgrammeList from '../Generic/ProgrammeList'
import FormFilter from '../Generic/FormFilter'
import QuestionList from '../Generic/QuestionList'
import { getAnswersActionAll } from '../../redux/oldAnswersReducer'
import FilterTray from './FilterTray'
import ColorAnswers from './ColorAnswers'
import WrittenAnswers from './WrittenAnswers'
import './ReportPage.scss'

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
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
    ...(filters.form === formKeys.FACULTY_MONITORING
      ? {
          // faculty monitoring is designed to be always ongoing but the form may be closed at times, hence this current year fallback
          draftYear: draftYear?.year || new Date().getFullYear(),
          deadline: nextDeadline || new Date(),
        }
      : {
          draftYear: draftYear?.year,
          deadline: nextDeadline,
        }),
    form: filters.form,
  })

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    dispatch(getAnswersActionAll())
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
  if (filters.form === formKeys.EVALUATION_FACULTIES || filters.form === formKeys.FACULTY_MONITORING) {
    const filterFakeFaculties = faculties.filter(f => f.code !== 'UNI' && f.code !== 'HTEST')
    programmes = filteredProgrammes(lang, filterFakeFaculties, picked, debouncedFilter, filters)
  } else {
    // Handles all filtering
    programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)
  }

  let questionsList = modifiedQuestions(lang, filters.form)

  if (filters.form === formKeys.META_EVALUATION || filters.form === formKeys.FACULTY_MONITORING) {
    questionsList = questionsList.filter(q => {
      if (filters.level === 'doctoral') {
        return q.id.startsWith('T')
      }
      if (filters.level !== 'allProgrammes') {
        return !q.id.startsWith('T')
      }
      return true
    })
  }

  const handleTabChange = (e, { activeIndex }) => setActiveTab(activeIndex)

  const panes = [
    {
      menuItem: t('writtenAnswers'),
      render: () => (
        <Tab.Pane className="tab-pane">
          <WrittenAnswers
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
            chosenProgrammes={programmes.chosen}
            questionsList={questionsList}
            setShowing={setShowing}
            showing={showing}
            usersProgrammes={usersProgrammes}
            year={year}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('trafficLights'),
      render: () => (
        <Tab.Pane className="tab-pane">
          <ColorAnswers
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
            chosenProgrammes={programmes.chosen}
            questionsList={questionsList}
            setActiveTab={setActiveTab}
            setShowing={setShowing}
            year={year}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!usersProgrammes || !selectedAnswers) return <div />
  if (usersProgrammes.length < 1) return <NoPermissions requestedForm={t('report:reportPage')} t={t} />

  return (
    <div style={{ width: '80%', maxWidth: '80%' }}>
      <div className="no-print">
        <Menu secondary>
          <Menu.Item>
            <Button icon="arrow left" onClick={() => navigate(-1)} size="small" />
          </Menu.Item>
          <Menu.Item>
            <h1>{t('report:reportPage')}</h1>
          </Menu.Item>
          <Menu.Item>
            <YearSelector size="small" />
          </Menu.Item>
          <Menu.Item>
            <FormFilter />
          </Menu.Item>
        </Menu>
        <FilterTray filter={filter} setFilter={setFilter} />
        <Grid columns={2} doubling padded="vertically">
          <Grid.Column>
            <Accordion fluid style={{ maxHeight: '400px', overflowY: 'auto' }} styled>
              <Accordion.Title active onClick={() => setOpenQuestions(!openQuestions)}>
                {t('report:selectQuestions')}{' '}
                <span>
                  <Icon name={`caret ${openQuestions ? 'down' : 'right'}`} />
                </span>
              </Accordion.Title>
              <Accordion.Content active={openQuestions}>
                <QuestionList label="" questionsList={questionsList} />
              </Accordion.Content>
            </Accordion>
          </Grid.Column>
          <Grid.Column>
            <ProgrammeList picked={picked} programmes={programmes} setPicked={setPicked} />
          </Grid.Column>
        </Grid>
      </div>
      <Tab
        activeIndex={activeTab}
        menu={{ secondary: true, pointing: true }}
        onTabChange={handleTabChange}
        panes={panes}
      />
    </div>
  )
}
