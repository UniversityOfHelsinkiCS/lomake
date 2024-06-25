import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Input, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { isAdmin } from '@root/config/common'
import { answersByYear, sortedItems, reversedPointsInDegreeReform } from 'Utilities/common'
import { getProgrammeOwners } from 'Utilities/redux/studyProgrammesReducer'
import { getAllTempAnswersAction, getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { formKeys } from '@root/config/data'
import TableHeader from './TableHeader'
import TableRow from './TableRow'
import SummaryRow from './SummaryRow'
import './OverviewPage.scss'
import {
  yearlyQuestions as questions,
  evaluationQuestions,
  degreeReformIndividualQuestions,
  metareviewQuestions,
} from '../../questionData'

const answerValues = ['first', 'second', 'third', 'fourth', 'fifth']
const answerValuesReversed = ['fifth', 'fourth', 'third', 'second', 'first']

const getSortedProgrammes = (sortedProgrammes, selectedAnswers, form) => {
  return sortedProgrammes.reduce((statObject, { key }) => {
    const programme = selectedAnswers.find(a => a.programme === key && a.form === form)
    const answers = programme && programme.data ? programme.data : {}
    Object.keys(answers).forEach(answerKey => {
      if (answerKey.includes('_light')) {
        const color = answers[answerKey] // "red", "yellow", "green" or ""
        const baseKey = answerKey.replace('_light', '')
        if (!statObject[baseKey]) statObject[baseKey] = {}

        statObject[baseKey][color] = statObject[baseKey][color] ? statObject[baseKey][color] + 1 : 1
      } else if (!answerKey.includes('_text')) {
        const baseKey = answerKey
        if (!statObject[baseKey]) statObject[baseKey] = {}
        let answerNumber = answers[baseKey]

        if (reversedPointsInDegreeReform.includes(answerKey)) {
          if (answerNumber === 'idk') {
            answerNumber = 'idk'
          } else {
            const indexOfAnswerNumber = answerValues.indexOf(answerNumber)
            answerNumber = answerValuesReversed[indexOfAnswerNumber]
          }
        }

        statObject[baseKey][answerNumber] = statObject[baseKey][answerNumber]
          ? statObject[baseKey][answerNumber] + 1
          : 1
      }
    })
    return statObject
  }, {})
}

const getIndividualAnswers = selectedAnswers => {
  return selectedAnswers.reduce((statObject, { data }) => {
    Object.keys(data).forEach(answerKey => {
      if (answerKey.includes('_light')) {
        const color = data[answerKey] // "red", "yellow", "green" or ""
        const baseKey = answerKey.replace('_light', '')
        if (!statObject[baseKey]) statObject[baseKey] = {}

        statObject[baseKey][color] = statObject[baseKey][color] ? statObject[baseKey][color] + 1 : 1
      } else if (!answerKey.includes('_text')) {
        const baseKey = answerKey
        if (!statObject[baseKey]) statObject[baseKey] = {}
        let answerNumber = data[baseKey]

        if (reversedPointsInDegreeReform.includes(answerKey)) {
          if (answerNumber === 'idk') {
            answerNumber = 'idk'
          } else {
            const indexOfAnswerNumber = answerValues.indexOf(answerNumber)
            answerNumber = answerValuesReversed[indexOfAnswerNumber]
          }
        }
        statObject[baseKey][answerNumber] = statObject[baseKey][answerNumber]
          ? statObject[baseKey][answerNumber] + 1
          : 1
      }
    })
    return statObject
  }, {})
}

const ColorTable = React.memo(
  ({
    setModalData,
    filteredProgrammes,
    facultyProgrammes,
    setProgramControlsToShow,
    setStatsToShow,
    isBeingFiltered,
    filterValue,
    handleFilterChange,
    form,
    formType,
    showAllProgrammes,
    handleShowProgrammes,
    individualAnswers,
    facultyView,
    dropdownFilter,
  }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const answers = useSelector(state => state.tempAnswers)
    const oldAnswers = useSelector(state => state.oldAnswers)
    const lang = useSelector(state => state.language)

    const currentUser = useSelector(({ currentUser }) => currentUser.data)
    const programmeOwners = useSelector(state => state.studyProgrammes.programmeOwners)
    const year = useSelector(({ filters }) => filters.year)
    const { nextDeadline, draftYear } = useSelector(state => state.deadlines)

    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')

    useEffect(() => {
      if ((form === formKeys.EVALUATION_PROGRAMMES && year) || (form === 7 && year)) {
        dispatch(getTempAnswersByFormAndYear(form, year))
      } else {
        dispatch(getAllTempAnswersAction())
      }
      if (isAdmin(currentUser)) dispatch(getProgrammeOwners())
    }, [])

    useEffect(() => {
      if (facultyView) {
        setSorter('key')
      }
    }, [facultyView])

    const selectedAnswers = answersByYear({
      year,
      tempAnswers: answers,
      oldAnswers,
      draftYear: draftYear && draftYear.year,
      deadline: nextDeadline?.find(d => d.form === form),
      form,
    })

    const sortedAllProgrammes = sortedItems(filteredProgrammes, sorter, lang)
    const sortedFacultyProgrammes = sortedItems(facultyProgrammes, sorter, lang)
    if (reverse) sortedAllProgrammes.reverse()

    const sort = sortValue => {
      setSorter(sortValue)
      setReverse(!reverse)
    }

    let questionsToShow = questions

    if (formType === 'evaluation') {
      questionsToShow = evaluationQuestions
    } else if (formType === 'degree-reform') {
      const degreeReformQuestions = degreeReformIndividualQuestions.filter(q => q.id !== 0)

      questionsToShow = degreeReformQuestions
    } else if (formType === 'meta-evaluation') {
      questionsToShow = metareviewQuestions.filter(a => a.level === 'kandimaisteri')
    } else if (formType === 'meta-doctoral') {
      questionsToShow = metareviewQuestions.filter(a => a.level === 'tohtori')
    }
    let tableIds = null

    const generateKey = label => {
      return `${label}_${new Date().getTime()}`
    }

    if (formType === 'degree-reform') {
      tableIds = questionsToShow.reduce((acc, cur) => {
        return [
          ...acc,
          {
            id: `${generateKey(cur.title[lang])}`,
            shortLabel: cur.title[lang],
            type: 'TITLE',
            acual_id: cur.id,
          },
        ]
      }, [])
    } else {
      tableIds = questionsToShow.reduce((acc, cur) => {
        const questionObjects = cur.parts.reduce((acc, cur) => {
          if (
            cur.id.includes('information_needed') ||
            cur.id.includes('information_used') ||
            cur.id.includes('opinion_differences') ||
            cur.id.includes('programme_strengths') ||
            cur.type === 'TITLE' ||
            cur.type === 'INFOBOX' ||
            cur.type === 'SELECTION' ||
            cur.type === 'ORDER' ||
            cur.type === 'ACTIONS'
          ) {
            return acc
          }
          return [
            ...acc,
            { id: cur.id, shortLabel: cur.shortLabel[lang], type: cur.no_color ? 'ENTITY_NOLIGHT' : cur.type },
          ]
        }, [])

        return [...acc, ...questionObjects]
      }, [])
    }
    const overallStats = useMemo(() => {
      if (!selectedAnswers) return {}
      return getSortedProgrammes(sortedAllProgrammes, selectedAnswers, form)
    }, [sortedAllProgrammes, selectedAnswers, answers, isBeingFiltered, draftYear])

    const facultyStats = useMemo(() => {
      if (!selectedAnswers) return {}
      return getSortedProgrammes(sortedFacultyProgrammes, selectedAnswers, form)
    }, [sortedFacultyProgrammes, selectedAnswers, answers, isBeingFiltered, draftYear])

    const individualStats = useMemo(() => {
      if (!individualAnswers) return {}
      return getIndividualAnswers(individualAnswers)
    }, [facultyProgrammes, selectedAnswers, individualAnswers, isBeingFiltered, draftYear])

    if (answers.pending || !answers.data || !oldAnswers.data || (isAdmin(currentUser) && !programmeOwners))
      return <Loader active inline="centered" />

    const isUniFacultyView = facultyView && facultyView === 'UNI'
    const isUniFacultyViewFiltered = isUniFacultyView && dropdownFilter.length > 0

    let tableClassName = ''
    if (formType === 'evaluation') {
      tableClassName = '-evaluation'
    } else if (formType === 'meta-evaluation') {
      tableClassName = '-meta-evaluation'
    } else if (formType === 'meta-doctoral') {
      tableClassName = '-meta-doctoral'
    } else if (formType === 'degree-reform') {
      if (!facultyView) {
        tableClassName = '-degree-reform'
      } else {
        tableClassName = '-degree-reform-no-filter'
      }
    }

    let individualAvgText = t('generic:individualAvg')

    if (isUniFacultyView) {
      if (dropdownFilter.length === 0) {
        individualAvgText = t('generic:individualAvgUni')
      } else {
        individualAvgText = t('generic:individualAvgUniSelected')
      }
    }

    const selectorLabel = facultyView ? t('showAllFacultyProgrammes') : t('showAllProgrammes')
    return (
      <>
        {!isUniFacultyView || !isAdmin(currentUser) ? (
          <div className="table-container-degree-reform-button" style={{ paddingTop: 20 }}>
            <Radio
              style={{ marginRight: 'auto', marginBottom: '2em' }}
              data-cy="overviewpage-filter-button"
              toggle
              onChange={handleShowProgrammes}
              checked={showAllProgrammes}
              label={selectorLabel}
            />
          </div>
        ) : null}
        <div className={`overview-color-grid${tableClassName}`}>
          <TableHeader sort={sort} tableIds={tableIds} />
          {facultyView ? (
            <>
              <div className="table-container" style={{ paddingTop: 20 }}>
                {individualAvgText}
              </div>
              <div className="table-container" style={{ paddingTop: 20 }}>
                <p>
                  {individualAnswers?.length} {t('overview:pcs')}
                </p>
              </div>
              <SummaryRow
                setStatsToShow={setStatsToShow}
                stats={individualStats}
                selectedAnswers={selectedAnswers}
                tableIds={tableIds}
                form={form}
              />
              <div />
              <div className="table-container" style={{ paddingTop: 20 }}>
                {t('generic:universityAvg')}
              </div>
              <div />
              <SummaryRow
                setStatsToShow={setStatsToShow}
                stats={overallStats}
                selectedAnswers={selectedAnswers}
                tableIds={tableIds}
                form={form}
              />
              {(isUniFacultyViewFiltered || !isUniFacultyView) && (
                <>
                  <div />
                  <div className="table-container" style={{ paddingTop: 20 }}>
                    {isUniFacultyViewFiltered ? t('generic:chosenFacultyAvg') : t('generic:facultyAvg')}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="table-container">
              {!facultyView && (
                <Input
                  style={{ marginBottom: '0.5em' }}
                  data-cy="overviewpage-filter"
                  icon="filter"
                  size="small"
                  placeholder={t('programmeFilter')}
                  onChange={handleFilterChange}
                  value={filterValue}
                />
              )}
            </div>
          )}

          {(!isUniFacultyView || isUniFacultyViewFiltered) && (
            <>
              {' '}
              <div />
              <SummaryRow
                setStatsToShow={setStatsToShow}
                stats={facultyView ? facultyStats : overallStats}
                selectedAnswers={selectedAnswers}
                tableIds={tableIds}
                form={form}
              />
            </>
          )}
          <div className="sticky-header" style={{ marginTop: '1em' }} />
          {!showAllProgrammes && facultyView
            ? sortedFacultyProgrammes.map(p => {
                return (
                  <TableRow
                    p={p}
                    selectedAnswers={selectedAnswers}
                    tableIds={tableIds}
                    setModalData={setModalData}
                    setProgramControlsToShow={setProgramControlsToShow}
                    key={p.key}
                    formType={formType}
                    form={form}
                  />
                )
              })
            : sortedAllProgrammes.map(p => {
                return (
                  <TableRow
                    p={p}
                    selectedAnswers={selectedAnswers}
                    tableIds={tableIds}
                    setModalData={setModalData}
                    setProgramControlsToShow={setProgramControlsToShow}
                    key={p.key}
                    formType={formType}
                    form={form}
                  />
                )
              })}
        </div>
      </>
    )
  },
)

export default ColorTable
