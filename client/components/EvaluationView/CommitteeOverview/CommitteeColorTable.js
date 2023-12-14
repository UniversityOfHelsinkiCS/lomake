import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Input } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems, answersByYear } from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import TableHeader from '../../OverviewPage/TableHeader'
import TableRow from './CommitteeTableRow'
import './OverviewPage.scss'
import { universityEvaluationQuestions as questions } from '../../../questionData'
import SummaryRowCommittee from './SummaryRowCommittee'

const CommitteeColorTable = React.memo(
  ({
    setModalData,
    form,
    committees,
    formType,
    setStatsToShow,
    handleFilterChange,
    filterValue,
    setProgramControlsToShow,
  }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
    const answers = useSelector(state => state.tempAnswers)
    const oldAnswers = useSelector(state => state.oldAnswers)
    const lang = useSelector(state => state.language)
    const faculties = useSelector(state => state.faculties)
    const year = 2023
    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')
    const [showDataByProgramme] = useState(false)

    useEffect(() => {
      dispatch(getAllTempAnswersAction())
    }, [])

    const selectedAnswers = answersByYear({
      year,
      tempAnswers: answers,
      oldAnswers,
      draftYear: draftYear && draftYear.year,
      deadline: nextDeadline?.find(d => d.form === form),
    })

    const sortedCommittees = sortedItems(committees, sorter, lang)

    if (reverse) sortedCommittees.reverse()

    const sort = sortValue => {
      setSorter(sortValue === 'key' ? 'code' : sortValue)
      setReverse(!reverse)
    }

    const stats = useMemo(() => {
      if (!selectedAnswers) return {}

      return faculties.data.reduce((statObject, { code }) => {
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
    }, [selectedAnswers, answers, draftYear])
    if (answers.pending || !answers.data || !oldAnswers.data) {
      return <Loader active inline="centered" />
    }
    const tableIds = questions
      .reduce((acc, cur) => {
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
            {
              id: cur.id,
              shortLabel: cur.shortLabel && cur.shortLabel[lang],
              type: cur.no_color ? 'ENTITY_NOLIGHT' : cur.type,
            },
          ]
        }, [])

        return [...acc, ...questionObjects]
      }, [])
      .filter(t => !t.id.includes('tone'))

    return (
      <div className="overview-color-grid-committee">
        <TableHeader sort={sort} tableIds={tableIds} title={t('generic:level:committee')} showStudyLevel />
        <div className="table-container">
          <Input
            data-cy="overviewpage-filter"
            icon="filter"
            size="small"
            placeholder={t('committeeFilter')}
            onChange={handleFilterChange}
            value={filterValue}
          />
        </div>
        <div />
        <SummaryRowCommittee
          setStatsToShow={setStatsToShow}
          stats={stats}
          selectedAnswers={selectedAnswers}
          tableIds={tableIds}
          showDataByProgramme={showDataByProgramme}
        />
        <div className="sticky-header" />
        {sortedCommittees.map(f => {
          return (
            <TableRow
              faculty={f}
              selectedAnswers={selectedAnswers}
              tableIds={tableIds}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              key={f.code}
              formType={formType}
              form={form}
              showDataByProgramme={showDataByProgramme}
            />
          )
        })}
      </div>
    )
  },
)

export default CommitteeColorTable
