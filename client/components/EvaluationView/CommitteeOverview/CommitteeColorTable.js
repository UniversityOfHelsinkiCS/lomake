import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { sortedItems, answersByYear } from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import TableHeader from './CommitteeTableHeader'
import TableRow from './CommitteeTableRow'
import './OverviewPage.scss'
import { universityEvaluationQuestions as questions } from '../../../questionData'
import { committeeList } from '../../../../config/data'

const CommitteeColorTable = React.memo(({ setModalData, form, committees, formType, setProgramControlsToShow }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const lang = useSelector(state => state.language)
  const year = 2023
  const [reverse, setReverse] = useState(false)
  const [sorter, setSorter] = useState('name')
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

  let filteredAnswers = selectedAnswers && selectedAnswers.find(a => a.programme === 'UNI')
  if (!filteredAnswers?.data) {
    filteredAnswers = []
  } else {
    filteredAnswers = filteredAnswers.data
  }

  const sortedCommittees = sortedItems(committees, sorter, lang)

  if (reverse) sortedCommittees.reverse()

  const sort = sortValue => {
    setSorter(sortValue === 'key' ? 'code' : sortValue)
    setReverse(!reverse)
  }

  if (answers.pending || !answers.data || !oldAnswers.data) {
    return <Loader active inline="centered" />
  }
  const tableIds = [
    { title: 'university', levels: ['bachelor', 'master', 'doctoral'] },
    { title: 'arviointi', levels: ['bachelor', 'master', 'doctoral', 'overallHeader'] },
  ]

  return (
    <div className="overview-color-grid-committee">
      <TableHeader sort={sort} tableIds={tableIds} title={t('generic:level:committee')} />
      <div />
      <div />

      <div />
      <div className="sticky-header" />
      {questions.map(theme => {
        return theme.parts.map((part, index) => {
          if (part.type === 'TITLE' || part.type === 'INFOBOX' || part.type === 'TEXTAREA_UNIVERSITY') return null
          return (
            <>
              {index === 0 && (
                <Header
                  style={{
                    gridColumn: '1/13',
                    gridRow: index,
                    textDecoration: 'underline',
                    textDecorationColor: 'khaki',
                  }}
                  key={`${theme.title}`}
                  as="h2"
                >
                  {index + 1}) {theme.title[lang]}
                </Header>
              )}
              <TableRow
                question={part}
                selectedAnswers={filteredAnswers}
                tableIds={tableIds}
                setModalData={setModalData}
                key={`${part.id}-${theme.title}`}
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
})

export default CommitteeColorTable
