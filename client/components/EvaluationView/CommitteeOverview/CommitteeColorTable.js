import React, { useEffect, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Loader, Header } from 'semantic-ui-react'

import { answersByYear, getYearToShow } from 'Utilities/common'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import TableHeader from './CommitteeTableHeader'
import TableRow from './CommitteeTableRow'
import './OverviewPage.scss'
import { universityEvaluationQuestions as questions } from '../../../questionData'
import { committeeList } from '../../../../config/data'
import { getAnswersActionAll } from 'Utilities/redux/oldAnswersReducer'

const CommitteeColorTable = React.memo(({ setModalData, form, formType, setProgramControlsToShow, selectedLevels }) => {
  const dispatch = useDispatch()
  const { nextDeadline, draftYear } = useSelector(state => state.deadlines)
  const answers = useSelector(state => state.tempAnswers)
  const oldAnswers = useSelector(state => state.oldAnswers)
  const lang = useSelector(state => state.language)
  const committee = committeeList[0]

  const year = getYearToShow({ draftYear, nextDeadline, form })

  useEffect(() => {
    if (nextDeadline) {
      dispatch(getAllTempAnswersAction())
    } else {
      dispatch(getAnswersActionAll())
    }
  }, [])
  const selectedAnswers = answersByYear({
    year,
    tempAnswers: answers,
    oldAnswers,
    draftYear: draftYear && draftYear.year,
    deadline: nextDeadline?.find(d => d.form === form),
    form,
  })

  let languageVersionOfTheForm = 'UNI'

  if (lang === 'en') {
    languageVersionOfTheForm = 'UNI_EN'
  } else if (lang === 'se') {
    languageVersionOfTheForm = 'UNI_SE'
  }
  let filteredAnswers = selectedAnswers && selectedAnswers.find(a => a.programme === languageVersionOfTheForm)
  const finnishFormForTrafficLights = selectedAnswers && selectedAnswers.find(a => a.programme === 'UNI')?.data
  if (!filteredAnswers?.data) {
    filteredAnswers = []
  } else {
    filteredAnswers = filteredAnswers.data
  }
  if (answers.pending || !answers.data || !oldAnswers.data || !finnishFormForTrafficLights) {
    return <Loader active inline="centered" />
  }
  let tableIds = [
    { title: 'university', levels: ['master', 'doctoral'] },
    { title: 'arviointi', levels: ['master', 'doctoral'] },
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
      <TableHeader tableIds={tableIds} />
      <div className="committee-table-header-second-level-right-padding" />
      {questions.map((theme, indexTopLevel) => {
        return theme.parts.map((part, index) => {
          if (
            part.type === 'TITLE' ||
            part.type === 'INFOBOX' ||
            (part.type === 'TEXTAREA_UNIVERSITY' && theme.title.fi !== 'ARVIOINTIRYHMÄN YLEISET HAVAINNOT JA PALAUTE')
          ) {
            return null
          }
          return (
            <Fragment key={`${part.id}-${theme.title}`}>
              {index === 0 && (
                <Header
                  className={`committee-table-theme-title-${gridColumnSize}`}
                  style={{
                    gridRow: index,
                  }}
                  key={`${theme.title}`}
                  as="h2"
                >
                  {indexTopLevel + 1}) {theme.title[lang]}
                </Header>
              )}
              <TableRow
                selectedLevels={selectedLevels}
                question={part}
                selectedAnswers={filteredAnswers}
                tableIds={tableIds}
                setModalData={setModalData}
                committee={committee}
                formType={formType}
                form={form}
                setProgramControlsToShow={setProgramControlsToShow}
                gridColumnSize={gridColumnSize}
                finnishFormForTrafficLights={finnishFormForTrafficLights}
              />
            </Fragment>
          )
        })
      })}
    </div>
  )
})

export default CommitteeColorTable
