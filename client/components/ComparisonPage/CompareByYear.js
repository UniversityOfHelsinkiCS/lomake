import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import * as _ from 'lodash'
import BarChart from './BarChart'
import CompanionFilter from 'Components/Generic/CompanionFilter'
import DoctoralSchoolFilter from 'Components/Generic/DoctoralSchoolFilter'
import FacultyFilter from 'Components/Generic/FacultyFilter'
import ProgrammeFilter from 'Components/Generic/ProgrammeFilter'
import LevelFilter from 'Components/Generic/LevelFilter'
import ProgrammeList from 'Components/Generic/ProgrammeList'
import YearSelector from 'Components/Generic/YearSelector'
import LabelOptions from './LabelOptions'
import Question from './Question'
import QuestionList from './QuestionList'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import useDebounce from 'Utilities/useDebounce'
import { filteredProgrammes } from 'Utilities/common'
import './ComparisonPage.scss'

const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
  const [unit, setUnit] = useState('percentage')
  const [showingQuestion, setShowingQuestion] = useState(-1)
  const [picked, setPicked] = useState([])
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector((state) => state.language)
  const filters = useSelector((state) => state.filters)
  const { faculty, level, multipleYears, questions } = filters

  if (!usersProgrammes || !allAnswers) return <></>

  useEffect(() => {
    setPicked(programmes.all)
  }, [])

  const programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)

  const chosenKeys = programmes.chosen.map((p) => p.key)

  const getLabel = (question) => {
    if (!question) return ''
    const label = _.capitalize(question.label)
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${label}`
  } 

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    let checkForData = false
    allAnswers.forEach((data) => {
      if (multipleYears.includes(data.year)) {
        let yearsColors = { 
          green: [],
          yellow: [],
          red: [],
          emptyAnswer: []
        }
        data.answers.forEach((questionsAnswers, key) => {
          const question = questionsList.find((q) => q.id === key)
          const questionLabel = getLabel(question)
          if (questions && questions.includes(questionLabel)) {
            let questionColors = { 
              green: 0,
              yellow: 0,
              red: 0,
              emptyAnswer: 0
            }
            questionsAnswers.forEach((a) => {
              if (chosenKeys.includes(a.key)) {
                checkForData = true
                questionColors[a.color] = questionColors[a.color] + 1
              }
            })
            for (const [color] of Object.entries(yearsColors)) {
              yearsColors[color] = [...yearsColors[color], questionColors[color]]
            }
          }
        })

        total = [
          ...total,
          { year: data.year, name: 'positive', color: 'green', data: yearsColors.green },
          { year: data.year, name: 'neutral', color: 'yellow', data: yearsColors.yellow },
          { year: data.year, name: 'negative', color: 'red', data: yearsColors.red },
          { year: data.year, name: 'empty', color: 'gray', data: yearsColors.emptyAnswer },
        ]
      }
    })

    if (checkForData) return total
    return []
  }

  const data = colorsTotal()

  const handleSearch = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  const writtenTotal = (question) => {
    const mapped = allAnswers.map((data) => {
      const answers = data.answers.get(question.id)
      const filteredAnswers = answers ? answers.filter((a) => chosenKeys.includes(a.key) && a.answer) : []
      return {
        year: data.year,
        answers: _.sortBy(filteredAnswers, 'name'),
      }
    })
    return mapped
  }

  return (
    <div className="comparison-tab-pane">
      <Grid doubling columns={2} padded>
        <Grid.Row>
          <Grid.Column width={10}>
            <YearSelector multiple size="small" label={translations.selectYears[lang]} />
            {usersProgrammes && (
              <>
                <FacultyFilter size="small" label={translations.facultyFilter.filter[lang]} />
                <LevelFilter />
                {faculty !== 'allFaculties' &&
                  (level === 'doctor' || level === 'master' || level === 'bachelor') && (
                    <CompanionFilter />
                  )}
                {faculty === 'allFaculties' && level === 'doctor' && <DoctoralSchoolFilter />}
                <ProgrammeFilter
                  handleChange={handleSearch}
                  filter={filter}
                  onEmpty={() => setFilter('')}
                  lang={lang}
                />
              </>
            )}
            <QuestionList
              label={translations.selectQuestions[lang]}
              questionsList={questionsList}
            />
            <LabelOptions unit={unit} setUnit={setUnit} />
          </Grid.Column>
          <Grid.Column width={6}>
            <ProgrammeList programmes={programmes} setPicked={setPicked} picked={picked} />
          </Grid.Column>
        </Grid.Row>
        {data.length > 0 ? (
          <>
            <Grid.Row>
              <Grid.Column width={16}>
                <BarChart data={data} questions={questions.sort((a,b) => a.localeCompare(b))} unit={unit} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>{translations.writtenAnswers[lang]}</h3>
                <div className="ui divider" />
                <Accordion fluid className="report-container">
                  {questionsList.map(
                    (question) =>
                      questions.includes(getLabel(question)) && (
                        <Question
                          key={question.id}
                          answers={writtenTotal(question)}
                          question={question}
                          chosenProgrammes={programmes.chosen.map((p) => p.key)}
                          showing={showingQuestion === question.id}
                          handleClick={() =>
                            setShowingQuestion(showingQuestion === question.id ? -1 : question.id)
                          }
                        />
                      )
                  )}
                </Accordion>
              </Grid.Column>
            </Grid.Row>
          </>
        ) : (
          <h3 data-cy="report-no-data">{translations.noData[lang]}</h3>
        )}
      </Grid>
    </div>
  )
}

export default CompareByYear
