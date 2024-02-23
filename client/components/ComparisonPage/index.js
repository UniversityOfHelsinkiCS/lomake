import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Icon, Grid, Tab } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import NoPermissions from 'Components/Generic/NoPermissions'
import { formKeys, facultyList } from '@root/config/data'
import {
  allYears,
  cleanText,
  getMeasuresAnswer,
  modifiedQuestions,
  programmeNameByKey as programmeName,
  sortedItems,
  getSelectionAnswer,
  getOrderAnswer,
  getActionsAnswer,
  filteredProgrammes,
  answersByYear,
} from 'Utilities/common'
import useDebounce from 'Utilities/useDebounce'

import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { isAdmin } from '@root/config/common'
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
}) => {
  const answerMap = new Map()
  const chosenKeys = usersProgrammes.map(p => p.key)
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline,
    form,
  })
  if (!selectedAnswers) return new Map()
  selectedAnswers.forEach(programme => {
    const key = programme.programme

    if (chosenKeys.includes(key)) {
      const { data } = programme
      questionsList.forEach(question => {
        let colorsByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
        const color = data[question.color] ? data[question.color] : 'emptyAnswer'
        const name = programmeName(usersProgrammes, programme, lang)
        let answer = ''
        if (question.id.startsWith('measures')) answer = getMeasuresAnswer(data, question.id)
        else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

        colorsByProgramme = [...colorsByProgramme, { name, key, color, answer }]

        answerMap.set(question.id, colorsByProgramme)
      })
    }
  })
  // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
  // So empty answers need to be added.
  answerMap.forEach((value, key) => {
    const answeredProgrammes = value.map(p => p.key)
    const programmesMissing = usersProgrammes.filter(p => !answeredProgrammes.includes(p.key))
    if (programmesMissing) {
      programmesMissing.forEach(p => {
        const earlierAnswers = answerMap.get(key)
        answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: p.key, color: 'emptyAnswer' }])
      })
    }
  })
  return answerMap
}

const getAnswersByQuestions = ({
  chosenProgrammes,
  selectedAnswers,
  questionsList,
  usersProgrammes,
  lang,
  t,
  form,
}) => {
  const answerMap = new Map()
  // if the 'programme' is faculty use -> code
  const chosenKeys = chosenProgrammes.map(p => p.key || (form === formKeys.EVALUATION_FACULTIES && p.code))
  selectedAnswers.forEach(programme => {
    const key = programme.programme

    if (chosenKeys.includes(key)) {
      const { data } = programme
      questionsList.forEach(question => {
        let color = null
        if (form === formKeys.EVALUATION_FACULTIES) {
          const bachelorColor = data[question.color[0]] ? data[question.color[0]] : 'emptyAnswer'
          const masterColor = data[question.color[1]] ? data[question.color[1]] : 'emptyAnswer'
          const doctoralColor = data[question.color[2]] ? data[question.color[2]] : 'emptyAnswer'
          color = { bachelor: bachelorColor, master: masterColor, doctoral: doctoralColor }
        } else {
          color = data[question.color] ? data[question.color] : 'emptyAnswer'
        }
        let answersByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
        let name = programmeName(usersProgrammes, programme, lang)
        if (form === formKeys.EVALUATION_FACULTIES) {
          name = facultyList.find(f => f.code === programme.programme).name[lang]
        }
        let answer = ''

        if (question.id.startsWith('measures')) answer = getMeasuresAnswer(data, question.id)
        else if (question.id.endsWith('selection')) answer = getSelectionAnswer(data, question, lang)
        else if (question.id.endsWith('_order')) answer = getOrderAnswer(data, question, lang)
        else if (question.id.includes('actions')) answer = getActionsAnswer(data, question.id, t)
        else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

        answersByProgramme = [...answersByProgramme, { name, key, color, answer }]

        answerMap.set(question.id, answersByProgramme)
      })
    }
  })

  // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
  // So empty answers need to be added.
  answerMap.forEach((value, key) => {
    const answeredProgrammes = value.map(p => (form === formKeys.EVALUATION_FACULTIES ? p.code : p.key))
    const programmesMissing = chosenProgrammes.filter(p => !answeredProgrammes.includes(p.key))
    if (programmesMissing) {
      programmesMissing.forEach(p => {
        const earlierAnswers = answerMap.get(key)
        const programmeCode = form === formKeys.EVALUATION_FACULTIES ? p.code : p.key
        answerMap.set(key, [...earlierAnswers, { name: p.name[lang], key: programmeCode, color: 'emptyAnswer' }])
      })
    }
  })

  return answerMap
}

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const [picked, setPicked] = useState([])

  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const year = useSelector(({ filters }) => filters.year)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const filters = useSelector(state => state.filters)
  const faculties = useSelector(state => state.faculties.data)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${t('comparison:compare')}`
  }, [lang])

  if (!answers || answers?.pending) return <div />
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline: nextDeadline,
    form: filters.form,
  })

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
      const data = {
        year,
        answers: getAnswersByQuestions({
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

  const panes = [
    {
      menuItem: t('comparison:reportHeader:byFaculty'),
      render: () => (
        <Tab.Pane>
          <CompareByFaculty
            year={year}
            questionsList={questionsList}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
            form={filters.form}
            allAnswers={
              usersProgrammes
                ? answersForFaculty({
                    usersProgrammes,
                    year,
                    answers,
                    oldAnswers,
                    draftYear,
                    questionsList,
                    lang,
                    form: filters.form,
                    deadline: nextDeadline,
                  })
                : []
            }
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('comparison:reportHeader:byYear'),
      render: () => (
        <Tab.Pane>
          <CompareByYear
            questionsList={questionsList.filter(q => !q.no_color)}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
            allAnswers={usersProgrammes ? answersForYears() : []}
            faculties={faculties}
            programmes={programmes}
            setPicked={setPicked}
            picked={picked}
            setFilter={setFilter}
            filter={debouncedFilter}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!user || !usersProgrammes) return null
  if (!isAdmin(user) && usersProgrammes.length <= 5) history.push('/')
  if (usersProgrammes.length < 1) return <NoPermissions t={t} />

  return (
    <div className="comparison">
      <div className="info-header noprint" />
      <Grid doubling columns={2} padded="vertically" className="comparison filter-container">
        <Grid.Column width={10}>
          <Button as={Link} to="/" icon labelPosition="left" size="small" style={{ marginBottom: '3em' }}>
            <Icon name="arrow left" />
            {t('backToFrontPage')}
          </Button>
          <h1>{t('comparison:compare')}</h1>
        </Grid.Column>
      </Grid>
      <Tab className="comparison tab" menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}
