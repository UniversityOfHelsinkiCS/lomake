import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Segment, Tab } from 'semantic-ui-react'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import WrittenAnswers from './WrittenAnswers'
import SmileyAnswers from './SmileyAnswers'
import NoPermissions from 'Components/Generic/NoPermissions'
import LevelFilter from 'Components/Generic/LevelFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import YearSelector from 'Components/Generic/YearSelector'
import {
  answersByYear, 
  cleanText,
  getMeasuresAnswer,
  facultiesWithKeys,
  programmeNameByKey as programmeName, 
} from 'Utilities/common'
import { translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import questions from '../../questions'
import './ReportPage.scss'


export default () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const user = useSelector((state) => state.currentUser)
  const lang = useSelector((state) => state.language)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const facultiesData = useSelector(({ faculties }) => faculties.data)
  const selectedFaculty = useSelector((state) => state.faculties.selectedFaculty)
  const level = useSelector((state) => state.programmeLevel)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    document.title = `${translations['reportPage'][lang]}`
  }, [lang])

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

  const filteredByName = useMemo(() => {
    return usersProgrammes.filter((prog) => {
      const searchTarget = prog.name[lang] ? prog.name[lang] : prog.name['en'] // Because sw and fi dont always have values.
      return searchTarget.toLowerCase().includes(debouncedFilter.toLowerCase())
    })
  }, [usersProgrammes, lang, debouncedFilter])

  const filteredByLevel = useMemo(() => {
    if (level === 'allProgrammes') return filteredByName
    const filtered = filteredByName.filter((p) => {
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

    return filtered
  }, [filteredByName, lang, level])

  const filteredProgrammes = useMemo(() => {
    if (selectedFaculty === 'allFaculties') return filteredByLevel
    const filtered = filteredByLevel.filter((p) => {
      const faculty = faculties.get(p.key)
      return (faculty === selectedFaculty)
    })

    return filtered
  }, [filteredByLevel, faculties, selectedFaculty])

  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const selectedAnswers = useMemo(() => answersByYear(year, answers, oldAnswers))

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
          let label = part.label['en'] ? part.label : question.title
          const description = part.description ? part.description : { 'fi': '', 'en': '', 'se': '' }
          const id = `${part.id}_text`

          attributes = [...attributes, { 
            "id": id,
            "color": `${part.id}_light`,
            "label": label[lang] ? label[lang] : label['en'], 
            "description": description[lang] ? description[lang] : description['en'],
            "title": question.title[lang] ? question.title[lang] : question.title['en'], 
            "titleIndex": titleIndex,
            "labelIndex": (part.type === "ENTITY" || part.type === "MEASURES") ? `${labelIndex}.` : '',
            "no_light": (
              part.type === "MEASURES" 
              || part.no_light
              || part.id.includes("information_needed") 
              || part.id.includes("information_used")) ? true : false
          }]  
        }
      })
    })
    
    return attributes
  }

  const questionsList = modifiedQuestions()

  const answersByQuestions = () => {
    let answerMap = new Map()
    const filteredKeys = filteredProgrammes.map((p) => p.key)
    selectedAnswers.forEach((programme) => {
      if (filteredKeys.includes(programme.programme)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let answer = ''
          let questionData = answerMap.get(question.id) ? answerMap.get(question.id) : []
          let color = data[question.color] ? data[question.color] : 'emptyAnswer'
          const name = programmeName(usersProgrammes, programme, lang)
          if (question.id === "measures_text") answer = getMeasuresAnswer(data)
          else if (!question.id.startsWith("meta")) answer = cleanText(data[question.id])

          questionData = [...questionData, {name: name, color: color, answer: answer}]  
          if (answer) answerMap.set(question.id, questionData)
        })
      }
    })

    return answerMap
  }

  const allAnswers = answersByQuestions()
  
  const panes = [
    { menuItem: translations.reportHeader['written'][lang], render: () =>
      <Tab.Pane className="report-page-tab">
        <WrittenAnswers
          year={year}
          level={level}
          lang={lang}
          filteredProgrammes={filteredProgrammes}
          usersProgrammes={usersProgrammes}
          questionsList={questionsList}
          allAnswers={allAnswers}
        />
      </Tab.Pane> 
    },
    { menuItem: translations.reportHeader['smileys'][lang], render: () => 
      <Tab.Pane>
        <SmileyAnswers
          year={year}
          level={level}
          lang={lang}
          allAnswers={allAnswers}
          filteredProgrammes={filteredProgrammes}
          questionsList={questionsList}
        />
      </Tab.Pane> 
    },
  ]

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={lang} />

  return (
    <>
      <div className="report-filter-container">
        <h1>{translations.reportPage[lang]}</h1>
        <YearSelector />
        {usersProgrammes.length > 1 &&
          <>
            <FacultyFilter />
            <LevelFilter usersProgrammes={usersProgrammes}/>
            <ProgrammeFilter
              handleChange={handleChange}
              filter={filter}
              lang={lang}
            />
          </>
        }
        <div className="report-programmes-container">
          {filteredProgrammes.length > 0 ?
            <>
              <p className="report-programmes-header">{translations.nowShowing[lang]}</p>
              <Segment className="report-programmes-list">
                {filteredProgrammes.map((p) => 
                  <p 
                    className="report-programme" 
                    onClick={() => setFilter(p.name[lang])}
                    key={p.key}
                  >
                    {p.name[lang] ? p.name[lang] : p.name['en']}
                  </p>
                )}
              </Segment>
            </>
            : 
            <h3>{translations.noData[lang]}</h3>
          }
        </div>
      </div>
      <Tab
        className="report-page-tab"
        menu={{ secondary: true, pointing: true }}
        panes={panes}
      />
    </>
  )
}