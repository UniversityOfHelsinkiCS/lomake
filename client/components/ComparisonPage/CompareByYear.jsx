import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import sortBy from 'lodash/sortBy'

import ProgrammeList from 'Components/Generic/ProgrammeList'
import QuestionList from 'Components/Generic/QuestionList'
import { formKeys } from '@root/config/data'
import { getLabel } from 'Utilities/common'
import Question from './Question'
import LabelOptions from './LabelOptions'
import BarChart from './BarChart'
import FilterTray from './FilterTray'
import './ComparisonPage.scss'

const checkFacultyColors = ({ questionsAnswers, chosenKeys, levels }) => {
  const questionColors = {
    green: 0,
    yellow: 0,
    red: 0,
    emptyAnswer: 0,
  }
  let checkForData = false

  questionsAnswers.forEach(a => {
    if (chosenKeys.includes(a.key)) {
      if (levels === 'allProgrammes') {
        ;['bachelor', 'master', 'doctoral'].forEach(level => {
          checkForData = true

          questionColors[a.color[level]] += 1
        })
      } else {
        checkForData = true
        questionColors[a.color[levels]] += 1
      }
    }
  })
  return { colors: questionColors, checkForData }
}

const checkProgrammeColors = ({ questionsAnswers, chosenKeys }) => {
  const questionColors = {
    green: 0,
    yellow: 0,
    red: 0,
    emptyAnswer: 0,
  }
  let checkForData = false
  questionsAnswers.forEach(a => {
    if (chosenKeys.includes(a.key)) {
      checkForData = true
      questionColors[a.color] += 1
    }
  })
  return { colors: questionColors, checkForData }
}

const getTotalColors = ({ allAnswers, multipleYears, questionsList, questions, chosenKeys, levels, form }) => {
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
          let questionColors = {}
          if (form === formKeys.EVALUATION_FACULTIES) {
            const colorsAndCheck = checkFacultyColors({ questionsAnswers, chosenKeys, yearsColors, levels })
            checkForData = colorsAndCheck.checkForData
            questionColors = colorsAndCheck.colors
          } else {
            const colorsAndCheck = checkProgrammeColors({ questionsAnswers, chosenKeys })
            checkForData = colorsAndCheck.checkForData
            questionColors = colorsAndCheck.colors
          }
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
      answers: sortBy(filteredAnswers, 'name'),
    }
  })
  return mapped
}

const CompareByYear = ({
  questionsList,
  usersProgrammes,
  allAnswers,
  programmes,
  setPicked,
  picked,
  setFilter,
  filter,
}) => {
  const { t } = useTranslation()
  const [unit, setUnit] = useState('percentage')
  const [showingQuestion, setShowingQuestion] = useState(-1)

  const filters = useSelector(state => state.filters)
  const { multipleYears, questions } = filters

  const chosenKeys = programmes.chosen.map(p => p.key || (filters.form === formKeys.EVALUATION_FACULTIES && p.code))

  const data = getTotalColors({
    allAnswers,
    multipleYears,
    questionsList,
    questions,
    chosenKeys,
    levels: filters.level,
    form: filters.form,
  })

  if (!usersProgrammes || !allAnswers) return null

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
                      ),
                  )}
                </Accordion>
              </Grid.Column>
            </Grid.Row>
          </>
        ) : (
          <h3 data-cy="report-no-data">
            {filters.form !== formKeys.EVALUATION_FACULTIES ? t('noData') : t('noDataForFaculty')}
          </h3>
        )}
      </Grid>
    </div>
  )
}

export default CompareByYear
