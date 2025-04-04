import React from 'react'
import { useSelector } from 'react-redux'
import { PieChart } from 'react-minimal-pie-chart'
import { degreeReformBackgroundColor } from '../../util/common'
import { formKeys } from '../../../config/data'
import { degreeReformIndividualQuestions } from '../../questionData'

const DegreeReformPieChart = ({ stats, tableIds, setStatsToShow, selectedAnswers }) => {
  const lang = useSelector(state => state.language)
  return (
    <>
      {tableIds.map(idObject => {
        let themeSum = 0
        let themeCount = 0
        const themeQuestions = []
        degreeReformIndividualQuestions[idObject.acual_id].parts.forEach(part => {
          if (part.id.includes('view_is_based_on')) return false
          let byQuestionSum = 0
          let byQuestionCount = 0
          if (stats[part.id]) {
            if (stats[part.id].first) {
              themeSum += 1 * stats[part.id].first
              themeCount += stats[part.id].first

              byQuestionSum += stats[part.id].first
              byQuestionCount += stats[part.id].first
            }

            if (stats[part.id].second) {
              themeSum += 2 * stats[part.id].second
              themeCount += stats[part.id].second

              byQuestionSum += 2 * stats[part.id].second
              byQuestionCount += stats[part.id].second
            }
            if (stats[part.id].third) {
              themeSum += 3 * stats[part.id].third
              themeCount += stats[part.id].third

              byQuestionSum += 3 * stats[part.id].third
              byQuestionCount += stats[part.id].third
            }
            if (stats[part.id].fourth) {
              themeSum += 4 * stats[part.id].fourth
              themeCount += stats[part.id].fourth

              byQuestionSum += 4 * stats[part.id].fourth
              byQuestionCount += stats[part.id].fourth
            }
            if (stats[part.id].fifth) {
              themeSum += 5 * stats[part.id].fifth
              themeCount += stats[part.id].fifth

              byQuestionSum += 5 * stats[part.id].fifth
              byQuestionCount += stats[part.id].fifth
            }
            const averageByQuestion = byQuestionCount > 0 ? (byQuestionSum / byQuestionCount).toFixed(1) : ''
            themeQuestions.push({ label: part.label[lang], average: averageByQuestion, reversed: part.reversed })

            return true
          }
          return false
        })
        const averageByTheme = themeCount > 0 ? (themeSum / themeCount).toFixed(1) : ''
        const background = degreeReformBackgroundColor(averageByTheme)

        return tableIds.find(tableId => tableId.acual_id === idObject.acual_id) ? (
          <div
            key={idObject.id}
            style={{ cursor: 'pointer', background }}
            className="square"
            onClick={() =>
              setStatsToShow({
                stats: stats[idObject.id],
                title: <span>{idObject.shortLabel}</span>, // transformIdToTitle(idObject.shortLabel, false),
                answers: selectedAnswers,
                questionId: idObject.id,
                themeQuestions,
              })
            }
          >
            {themeCount > 0 ? averageByTheme : null}
          </div>
        ) : (
          <div key={idObject.id} />
        )
      })}
    </>
  )
}

const SummaryRow = ({ setStatsToShow, stats, selectedAnswers, tableIds, form }) => {
  if (form === formKeys.DEGREE_REFORM_PROGRAMMES) {
    return (
      <DegreeReformPieChart
        stats={stats}
        setStatsToShow={setStatsToShow}
        selectedAnswers={selectedAnswers}
        tableIds={tableIds}
      />
    )
  }
  return (
    <>
      {tableIds.map(idObject => {
        return Object.prototype.hasOwnProperty.call(stats, idObject.id) ? (
          <div
            key={idObject.id}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              setStatsToShow({
                stats: stats[idObject.id],
                title: <span>{idObject.shortLabel}</span>, // transformIdToTitle(idObject.shortLabel, false),
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
                {
                  color: '#808080',
                  value: stats[idObject.id].gray || 0,
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
      })}
    </>
  )
}

export default SummaryRow
