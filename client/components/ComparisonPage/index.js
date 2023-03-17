import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { Button, Icon, Grid, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'

import NoPermissions from 'Components/Generic/NoPermissions'
import {
  allYears,
  answersByYear,
  cleanText,
  getMeasuresAnswer,
  modifiedQuestions,
  programmeNameByKey as programmeName,
  sortedItems,
} from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { isAdmin } from '@root/config/common'
import CompareByYear from './CompareByYear'
import CompareByFaculty from './CompareByFaculty'
import questions from '../../questions.json'
import './ComparisonPage.scss'

const answersByQuestions = ({ usersProgrammes, year, answers, oldAnswers, draftYear, questionsList, lang }) => {
  const answerMap = new Map()
  const chosenKeys = usersProgrammes.map(p => p.key)
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
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

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const year = useSelector(({ filters }) => filters.year)
  const usersProgrammes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const draftYear = useSelector(state => state.deadlines.draftYear)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${t('comparison:compare')}`
  }, [lang])

  const years = allYears(oldAnswers)

  const questionsList = modifiedQuestions(questions, lang)

  const answersForYears = () => {
    const all = years.map(year => {
      const data = {
        year,
        answers: answersByQuestions({
          usersProgrammes,
          year,
          answers,
          oldAnswers,
          draftYear,
          questionsList,
          lang,
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
            allAnswers={
              usersProgrammes
                ? answersByQuestions({ usersProgrammes, year, answers, oldAnswers, draftYear, questionsList, lang })
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
          />
        </Tab.Pane>
      ),
    },
  ]

  if (!user || !usersProgrammes) return <></>
  if (!isAdmin(user) && usersProgrammes.length <= 5) history.push('/')
  if (usersProgrammes.length < 1) return <NoPermissions t={t} />

  return (
    <div className="comparison">
      <div className="info-header noprint" />
      <Grid doubling columns={2} padded="vertically" className="comparison filter-container">
        <Grid spacing={10}>
          <Button as={Link} to="/" icon labelPosition="left" size="small" style={{ marginBottom: '3em' }}>
            <Icon name="arrow left" />
            {t('backToFrontPage')}
          </Button>
          <h1>{t('comparison:compare')}</h1>
        </Grid>
      </Grid>
      <Tab className="comparison tab" menu={{ secondary: true, pointing: true }} panes={panes} />
    </div>
  )
}
