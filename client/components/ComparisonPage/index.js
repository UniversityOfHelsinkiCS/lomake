import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Grid, Tab } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import Comparison from './Comparison'
import NoPermissions from 'Components/Generic/NoPermissions'
import {
  answersByYear,
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
  const deadlinePassed = useSelector((state) => state.deadlines.hasTheDeadlinePassed)
  const selectedAnswers = answersByYear(year, answers, oldAnswers, deadlinePassed)
  const faculties = facultiesWithKeys(facultiesData)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${translations['comparisonPage'][lang]}`
  }, [lang])

  if (!selectedAnswers || !usersProgrammes || !faculties) return <></>
  
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

  const answersByQuestions = () => {
    let answerMap = new Map()
    const chosenKeys = usersProgrammes.map((p) => p.key)
    selectedAnswers.forEach((programme) => {
      const key = programme.programme

      if (chosenKeys.includes(key)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let colorsByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
          let color = data[question.color] ? data[question.color] : 'emptyAnswer'
          const name = programmeName(usersProgrammes, programme, lang)

          colorsByProgramme = [...colorsByProgramme, { name: name, key: key, color: color }]
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
          answerMap.set(key, [...earlierAnswers, { name: p.name[lang] ? p.name[lang] : p.name['en'], key: p.key, color: 'emptyAnswer'}])
        }
      }
    })

    return answerMap
  }

  const panes = [
    { menuItem: translations.reportHeader['comparison'][lang], render: () =>
      <Tab.Pane>
        <Comparison
          year={year}
          questionsList={questionsList}
          usersProgrammes={usersProgrammes ? sortedItems(usersProgrammes, 'name', lang) : []}
          allAnswers={usersProgrammes ? answersByQuestions() : []}
          facultiesByKey={faculties}
        />
      </Tab.Pane>
    }
  ]

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={lang} />

  return (
    <>
      <div className="comparison-info-header" />
      <Grid
        doubling
        columns={2}
        padded='vertically'
        className="comparison-filter-container"
      >
        <Grid.Column width={10}>
          <h1>{translations.comparisonPage[lang]}</h1>
        </Grid.Column>
      </Grid>
      <Tab
        className="comparison-page-tab"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
  </>
  )
}