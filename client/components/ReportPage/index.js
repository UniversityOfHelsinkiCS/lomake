import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, Segment, Tab } from 'semantic-ui-react'
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
  const faculty = useSelector((state) => state.faculties.selectedFaculty)
  const level = useSelector((state) => state.programmeLevel)
  const usersProgrammes = useSelector((state) => state.studyProgrammes.usersProgrammes)
  const selectedAnswers = useMemo(() => answersByYear(year, answers, oldAnswers))
  const faculties = facultiesWithKeys(facultiesData)


  if (!usersProgrammes) return null

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
    setList(() => programmes.filtered)
    document.title = `${translations['reportPage'][lang]}`
  }, [lang])

  const programmes = useMemo(() => {

    const filteredByName = () => {
      return usersProgrammes.filter((p) => {
        const prog = p.name[lang] ? p.name[lang] : p.name['en']
        return prog.toLowerCase().includes(debouncedFilter.toLowerCase())
      })
    }
  
    const filteredByLevel = () => {
      if (level === 'allProgrammes') return filteredByName()
  
      const filtered = filteredByName().filter((p) => {
        const prog = p.name['en'].toLowerCase()
        if (level === 'master') {
          return prog.includes('master') || prog.includes('degree programme')
        }
        return prog.includes(level.toString())
      })
  
      return filtered
    }
  
    const filteredByFaculty = () => {
      if (faculty === 'allFaculties') return filteredByLevel()
      const filtered = filteredByLevel().filter((p) => faculties.get(p.key) === faculty)
      
      return filtered
    }

    const filteredByPick = () => {
      if (list.length < 1 || selectAll) {
        return { chosen: filteredByFaculty(), filtered: filteredByFaculty() }
      }
      const chosen = filteredByFaculty().filter((p) => list.includes(p))

      return { chosen : chosen, filtered: filteredByFaculty() }
    }

    return filteredByPick()
  }, [usersProgrammes, list, selectAll, level, lang, faculty, debouncedFilter])
  

  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const toggleAll = () => {
    setSelectAll(true)
    setList(programmes.filtered)
  }

  const addToList = (programme) => {
    if (list.length == programmes.filtered.length) {
      setList(() => ([programme]))
    } else if (!list.includes(programme)) {
      setList(() => ([...list, programme]))
    } else {
      setList(list.filter((p) => p !== programme))
    }
    setSelectAll(false)

    if (list.length < 1) {
      setSelectAll(true)
      setList(programmes.filtered)
    }
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
    const chosenKeys = programmes.chosen.map((p) => p.key)
    selectedAnswers.forEach((programme) => {
      if (chosenKeys.includes(programme.programme)) {
        const data = programme.data
        questionsList.forEach((question) => {
          let answersByProgramme = answerMap.get(question.id) ? answerMap.get(question.id) : []
          let color = data[question.color] ? data[question.color] : 'emptyAnswer'
          const name = programmeName(usersProgrammes, programme, lang)
          
          let answer = ''
          if (question.id === "measures_text") answer = getMeasuresAnswer(data)
          else if (!question.id.startsWith("meta")) answer = cleanText(data[question.id])

          answersByProgramme = [...answersByProgramme, { name: name, color: color, answer: answer }]
          answerMap.set(question.id, answersByProgramme)
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
          chosenProgrammes={programmes.chosen}
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
          chosenProgrammes={programmes.chosen}
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
                handleChange={handleSearch}
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
            {programmes.filtered.length > 0 ?
              <>
                {sortedItems(programmes.filtered, 'name', lang).map((p) =>
                  programmes.chosen.includes(p) &&
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
                {sortedItems(programmes.filtered, 'name', lang).map((p) =>
                  !programmes.chosen.includes(p) &&
                    <p
                      className="report-list-excluded"
                      onClick={() => addToList(p)}
                      key={p.key}
                    >
                    {p.name[lang] ? p.name[lang] : p.name['en']}
                    </p>
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