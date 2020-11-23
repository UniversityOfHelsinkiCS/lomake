import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import BarChart from './BarChart'
import ColorLegend from 'Components/Generic/ColorLegend'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import ProgrammeList from '../ReportPage/ProgrammeList'
import LabelOptions from './LabelOptions'
import QuestionList from './QuestionList'
import YearSelector from 'Components/Generic/YearSelector'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import { filteredProgrammes } from 'Utilities/common'
import './ComparisonPage.scss'

const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
  const [unit, setUnit] = useState('programmeAmount')
  const [showEmpty, setShowEmpty] = useState(true)
  const [questions, setQuestions] = useState([])
  const [picked, setPicked] = useState([])
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector((state) => state.language)
  const filters = useSelector((state) => state.filters)
  const { faculty, level, multipleYears } = filters

  if (!usersProgrammes || !allAnswers) return <></>

  const questionLabels = () => {
    return questionsList.map((q) => q.label.charAt(0) + q.label.slice(1).toLowerCase())
  }

  useEffect(() => {
    setQuestions(questionLabels())
    setPicked(programmes.all)
  }, [])

  const programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    const chosenKeys = programmes.chosen.map((p) => p.key)
    allAnswers.forEach((yearsAnswers) => {
      if (multipleYears.includes(yearsAnswers.year)) {
        let yearsColors = { green: [], yellow: [], red: [], emptyAnswer: [] }
        yearsAnswers.answers.forEach((answerSet, key) => {
          const question = questionsList.find((q) => q.id === key)
          const label = question ? question.label.charAt(0) + question.label.slice(1).toLowerCase() : ''
          if (questions.includes(label)) {
            let questionColors = {
              green: 0,
              yellow: 0,
              red: 0,
              emptyAnswer: 0,
            }
            answerSet.forEach((answer) => {
              if (chosenKeys.includes(answer.key)) {
                questionColors[answer.color] = questionColors[answer.color] + 1
              }
            })
            yearsColors.green = [...yearsColors.green, questionColors.green]
            yearsColors.yellow = [...yearsColors.yellow, questionColors.yellow]
            yearsColors.red = [...yearsColors.red, questionColors.red]
            yearsColors.emptyAnswer = [...yearsColors.emptyAnswer, questionColors.emptyAnswer]
          }
        })
        total = [
          ...total,
          { year: yearsAnswers.year, name: 'positive', color: 'green', data: yearsColors.green },
          { year: yearsAnswers.year, name: 'neutral', color: 'yellow', data: yearsColors.yellow },
          { year: yearsAnswers.year, name: 'negative', color: 'red', data: yearsColors.red },
        ]
        if (showEmpty) {
          total = [
            ...total,
            {
              year: yearsAnswers.year,
              name: 'emptyAnswer',
              color: 'gray',
              data: yearsColors.emptyAnswer,
            },
          ]
        }
      }
    })
    return total
  }

  const data = colorsTotal()

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
      <Grid doubling columns={2} padded>
        <Grid.Row>
          <Grid.Column width={10}>
            <YearSelector
              multiple size="small"
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
                  (level === 'doctor' || level === 'master' || level === 'bachelor') && (
                    <CompanionFilter />
                  )}
                {faculty === 'allFaculties' && 
                  level === 'doctor' && 
                  <DoctoralSchoolFilter />}
                <ProgrammeFilter
                  handleChange={handleSearch}
                  filter={filter}
                  onEmpty={() => setFilter('')}
                  lang={lang}
                />
                <Radio
                  className="empty-toggle"
                  checked={showEmpty}
                  onChange={() => setShowEmpty(!showEmpty)}
                  label={translations.emptyAnswers[lang]}
                  toggle
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
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <BarChart
              data={data}
              questions={questions}
              unit={unit}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="comparison-chart-settings-row">
          <Grid.Column>
            <LabelOptions 
              unit={unit}
              setUnit={setUnit}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="comparison-questions-row">
          <Grid.Column width={11}>
            <QuestionList
              questionLabels={questionLabels()}
              questions={questions}
              setQuestions={setQuestions}
            />
          </Grid.Column>
          <Grid.Column width={5}>
            <ColorLegend />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default CompareByYear
