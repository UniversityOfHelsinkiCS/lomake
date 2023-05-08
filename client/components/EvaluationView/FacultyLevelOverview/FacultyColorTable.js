import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Input } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems } from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import TableHeader from '../../OverviewPage/TableHeader'
import TableRow from './FacultyTableRow'
import SummaryRow from '../../OverviewPage/SummaryRow'
import './OverviewPage.scss'
import { facultyEvaluationQuestions as questions } from '../../../questionData'

const FacultyColorTable = React.memo(
  ({ setModalData, form, faculties, formType, setStatsToShow, handleFilterChange, filterValue }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const draftYear = useSelector(state => state.deadlines.draftYear)
    const answers = useSelector(state => state.tempAnswers)
    const oldAnswers = useSelector(state => state.oldAnswers)
    const lang = useSelector(state => state.language)
    // const year = 2023
    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')

    useEffect(() => {
      dispatch(getAllTempAnswersAction())
    }, [])

    const selectedAnswers = []
    // const selectedAnswers = answersByYear({
    //   year,
    //   tempAnswers: answers,
    //   oldAnswers,
    //   draftYear: draftYear && draftYear.year,
    // })

    const sortedFaculties = sortedItems(faculties, sorter, lang)

    if (reverse) sortedFaculties.reverse()

    const sort = sortValue => {
      setSorter(sortValue === 'key' ? 'code' : sortValue)
      setReverse(!reverse)
    }

    const stats = useMemo(() => {
      if (!selectedAnswers) return {}

      return sortedFaculties.reduce((statObject, { code }) => {
        const faculty = selectedAnswers.find(a => a.programme === code && a.form === form)
        const answers = faculty && faculty.data ? faculty.data : {}

        Object.keys(answers).forEach(answerKey => {
          if (answerKey.includes('_light')) {
            const color = answers[answerKey] // "red", "yellow", "green" or ""
            const baseKey = answerKey.replace('_light', '')
            if (!statObject[baseKey]) statObject[baseKey] = {}

            statObject[baseKey][color] = statObject[baseKey][color] ? statObject[baseKey][color] + 1 : 1
          }
        })
        return statObject
      }, {})
    }, [sortedFaculties, selectedAnswers, answers, draftYear])

    if (answers.pending || !answers.data || !oldAnswers.data) {
      return <Loader active inline="centered" />
    }

    const tableIds = questions.reduce((acc, cur) => {
      const questionObjects = cur.parts.reduce((acc, cur) => {
        if (
          cur.id.includes('opinion_differences') ||
          cur.id.includes('programme_strengths') ||
          cur.type === 'TITLE' ||
          cur.type === 'INFOBOX' ||
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

    return (
      <div className="overview-color-grid-faculty">
        <TableHeader sort={sort} tableIds={tableIds} title={t('faculty')} />
        <div className="table-container">
          <Input
            data-cy="overviewpage-filter"
            icon="filter"
            size="small"
            placeholder={t('facultyFilter')}
            onChange={handleFilterChange}
            value={filterValue}
          />
        </div>
        <div />
        <SummaryRow
          setStatsToShow={setStatsToShow}
          stats={stats}
          selectedAnswers={selectedAnswers}
          tableIds={tableIds}
        />
        <div className="sticky-header" />
        {sortedFaculties.map(f => {
          return (
            <TableRow
              faculty={f}
              selectedAnswers={selectedAnswers}
              tableIds={tableIds}
              setModalData={setModalData}
              setProgramControlsToShow={null}
              key={f.code}
              formType={formType}
              form={form}
            />
          )
        })}
      </div>
    )
  }
)

export default FacultyColorTable
