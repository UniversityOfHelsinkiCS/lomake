import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Grid, Segment } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import DisabledQuestion from './DisabledQuestion'
import Question from './Question'
import SingleProgramQuestion from './SingleProgramQuestion'
import NoPermissions from 'Components/Generic/NoPermissions'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import YearSelector from 'Components/OverviewPage/YearSelector'
import { 
  answersByYear, 
  cleanText,
  getMeasuresAnswer,
  facultiesWithKeys,
  programmeNameByKey as programmeName, 
} from 'Utilities/common'
import { translations } from 'Utilities/translations'
import questions from '../../questions'
import './ReportPage.scss'


export default () => {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser)
  const lang = useSelector((state) => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const facultiesData = useSelector(({ faculties }) => faculties.data)
  const selectedFaculty = useSelector((state) => state.faculties.selectedFaculty)
  const level = useSelector((state) => state.programmeLevel)
  const [showing, setShowing] = useState(-1)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])

  const levels = {
    allProgrammes : '',
    master : 'master',
    bachelor : 'bachelor',
    doctoral : 'doctor',
  }

  const usersProgrammes = useMemo(() => {
    const usersPermissionsKeys = Object.keys(user.data.access)
    return user.data.admin
      ? programmes
      : programmes.filter((p) => usersPermissionsKeys.includes(p.key))
  }, [programmes, user.data])

  const faculties = facultiesWithKeys(facultiesData)

  const filteredByLevel = useMemo(() => {
    if (level === 'allProgrammes') return usersProgrammes.map((p) => p.key)
    const filtered = usersProgrammes.filter((p) => {
      const searched = p.name['en'].toLowerCase() // Because se and fi don't always have values.
      if (level === 'otherProgrammes') {
        return !(
          searched.includes("master")
          || searched.includes("bachelor")
          || searched.includes("doctor")
        )
      }
      return searched.includes(levels[level].toString())
    })

    return filtered.map((p) => p.key)
  }, [usersProgrammes, lang, level])

  const filteredProgrammes = useMemo(() => {
    if (selectedFaculty === 'allFaculties') return filteredByLevel
    const filtered = filteredByLevel.filter((p) => {
      const faculty = faculties.get(p)
      return (faculty === selectedFaculty)
    })

    return filtered
  }, [filteredByLevel, faculties, selectedFaculty])

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
            "color": `${part.id}_light`,
            "label": label[lang] ? label[lang] : label['en'], 
            "description": description[lang] ? description[lang] : description['en'],
            "title": question.title[lang] ? question.title[lang] : question.title['en'], 
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
      if (filteredProgrammes.includes(programme.programme)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let answer = ''
          let questionData = answerMap.get(question.id) ? answerMap.get(question.id) : []
          const name = programmeName(usersProgrammes, programme, lang)
          if (question.id === "measures_text") answer = getMeasuresAnswer(data)
          else if (!question.id.startsWith("meta")) answer = cleanText(data[question.id])

          questionData = [...questionData, {name: name, color: data[question.color], answer: answer}]  
          if (answer) answerMap.set(question.id, questionData)
        })
      }
    })

    return answerMap
  }

  const allAnswers = answersByQuestions()

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={lang} />

  return (
    <>
      <div className="filter-container">
        <h1>{translations.reportPage[lang]}</h1>
        <YearSelector />
        {usersProgrammes.length > 1 &&
          <>
            <FacultyFilter />
            <LevelFilter usersProgrammes={usersProgrammes}/>
          </>
        }
      </div>
      <Accordion fluid styled className="question-accordion">
        <Accordion.Title className="question-accordion-header" active>
          <Grid>
            <Grid.Column width={4} className="left-header">
              <p>{translations.questions[lang]}</p>
            </Grid.Column>
            <Grid.Column width={6} className="center-header">
              <p>{year} - {translations.reportHeader[lang]} - {translations[level][lang]}</p>
            </Grid.Column>
            <Grid.Column width={5} className="right-header" floated="right">
              <p >
                {translations.answered[lang]} / {translations.allProgrammes[lang]}
              </p>
            </Grid.Column>
          </Grid>
        </Accordion.Title>
        {questionsList.map((question) =>
          (allAnswers.get(question.id) ? (
            filteredProgrammes.length === 1 ?
              <SingleProgramQuestion 
                key={question.id}
                answers={allAnswers.get(question.id)}
                question={question}
              />
              :
              <Question
                key={question.id}
                answers={allAnswers.get(question.id)}
                question={question}
                filteredProgrammes={filteredProgrammes}
                year={year}
                handleClick={handleClick}
                showing={filteredProgrammes.length < 2 ? question.id : showing}
              />
            )
            :
            <DisabledQuestion
              key={question.id}
              question={question}
              filteredProgrammes={filteredProgrammes}
            />
          )
        )}
      </Accordion>
    </>
  )
}