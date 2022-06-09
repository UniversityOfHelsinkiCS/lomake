import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'

const SummaryRow = ({ setStatsToShow, stats, selectedAnswers, tableIds }) => {
  return (
    <>
      {tableIds.map(idObject =>
        stats.hasOwnProperty(idObject.id) ? (
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
    </>
  )
}

export default SummaryRow
