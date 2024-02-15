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

const CommitteeColorTable = React.memo(
  ({ setModalData, form, committees, formType, setProgramControlsToShow, selectedLevels }) => {
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
    let tableIds = [
      { title: 'university', levels: ['bachelor', 'master', 'doctoral'] },
      { title: 'arviointi', levels: ['bachelor', 'master', 'doctoral', 'overallHeader'] },
    ]

    if (selectedLevels) {
      const activeLevels = []
      Object.keys(selectedLevels).forEach(levelKey => {
        const levelValue = selectedLevels[levelKey]
        if (levelValue) {
          activeLevels.push(levelKey)
        }
      })

      if (activeLevels.length > 0) {
        tableIds = tableIds.map(tableId => {
          tableId.levels = activeLevels
          return tableId
        })
      }
    }
    const gridColumnSize = tableIds[0].levels.length * 2 + 1
    return (
      <div className={`overview-color-grid-committee-${gridColumnSize}`}>
        <TableHeader sort={sort} tableIds={tableIds} title={t('generic:level:committee')} />
        <div className="committee-table-header-second-level-right-padding" />
        {questions.map(theme => {
          return theme.parts.map((part, index) => {
            if (part.type === 'TITLE' || part.type === 'INFOBOX' || part.type === 'TEXTAREA_UNIVERSITY') return null
            return (
              <>
                {index === 0 && (
                  <Header
                    className={`committee-table-theme-title-${gridColumnSize}`}
                    style={{
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
                  selectedLevels={selectedLevels}
                  question={part}
                  selectedAnswers={filteredAnswers}
                  tableIds={tableIds}
                  setModalData={setModalData}
                  key={`${part.id}-${theme.title}`}
                  committee={committee}
                  formType={formType}
                  form={form}
                  setProgramControlsToShow={setProgramControlsToShow}
                  showText={gridColumnSize < 7}
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
