import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems, answersByYear } from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import TableHeader from '../../OverviewPage/TableHeader'
import TableRow from './CommitteeTableRow'
import './OverviewPage.scss'
import { universityEvaluationQuestions as questions } from '../../../questionData'
import SummaryRowCommittee from './SummaryRowCommittee'
import { committeeList } from '../../../../config/data'

const CommitteeColorTable = React.memo(
  ({ setModalData, form, committees, formType, setStatsToShow, setProgramControlsToShow }) => {
    const { t } = useTranslation()
    const dispatch = useDispatch()
    const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
    const answers = useSelector(state => state.tempAnswers)
    const oldAnswers = useSelector(state => state.oldAnswers)
    const lang = useSelector(state => state.language)
    const year = 2023
    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')
    const [showDataByProgramme] = useState(false)
    const committee = committeeList[0]

    useEffect(() => {
      dispatch(getAllTempAnswersAction())
    }, [])
    const selectedAnswers = answersByYear({
      year,
      tempAnswers: answers,
      oldAnswers,
      draftYear: draftYear && draftYear.year,
      deadline: nextDeadline?.find(d => d.form === form),
      form,
    })

    const sortedCommittees = sortedItems(committees, sorter, lang)

    if (reverse) sortedCommittees.reverse()

    const sort = sortValue => {
      setSorter(sortValue === 'key' ? 'code' : sortValue)
      setReverse(!reverse)
    }

    const stats = useMemo(() => {
      if (!selectedAnswers) return {}

      const faculty = selectedAnswers.find(a => a.programme === 'UNI' && a.form === form)
      const answers = faculty && faculty.data ? faculty.data : {}
      const statObject = {}
      Object.keys(answers).forEach(answerKey => {
        if (answerKey.includes('_light')) {
          const color = answers[answerKey] // "red", "yellow", "green" or ""
          const baseKey = answerKey.replace('_light', '')
          if (!statObject[baseKey]) statObject[baseKey] = {}

          statObject[baseKey][color] = statObject[baseKey][color] ? statObject[baseKey][color] + 1 : 1
        }
      })
      return statObject
    }, [selectedAnswers, answers, draftYear])

    if (answers.pending || !answers.data || !oldAnswers.data) {
      return <Loader active inline="centered" />
    }
    const tableIds = questions.reduce((acc, cur) => {
      const questionObjects = cur.parts.reduce((acc, cur) => {
        if (
          cur.id.includes('opinion_differences') ||
          cur.id.includes('programme_strengths') ||
          cur.id.includes('same_tone') ||
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

    return (
      <div className="overview-color-grid-committee">
        <TableHeader sort={sort} tableIds={tableIds} title={t('generic:level:committee')} showStudyLevel />
        <div />
        <div />
        <SummaryRowCommittee
          setStatsToShow={setStatsToShow}
          stats={stats}
          selectedAnswers={selectedAnswers}
          tableIds={tableIds}
          showDataByProgramme={showDataByProgramme}
        />
        <div className="sticky-header" />
        {questions.map(theme => {
          return theme.parts.map((part, index) => {
            if (part.type === 'TITLE' || part.type === 'INFOBOX' || part.type === 'TEXTAREA_UNIVERSITY') return null
            return (
              <>
                {index === 0 && (
                  <Header
                    style={{
                      gridColumn: '1/20',
                      gridRow: index,
                      textDecoration: 'underline',
                      textDecorationColor: 'khaki',
                    }}
                    as="h2"
                  >
                    {index + 1}) {theme.title[lang]}
                  </Header>
                )}
                <TableRow
                  question={part}
                  selectedAnswers={selectedAnswers}
                  tableIds={tableIds}
                  setModalData={setModalData}
                  key={part.id}
                  committee={committee}
                  formType={formType}
                  form={form}
                  setProgramControlsToShow={setProgramControlsToShow}
                />
              </>
            )
          })
        })}
      </div>
    )
  },
)

export default CommitteeColorTable
