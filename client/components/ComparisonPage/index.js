import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Grid, Tab } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import CompareByFaculty from './CompareByFaculty'
import CompareByYear from './CompareByYear'
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
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import questions from '../../questions'
import './ComparisonPage.scss'

export default () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const user = useSelector((state) => state.currentUser.data)
  const lang = useSelector((state) => state.language)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector(({ filters }) => filters.year)
  const usersProgrammes = useSelector((state) => state.studyProgrammes.usersProgrammes)
  const deadlinePassed = useSelector((state) => state.deadlines.nextDeadline)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${translations['comparisonPage'][lang]}`
  }, [lang])

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  if (!usersProgrammes) return <></>

  const years = allYears(oldAnswers)

  const questionsList = modifiedQuestions(questions, lang)

  const answersByQuestions = (chosenYear) => {
    let answerMap = new Map()
    const chosenKeys = usersProgrammes.map((p) => p.key)
    const selectedAnswers = answersByYear(chosenYear, answers, oldAnswers, deadlinePassed)
    if (!selectedAnswers) return new Map()
    selectedAnswers.forEach((programme) => {
      const key = programme.programme

      if (chosenKeys.includes(key)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let colorsByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
          let color = data[question.color] ? data[question.color] : 'emptyAnswer'
          const name = programmeName(usersProgrammes, programme, lang)
          let answer = ''
          if (question.id === 'measures_text') answer = getMeasuresAnswer(data)
          else if (!question.id.startsWith('meta')) answer = cleanText(data[question.id])

          colorsByProgramme = [...colorsByProgramme, { name, key, color, answer }]

          answerMap.set(question.id, colorsByProgramme)
        })
      }
    })
    // if the programme has not yet been answered at all, it won't appear in the selectedAnswers.
    // So empty answers need to be added.
    answerMap.forEach((value, key) => {
      const answeredProgrammes = value.map((p) => p.key)
      const programmesMissing = usersProgrammes.filter((p) => !answeredProgrammes.includes(p.key))
      if (programmesMissing) {
        for (const p of programmesMissing) {
          const earlierAnswers = answerMap.get(key)
          answerMap.set(key, [
            ...earlierAnswers,
            { name: p.name[lang] ? p.name[lang] : p.name['en'], key: p.key, color: 'emptyAnswer' },
          ])
        }
      }
    })

    return answerMap
  }

  const answersForYears = () => {
    const all = years.map((year) => {
      let data = { year, answers: answersByQuestions(year) }
      return data
    })
    return all
  }
  const panes = [
    {
      menuItem: translations.reportHeader['byFaculty'][lang],
      render: () => (
        <Tab.Pane>
          <CompareByFaculty
            year={year}
            questionsList={questionsList}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
            allAnswers={usersProgrammes ? answersByQuestions(year) : []}
          />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.reportHeader['byYear'][lang],
      render: () => (
        <Tab.Pane>
          <CompareByYear
            questionsList={questionsList.filter((q) => !q.no_color)}
            usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
            allAnswers={usersProgrammes ? answersForYears() : []}
          />
        </Tab.Pane>
      ),
    },
  ]

  if (usersProgrammes.length < 1) return <NoPermissions lang={lang} />

  return (
    <>
      <div className="comparison-info-header noprint" />
      <Grid doubling columns={2} padded="vertically" className="comparison-filter-container">
        <Grid.Column width={10}>
          <h1>{translations.comparisonPage[lang]}</h1>
        </Grid.Column>
      </Grid>
      <Tab
        className="comparison-tab"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
    </>
  )
}
