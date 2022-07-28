import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import * as _ from 'lodash'

import ProgrammeList from 'Components/Generic/ProgrammeList'
import QuestionList from 'Components/Generic/QuestionList'
import useDebounce from 'Utilities/useDebounce'
import { filteredProgrammes } from 'Utilities/common'
import Question from './Question'
import LabelOptions from './LabelOptions'
import BarChart from './BarChart'
import FilterTray from './FilterTray'
import './ComparisonPage.scss'

const getLabel = question => {
  if (!question) return ''
  const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
  return `${index}${question.label}`
}

const getTotalColors = ({ allAnswers, multipleYears, questionsList, questions, chosenKeys }) => {
  if (!allAnswers) return null
  let total = []
  let checkForData = false
  allAnswers.forEach(data => {
    if (multipleYears.includes(data.year)) {
      const yearsColors = {
        green: [],
        yellow: [],
        red: [],
        emptyAnswer: [],
      }
      data.answers.forEach((questionsAnswers, key) => {
        const question = questionsList.find(q => q.id === key)
        const questionLabel = getLabel(question)
        if (questions && questions.selected.includes(questionLabel)) {
          const questionColors = {
            green: 0,
            yellow: 0,
            red: 0,
            emptyAnswer: 0,
          }
          questionsAnswers.forEach(a => {
            if (chosenKeys.includes(a.key)) {
              checkForData = true
              questionColors[a.color] += 1
            }
          })
          Object.keys(yearsColors).forEach(key => {
            yearsColors[key] = [...yearsColors[key], questionColors[key]]
          })
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

const getTotalWritten = ({ question, allAnswers, chosenKeys }) => {
  const mapped = allAnswers.map(data => {
    const answers = data.answers.get(question.id)
    const filteredAnswers = answers ? answers.filter(a => chosenKeys.includes(a.key) && a.answer) : []
    return {
      year: data.year,
      answers: _.sortBy(filteredAnswers, 'name'),
    }
  })
  return mapped
}

const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
  const { t } = useTranslation()
  const [unit, setUnit] = useState('percentage')
  const [showingQuestion, setShowingQuestion] = useState(-1)
  const [picked, setPicked] = useState([])
  const [filter, setFilter] = useState('')
  const debouncedFilter = useDebounce(filter, 200)
  const lang = useSelector(state => state.language)
  const filters = useSelector(state => state.filters)
  const { multipleYears, questions } = filters

  const programmes = filteredProgrammes(lang, usersProgrammes, picked, debouncedFilter, filters)

  const chosenKeys = programmes.chosen.map(p => p.key)

  const data = getTotalColors({ allAnswers, multipleYears, questionsList, questions, chosenKeys })

  if (!usersProgrammes || !allAnswers) return <></>

  return (
    <div className="tab-pane">
      <Grid doubling columns={2} padded>
        <Grid.Row>
          <Grid.Column width={10}>
            <FilterTray filter={filter} setFilter={setFilter} />
            <QuestionList label={t('comparison:selectQuestions')} questionsList={questionsList} onlyColoredQuestions />
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
                <BarChart data={data} questions={questions.selected.sort((a, b) => a.localeCompare(b))} unit={unit} />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <h3>{t('comparison:writtenAnswers')}</h3>
                <div className="ui divider" />
                <Accordion fluid className="comparison-container">
                  {questionsList.map(
                    question =>
                      questions.selected.includes(getLabel(question)) && (
                        <Question
                          key={question.id}
                          answers={getTotalWritten({ question, allAnswers, chosenKeys })}
                          question={question}
                          chosenProgrammes={programmes.chosen.map(p => p.key)}
                          showing={showingQuestion === question.id}
                          handleClick={() => setShowingQuestion(showingQuestion === question.id ? -1 : question.id)}
                        />
                      )
                  )}
                </Accordion>
              </Grid.Column>
            </Grid.Row>
          </>
        ) : (
          <h3 data-cy="report-no-data">{t('noData')}</h3>
        )}
      </Grid>
    </div>
  )
}

export default CompareByYear
