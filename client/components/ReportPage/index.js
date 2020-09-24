import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import Question from './Question'
import NoPermissions from 'Components/Generic/NoPermissions'
import YearSelector from 'Components/OverviewPage/YearSelector'
import { 
  answersByYear, 
  cleanText,
  getMeasuresAnswer,
  programmeNameByKey as programmeName, 
} from 'Utilities/common'
import { translations } from 'Utilities/translations'
import questions from '../../questions'
import './ReportPage.scss'


export default () => {
  const dispatch = useDispatch()
  const currentUser = useSelector((state) => state.currentUser)
  const languageCode = useSelector((state) => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const [showing, setShowing] = useState(-1)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])

  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(currentUser.data.access)
    return currentUser.data.admin
      ? programmes
      : programmes.filter((program) => usersPermissionsKeys.includes(program.key))
  }, [programmes, currentUser.data])

  const selectedAnswers = answersByYear(year, answers, oldAnswers)

  if (!selectedAnswers) return <></>
  
  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  const modifiedQuestions = () => {
    let attributes = []
    let titleIndex = -1
    questions.forEach((question) => {
      titleIndex = titleIndex + 1
      question.parts.forEach((part) => {
        if (part.type !== "TITLE") {
          let label = part.label['en'] ? part.label : question.title
          const description = part.description ? part.description : { 'fi': '', 'en': '', 'se': '' }
          const id = `${part.id}_text`
          attributes = [...attributes, { 
            "id": id,
            "label": label[languageCode] ? label[languageCode] : label['en'], 
            "description": description[languageCode] ? description[languageCode] : description['en'],
            "title": question.title[languageCode] ? question.title[languageCode] : question.title['en'], 
            "titleIndex": titleIndex
          }]  
        }
      })
    })
    
    return attributes
  }

  const questionsList = modifiedQuestions()

  const answersByQuestions = () => {
    let answerMap = new Map()
    selectedAnswers.forEach((programme) => {
      const data = programme.data
      questionsList.forEach((question) => {
        let name = ''
        let answer = ''
        let questionData = answerMap.get(question.id) ? answerMap.get(question.id) : []

        if (usersProgrammes.length > 1) name = programmeName(usersProgrammes, programme, languageCode)
        if (question.id === "measures_text") answer = getMeasuresAnswer(data)
        else if (!question.id.startsWith("meta")) answer = cleanText(data[question.id])
        questionData = [...questionData, {name: name, answer: answer}]        
        if (answer) answerMap.set(question.id, questionData)
      })  
    })

    return answerMap
  }

  const allAnswers = answersByQuestions()

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={languageCode} />

  return (
    <>
      <div className="filter-container">
        <YearSelector />
      </div>
      <Accordion fluid styled className="question-accordion">
        <Accordion.Title active>
          <Grid>
            <Grid.Column width={1} className="left-header"/>
            <Grid.Column width={6}>
              {translations.questions[languageCode]}
            </Grid.Column>
            <Grid.Column width={4}>
              {year} - {translations.reportHeader[languageCode]}
            </Grid.Column>
            <Grid.Column width={5} floated="right">
              <p className="right-header">
                {translations.answered[languageCode]} / {translations.allProgrammes[languageCode]}
              </p>
            </Grid.Column>
          </Grid>
        </Accordion.Title>
        {questionsList.map((question) =>
          <Question
            key={question.id}
            answers={allAnswers ? allAnswers.get(question.id).sort((a,b) => a['name'].localeCompare(b['name'])) : ''}
            disabled={allAnswers.get(question.id) ? 'enabled' : 'disabled'}
            question={question}
            usersProgrammes={usersProgrammes}
            year={year}
            handleClick={handleClick}
            showing={showing}
          />
        )}
      </Accordion>
    </>
  )
}