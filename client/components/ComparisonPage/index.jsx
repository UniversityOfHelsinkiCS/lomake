/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link } from 'react-router'
import { Button, Menu, Tab } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import NoPermissions from '../Generic/NoPermissions'
import { formKeys } from '../../../config/data'
import {
  allYears,
  modifiedQuestions,
  sortedItems,
  filteredProgrammes,
  answersByYear,
  answersByQuestions,
} from '../../util/common'
import useDebounce from '../../util/useDebounce'
import { setForm } from '../../redux/filterReducer'
import { getAnswersActionAll } from '../../redux/oldAnswersReducer'

import { getAllTempAnswersAction } from '../../redux/tempAnswersReducer'
import { isAdmin } from '../../../config/common'
import CompareByYear from './CompareByYear'
import CompareByFaculty from './CompareByFaculty'
import './ComparisonPage.scss'

const answersForFaculty = ({
  usersProgrammes,
  year,
  answers,
  oldAnswers,
  draftYear,
  questionsList,
  lang,
  form,
  deadline,
  t,
}) => {
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear?.year,
    deadline,
    form,
  })
  const answerMap = answersByQuestions({
    chosenProgrammes: usersProgrammes,
    selectedAnswers,
    questionsList,
    usersProgrammes,
    lang,
    form,
    t,
  })
  return answerMap
}

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [picked, setPicked] = useState([])

  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const filters = useSelector(state => state.filters)
  const faculties = useSelector(state => state.faculties.data)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    dispatch(getAnswersActionAll())
    document.title = `${t('comparison:compare')}`
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

  if (!answers || answers?.pending) return <div />

  const years = allYears(oldAnswers)

  const questionsList = modifiedQuestions(lang, filters.form)

  let programmes
  if (filters.form === formKeys.EVALUATION_FACULTIES) {
    const filterFakeFaculties = faculties.filter(f => f.code !== 'UNI' && f.code !== 'HTEST')
    programmes = filteredProgrammes(lang, filterFakeFaculties, picked, debouncedFilter, filters)
  } else {
    // Handles all filtering
    programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)
  }

  const answersForYears = () => {
    const all = years.map(year => {
      const selectedAnswers = answersByYear({
        year,
        tempAnswers: answers,
        oldAnswers,
        draftYear: draftYear?.year,
        deadline: nextDeadline,
        form: filters.form,
      })
      const data = {
        year,
        answers: answersByQuestions({
          chosenProgrammes: programmes.chosen,
          selectedAnswers,
          questionsList,
          usersProgrammes,
          lang,
          t,
          form: filters.form,
        }),
      }
      return data
    })
    return all
  }

  const compareByFacultyAnswers = usersProgrammes
    ? answersForFaculty({
        usersProgrammes,
        year: filters.year,
        answers,
        oldAnswers,
        draftYear,
        questionsList,
        lang,
        form: filters.form,
        deadline: nextDeadline,
        t,
      })
    : []

  let panes = [
    {
      index: 0,
      menuItem: t('comparison:reportHeader:byFaculty'),
      render: () => (
        <Tab.Pane>
          <CompareByFaculty
            allAnswers={compareByFacultyAnswers}
            questionsList={questionsList}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
            year={filters.year}
          />
        </Tab.Pane>
      ),
    },
    {
      index: 1,
      menuItem: t('comparison:reportHeader:byYear'),
      render: () => (
        <Tab.Pane>
          <CompareByYear
            allAnswers={usersProgrammes ? answersForYears() : []}
            faculties={faculties}
            filter={debouncedFilter}
            picked={picked}
            programmes={programmes}
            questionsList={questionsList.filter(q => !q.no_color)}
            setFilter={setFilter}
            setPicked={setPicked}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!user || !usersProgrammes) return null
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  if (!isAdmin(user) && usersProgrammes.length <= 5) navigate('/yearly')
  if (usersProgrammes.length < 1) return <NoPermissions requestedForm={t('comparison:compare')} t={t} />

  if (filters.form === formKeys.EVALUATION_FACULTIES) {
    const paneOptions = panes.filter(pane => pane.index === 1)
    panes = paneOptions
  }

  return (
    <div className="comparison" key={filters.form}>
      <div className="info-header noprint" />
      <Menu secondary>
        <Menu.Item>
          <Button as={Link} icon="arrow left" size="small" to="/yearly" />
        </Menu.Item>
        <Menu.Item>
          <h1>{t('comparison:compare')}</h1>
        </Menu.Item>
      </Menu>
      <Tab className="comparison tab" menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}
