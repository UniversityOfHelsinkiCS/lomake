import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import BarChart from './BarChart'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import ProgrammeList from '../ReportPage/ProgrammeList'
import QuestionList from './QuestionList'
import YearSelector from 'Components/Generic/YearSelector'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import { internationalProgrammes as international, doctoralSchools } from 'Utilities/common'
import './ComparisonPage.scss'


const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
  const [showEmpty, setShowEmpty] = useState(true)
  const [questions, setQuestions] = useState([])
  const [picked, setPicked] = useState([])
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector((state) => state.language)
  const years = useSelector(({ filters }) => filters.multipleYears)
  const { faculty, level, companion, doctoralSchool } = useSelector((state) => state.filters)

  if (!usersProgrammes || !allAnswers) return <></>

  const questionLabels = () => {
    return questionsList.map((q) => q.label.charAt(0) + q.label.slice(1).toLowerCase()) 
  }

  useEffect(() => {
    setQuestions(questionLabels())
  }, [])

  const filteredProgrammes = () => {
    if (!usersProgrammes) return { chosen: [], all: [] }

    const filteredByName = usersProgrammes.filter((p) => {
      const prog = p.name[lang] ? p.name[lang] : p.name['en']
      return prog.toLowerCase().includes(debouncedFilter.toLowerCase())
    })

    const filteredByLevel = filteredByName.filter((p) => {
      if (level === 'allProgrammes') return true
      const prog = p.name['en'].toLowerCase()
      if (level === 'international') {
        return international.includes(p.key)
      }
      if (level === 'master') {
        return prog.includes('master') || prog.includes('degree programme')
      }
      return prog.includes(level.toString())
    })

    const filteredByFaculty = filteredByLevel.filter((p) => {
      if (faculty === 'allFaculties') return true
      if (companion) {
        const companionFaculties = p.companionFaculties.map((f) => f.code)
        if (companionFaculties.includes(faculty)) return true
        else return p.primaryFaculty.code === faculty
      }
      return p.primaryFaculty.code === faculty
    })

    const filteredBySchool = filteredByFaculty.filter((p) => {
      if (doctoralSchool === 'allSchools') return true
      return doctoralSchools[doctoralSchool].includes(p.key)
    })

    const filteredByPick = filteredBySchool.filter((p) => {
      return picked.includes(p)
    })

    return { chosen: filteredByPick, all: filteredBySchool }
  }

  const programmes = filteredProgrammes()

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    const chosenKeys = programmes.chosen.map((p) => p.key)
    allAnswers.forEach((rawData) => {
      if (years.includes(rawData.year)) {
        let yearsColors = { green: [], yellow: [], red: [], emptyAnswer: [] }
        rawData.answers.forEach((answerSet, key) => {
          const questionWithColor = questionsList.find((q) => q.id === key)
          if (questionWithColor && questions.includes(questionWithColor.label.charAt(0) + questionWithColor.label.slice(1).toLowerCase())) {
            let colors = {
              green: 0,
              yellow: 0,
              red: 0,
              emptyAnswer: 0,
            }  
            answerSet.forEach((a) => {
              if (chosenKeys.includes(a.key)) {
                colors[a.color] = colors[a.color] + 1
              } 
            })
            yearsColors.green = [...yearsColors.green, colors.green]
            yearsColors.yellow = [...yearsColors.yellow, colors.yellow]
            yearsColors.red = [...yearsColors.red, colors.red]
            yearsColors.emptyAnswer = [...yearsColors.emptyAnswer, colors.emptyAnswer]
          }
        })
        total = [...total,
          { year: rawData.year, name: 'positive', color: 'green', data: yearsColors.green },
          { year: rawData.year, name: 'neutral', color: 'yellow', data: yearsColors.yellow },
          { year: rawData.year, name: 'negative', color: 'red', data: yearsColors.red },
        ]
        if (showEmpty) {
          total = [...total, { year: rawData.year, name: 'emptyAnswer', color: 'gray', data: yearsColors.emptyAnswer }]
        }
      }
    })
    return total
  }
  const colorSums = colorsTotal()
  
  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  return (
    <div className="comparison-container">
      <Grid>
        <Grid.Column className="comparison-center-header" width={16}>
          {translations.reportHeader['byYear'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid doubling columns={2} padded="vertically" className="report-filter-container">
        <Grid.Column width={10}>
          <YearSelector
            multiple 
            size="small"
            label={translations.selectYears[lang]} 
          />
          {usersProgrammes && usersProgrammes.length > 5 && (
            <>
              <FacultyFilter
                size="small"
                label={translations.facultyFilter.filter[lang]}
              />
              <LevelFilter />
              {faculty !== 'allFaculties' &&
                (level === 'doctor'
                  || level === 'master'
                  || level === 'bachelor'
                ) && (
                  <CompanionFilter />
                )}
              {faculty === 'allFaculties'
                && level === 'doctor'
                && <DoctoralSchoolFilter />
              }
              <ProgrammeFilter
                handleChange={handleSearch}
                filter={filter}
                onEmpty={() => setFilter('')}
                lang={lang}
              />
            </>
          )}
        </Grid.Column>
        <Grid.Column width={6}>
          <ProgrammeList
            programmes={programmes}
            setPicked={setPicked}
            picked={picked}
          />
        </Grid.Column>
      </Grid>
      <Grid>
        <Grid.Row>
          <Grid.Column width={16}>
            <BarChart colorSums={colorSums} questions={questions} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={12}>
            <QuestionList 
              questions={questionLabels()}
              picked={questions}
              setPicked={setQuestions}
            /> 
          </Grid.Column>
          <Grid.Column width={4}>
            <Radio
              checked={showEmpty}
              onChange={() => setShowEmpty(!showEmpty)}
              label={translations.emptyAnswers[lang]}
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default CompareByYear