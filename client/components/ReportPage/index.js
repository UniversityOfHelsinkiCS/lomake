import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as _ from 'lodash'
import { Button, Grid, Icon, Segment, Tab } from 'semantic-ui-react'
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
  sortedItems,
} from 'Utilities/common'
import { translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import questions from '../../questions'
import './ReportPage.scss'


export default () => {
  const dispatch = useDispatch()
  const [filter, setFilter] = useState('')
  const [list, setList] = useState([])
  const [selectAll, setSelectAll] = useState(true)
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector((state) => state.language)
  const answers = useSelector((state) => state.tempAnswers)
  const oldAnswers = useSelector((state) => state.oldAnswers)
  const year = useSelector((state) => state.form.selectedYear)
  const facultiesData = useSelector(({ faculties }) => faculties.data)
  const selectedFaculty = useSelector((state) => state.faculties.selectedFaculty)
  const level = useSelector((state) => state.programmeLevel)
  const usersProgrammes = useSelector((state) => state.studyProgrammes.usersProgrammes)

  const selectedAnswers = useMemo(() => answersByYear(year, answers, oldAnswers))
  const faculties = facultiesWithKeys(facultiesData)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    setList(() => filteredProgrammes)
    document.title = `${translations['reportPage'][lang]}`
  }, [lang])

  const addToList = (programme) => {
    if (list.length == filteredProgrammes.length) {
      setList(() => ([programme]))
    } else if (!list.includes(programme)) {
      setList(() => ([...list, programme]))
    } else {
      setList(list.filter((p) => p !== programme))
    }
    setSelectAll(false)

    if (list.length < 1) {
      setSelectAll(true)
      setList(filteredProgrammes)
    }
  }

  const filteredByName = useMemo(() => {
    return usersProgrammes.filter((prog) => {
      const searchTarget = prog.name[lang] ? prog.name[lang] : prog.name['en']
      return searchTarget.toLowerCase().includes(debouncedFilter.toLowerCase())
    })
  }, [usersProgrammes, lang, debouncedFilter])

  const filteredByLevel = useMemo(() => {
    if (level === 'allProgrammes') return filteredByName
    const filtered = filteredByName.filter((p) => {
      const searched = p.name['en'].toLowerCase()
      if (level === 'master') {
        return searched.includes(level.toString())
        || searched.includes('degree programme')
        // There are 3 degree programmes included in the masters prorammes
      }
      return searched.includes(level.toString())
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

  const reportProgrammes = useMemo(() => {
    if (list.length < 1 || selectAll) return filteredProgrammes
    const listed = filteredProgrammes.filter((p) => {
      return list.includes(p)
    })

    return listed
  }, [filteredProgrammes, list, selectAll])
  
  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const toggleAll = () => {
    setSelectAll(true)
    setList(filteredProgrammes)
  }
  
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

  const answersByQuestions = () => {
    let answerMap = new Map()
    const filteredKeys = reportProgrammes.map((p) => p.key)
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

          questionData = [...questionData, { name: name, color: color, answer: answer }]
          answerMap.set(question.id, questionData)
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
          filteredProgrammes={reportProgrammes}
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
          filteredProgrammes={reportProgrammes}
          questionsList={questionsList}
        />
      </Tab.Pane> 
    },
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
          <h1>{translations.reportPage[lang]}</h1>
          <YearSelector />
          {usersProgrammes.length > 1 &&
            <>
              <FacultyFilter />
              <LevelFilter usersProgrammes={usersProgrammes}/>
              <ProgrammeFilter
                handleChange={handleChange}
                filter={filter}
                onEmpty={() => setFilter('')}
                lang={lang}
              />
            </>
          }
        </Grid.Column>
        <Grid.Column width={6}>
          <Button onClick={toggleAll}>{translations.clear[lang]}</Button>
          <Segment className="report-list-container" data-cy="report-programmes-list">
            <p className="report-programmes-header">{translations.nowShowing[lang]}</p>
            {filteredProgrammes.length > 0 ?
              <>
                {sortedItems(filteredProgrammes, 'name', lang).map((p) =>
                  reportProgrammes.includes(p) &&
                  <p
                    className="report-list-included"
                    onClick={() => addToList(p)}
                    key={p.key}
                  >
                    {p.name[lang] ? p.name[lang] : p.name['en']}
                  </p>

                )}
                <div className="ui divider" />
                <p className="report-programmes-header">{translations.chooseMore[lang]}</p>
                {sortedItems(filteredProgrammes, 'name', lang).map((p) =>
                !reportProgrammes.includes(p) &&
                (
                  <p
                    className="report-list-excluded"
                    onClick={() => addToList(p)}
                    key={p.key}
                  >
                  {p.name[lang] ? p.name[lang] : p.name['en']}
                  </p>
                )
                )}
              </>
            :
            <h4>{translations.noData[lang]}</h4>
          }
          </Segment>
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