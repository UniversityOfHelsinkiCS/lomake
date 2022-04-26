import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Button, Icon, Loader, Input } from 'semantic-ui-react'

import { isAdmin } from '@root/config/common'
import { answersByYear, sortedItems } from 'Utilities/common'
import { getProgrammeOwners } from 'Utilities/redux/studyProgrammesReducer'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { PieChart } from 'react-minimal-pie-chart'
import { overviewPageTranslations as translations } from 'Utilities/translations'
import questions from '../../questions.json'
import './ColorTable.scss'
import ColorTableCell from './ColorTableCell'

const ColorTable = React.memo(
  ({
    setModalData,
    filteredProgrammes,
    setProgramControlsToShow,
    setStatsToShow,
    isBeingFiltered,
    filterValue,
    handleFilterChange,
  }) => {
    const dispatch = useDispatch()
    const draftYear = useSelector(state => state.deadlines.draftYear)
    const answers = useSelector(state => state.tempAnswers)
    const oldAnswers = useSelector(state => state.oldAnswers)
    const lang = useSelector(state => state.language)
    const currentUser = useSelector(({ currentUser }) => currentUser.data)
    const programmeOwners = useSelector(state => state.studyProgrammes.programmeOwners)
    const year = useSelector(({ filters }) => filters.year)
    const [reverse, setReverse] = useState(false)
    const [sorter, setSorter] = useState('name')

    useEffect(() => {
      dispatch(getAllTempAnswersAction())
      if (isAdmin(currentUser)) dispatch(getProgrammeOwners())
    }, [])

    const selectedAnswers = answersByYear({
      year,
      tempAnswers: answers,
      oldAnswers,
      draftYear: draftYear && draftYear.year,
    })

    const lastYearsAnswers =
      oldAnswers && oldAnswers.years && oldAnswers.years.includes(year - 1)
        ? oldAnswers.data.filter(a => a.year === year - 1)
        : null

    const sortedProgrammes = sortedItems(filteredProgrammes, sorter, lang)

    if (reverse) sortedProgrammes.reverse()

    const sort = sortValue => {
      setSorter(sortValue)
      setReverse(!reverse)
    }

    const stats = useMemo(() => {
      if (!selectedAnswers) return {}

      return sortedProgrammes.reduce((statObject, { key }) => {
        const programme = selectedAnswers.find(a => a.programme === key)
        const answers = programme && programme.data ? programme.data : {}

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
    }, [sortedProgrammes, selectedAnswers, answers, isBeingFiltered, draftYear])

    const transformIdToTitle = (shortLabel, vertical = true) => {
      return <span style={vertical ? { writingMode: 'vertical-lr' } : {}}>{shortLabel}</span>
    }

    if (answers.pending || !answers.data || !oldAnswers.data || (isAdmin(currentUser) && !programmeOwners))
      return <Loader active inline="centered" />

    const hasManagementAccess = program => {
      if (isAdmin(currentUser)) return true
      return Object.entries(currentUser.access).find(access => access[0] === program && access[1].admin === true)
    }

    const ManageCell = ({ program }) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Button
          data-cy={`${program.key}-manage`}
          icon="user"
          circular
          onClick={() => setProgramControlsToShow(program)}
        />
      </div>
    )

    const tableIds = questions.reduce((acc, cur) => {
      const questionObjects = cur.parts.reduce((acc, cur) => {
        if (cur.id.includes('information_needed') || cur.id.includes('information_used') || cur.type === 'TITLE') {
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
      <div className="color-grid">
        <div className="sticky-header">
          <div style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => sort('name')}>
            {translations.programmeNameHeader[lang]}
            <Icon name="sort" />
          </div>
        </div>
        <div className="sticky-header">
          <div style={{ fontWeight: 'bold', cursor: 'pointer' }} onClick={() => sort('key')}>
            {translations.programmeCodeHeader[lang]}
            <Icon name="sort" />
          </div>
        </div>
        {tableIds.map(idObject => (
          <div
            key={idObject.id}
            className="sticky-header"
            style={{
              wordWrap: 'break-word',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            {transformIdToTitle(idObject.shortLabel)}
          </div>
        ))}
        <div className="sticky-header" />

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            data-cy="overviewpage-filter"
            icon="filter"
            size="small"
            placeholder={translations.filter[lang]}
            onChange={handleFilterChange}
            value={filterValue}
          />
        </div>
        <div />
        {tableIds.map(idObject =>
          stats.hasOwnProperty(idObject.id) ? (
            <div
              key={idObject.id}
              style={{ cursor: 'pointer' }}
              onClick={() =>
                setStatsToShow({
                  stats: stats[idObject.id],
                  title: transformIdToTitle(idObject.shortLabel, false),
                  answers: selectedAnswers,
                  questionId: idObject.id,
                })
              }
            >
              <PieChart
                animationDuration={500}
                animationEasing="ease-out"
                center={[50, 50]}
                data={[
                  {
                    color: '#9dff9d',
                    value: stats[idObject.id].green || 0,
                  },
                  {
                    color: '#ffffb1',
                    value: stats[idObject.id].yellow || 0,
                  },
                  {
                    color: '#ff7f7f',
                    value: stats[idObject.id].red || 0,
                  },
                ]}
                labelPosition={50}
                lengthAngle={360}
                lineWidth={100}
                paddingAngle={0}
                radius={50}
                startAngle={0}
                viewBoxSize={[100, 100]}
              />
            </div>
          ) : (
            <div key={idObject.id} />
          )
        )}
        <div className="sticky-header" />
        {sortedProgrammes.map(p => {
          const programme = selectedAnswers.find(a => a.programme === p.key)
          const programmeLastYear = lastYearsAnswers ? lastYearsAnswers.find(a => a.programme === p.key) : null
          const targetURL = `/form/${p.key}`
          return (
            <React.Fragment key={p.key}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link data-cy={`colortable-link-to-${p.key}`} to={targetURL}>
                  {p.name[lang]}
                </Link>
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Link data-cy={`colortable-link-to-${p.key}`} to={targetURL}>
                  {p.key}
                </Link>
              </div>
              {tableIds.map(idObject => (
                <ColorTableCell
                  key={`${p.key}-${idObject.id}`}
                  programmesName={p.name[lang]}
                  programmesKey={p.key}
                  programmesAnswers={programme && programme.data ? programme.data : {}}
                  programmesOldAnswers={programmeLastYear && programmeLastYear.data ? programmeLastYear.data : null}
                  questionId={idObject.id}
                  questionType={idObject.type}
                  setModalData={setModalData}
                />
              ))}
              {hasManagementAccess(p.key) ? <ManageCell program={p} /> : <div />}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)

export default ColorTable
