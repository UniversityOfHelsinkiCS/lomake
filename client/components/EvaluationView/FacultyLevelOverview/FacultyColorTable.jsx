/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import-x/no-named-as-default-member */
import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Input } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems, answersByYear } from '../../../util/common'
import { getTempAnswersAfterDeadline, getAllTempAnswersAction } from '../../../redux/tempAnswersReducer'
import { setYear } from '../../../redux/filterReducer'
import TableHeader from '../../OverviewPage/TableHeader'
import TableRow from './FacultyTableRow'
import SummaryRowFaculty from './SummaryRowFaculty'
import './OverviewPage.scss'
import { facultyEvaluationQuestions as questions } from '../../../questionData'

const FacultyColorTable = React.memo(
  ({
    setModalData,
    form,
    faculties,
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
    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')
    const [showDataByProgramme] = useState(false)

    const formDeadline = nextDeadline ? nextDeadline.find(dl => dl.form === form) : null

    const filterYear = useSelector(({ filters }) => filters.year)
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const year = filterYear || new Date().getFullYear()

    useEffect(() => {
      dispatch(setYear(year))
      if (!formDeadline) {
        dispatch(getTempAnswersAfterDeadline(form, year))
      } else {
        dispatch(getAllTempAnswersAction())
      }
    }, [nextDeadline, year])

    const selectedAnswers = answersByYear({
      year,
      tempAnswers: answers,
      oldAnswers,
      draftYear: draftYear?.year,
      deadline: nextDeadline?.find(d => d.form === form),
      form,
    })
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
        const answers = faculty?.data ?? {}
        Object.keys(answers).forEach(answerKey => {
          if (answerKey.includes('_light')) {
            const color = answers[answerKey] // "red", "yellow", "green" or ""
            const baseKey = answerKey.replace('_light', '')
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
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
        <TableHeader showStudyLevel sort={sort} tableIds={tableIds} title={t('faculty')} />
        <div className="table-container">
          <Input
            data-cy="overviewpage-filter"
            icon="search"
            onChange={handleFilterChange}
            placeholder={t('facultyFilter')}
            size="small"
            value={filterValue}
          />
        </div>
        <div />
        <SummaryRowFaculty
          selectedAnswers={selectedAnswers}
          setStatsToShow={setStatsToShow}
          showDataByProgramme={showDataByProgramme}
          stats={stats}
          tableIds={tableIds}
        />
        <div className="sticky-header" />
        {sortedFaculties.map(f => {
          return (
            <TableRow
              faculty={f}
              form={form}
              formType={formType}
              key={f.code}
              selectedAnswers={selectedAnswers}
              setModalData={setModalData}
              setProgramControlsToShow={setProgramControlsToShow}
              showDataByProgramme={showDataByProgramme}
              tableIds={tableIds}
            />
          )
        })}
      </div>
    )
  }
)

export default FacultyColorTable
