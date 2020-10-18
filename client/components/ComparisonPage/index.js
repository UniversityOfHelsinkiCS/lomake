import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Tab } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import Comparison from './Comparison'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/Generic/YearSelector'
import {
  answersByYear,
  cleanText,
  getMeasuresAnswer,
  facultiesWithKeys,
  programmeNameByKey as programmeName,
  sortedItems
} from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import questions from '../../questions'
import './ComparisonPage.scss'


export default () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const facultiesData = useSelector(({ faculties }) => faculties.data)
  const usersProgrammes = useSelector((state) => state.studyProgrammes.usersProgrammes)
  const selectedAnswers = answersByYear(year, answers, oldAnswers)
  const faculties = facultiesWithKeys(facultiesData)


  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${translations['comparisonPage'][lang]}`
  }, [lang])

  if (!selectedAnswers) return <></>
  
  const modifiedQuestions = () => {
    let attributes = []
    let titleIndex = -1
    let labelIndex = -1

    questions.forEach((question) => {
      titleIndex = titleIndex + 1  
      question.parts.forEach((part) => {
        if (part.type !== "TITLE") {
          if (part.type === "ENTITY" || part.type === "MEASURES") labelIndex = labelIndex + 1

          attributes = [...attributes, {
            "id": `${part.id}_text`,
            "color": `${part.id}_light`,
            "label": part.label[lang] ? part.label[lang] : '',
            "description": part.description ? part.description[lang] : '',
            "title": question.title[lang],
            "titleIndex": titleIndex,
            "labelIndex": (part.type === "ENTITY" || part.type === "MEASURES") ? `${labelIndex}.` : '',
            "no_light": part.no_light
          }]
        }
      })
    })
    
    return attributes
  }

  const questionsList = modifiedQuestions()

  const answersByQuestions = (chosenProgrammes) => {
    let answerMap = new Map()
    const chosenKeys = chosenProgrammes.map((p) => p.key)
    selectedAnswers.forEach((programme) => {
      const key = programme.programme

      if (chosenKeys.includes(key)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let answersByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
          let color = data[question.color] ? data[question.color] : 'emptyAnswer'
          const name = programmeName(usersProgrammes, programme, lang)
          let answer = ''
          if (question.id === "measures_text") answer = getMeasuresAnswer(data)
          else if (!question.id.startsWith("meta")) answer = cleanText(data[question.id])

          answersByProgramme = [...answersByProgramme, { name: name, key: key, color: color, answer: answer }]
          answerMap.set(question.id, answersByProgramme)
        })
      }
    })

    return answerMap
  }

  const panes = [
    usersProgrammes.length > 5 &&
    { menuItem: translations.reportHeader['faculty'][lang], render: () =>
      <Tab.Pane>
        <Comparison
          year={year}
          questionsList={questionsList}
          usersProgrammes={sortedItems(usersProgrammes, 'name', lang)}
          allAnswers={usersProgrammes ? answersByQuestions(usersProgrammes) : []}
          facultiesByKey={faculties}
        />
      </Tab.Pane>
    }
  ]

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={lang} />

  return (
    <>
      <div className="report-info-header" />
      <Grid
        doubling
        columns={2}
        padded='vertically'
        className="report-filter-container"
      >
        <Grid.Column width={10}>
          <h1>{translations.comparisonPage[lang]}</h1>
          <YearSelector />
        </Grid.Column>
      </Grid>
      <Tab
        className="report-page-tab"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
  </>
  )
}