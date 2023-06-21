import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'

const SummaryRowFaculty = ({ setStatsToShow, stats, selectedAnswers, tableIds }) => {
  const studyLevels = ['bachelor', 'master', 'doctoral']
  return (
    <>
      {tableIds.map(idObject => {
        if (idObject.id === 'transition_phase_faculty') {
          return (
            <SinglePieChart
              key={idObject.id}
              singleStat={stats[idObject.id]}
              setStatsToShow={setStatsToShow}
              selectedAnswers={selectedAnswers}
              idObject={idObject}
            />
          )
        }
        return (
          <div>
            {studyLevels.map(level => {
              const levelStats = stats[`${idObject.id}_${level}`]
              return (
                <div
                  style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                  key={`${idObject.id}_${level}`}
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
                        value: levelStats.green || 0,
                      },
                      {
                        color: '#ffffb1',
                        value: levelStats.yellow || 0,
                      },
                      {
                        color: '#ff7f7f',
                        value: levelStats.red || 0,
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
              )
            })}
          </div>
        )
      })}
    </>
  )
}

const SinglePieChart = ({ singleStat, setStatsToShow, selectedAnswers, idObject }) => {
  return (
    <div
      key={idObject.id}
      style={{ cursor: 'pointer' }}
      onClick={() =>
        setStatsToShow({
          stats: singleStat,
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
            value: singleStat.green || 0,
          },
          {
            color: '#ffffb1',
            value: singleStat.yellow || 0,
          },
          {
            color: '#ff7f7f',
            value: singleStat.red || 0,
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
  )
}

export default SummaryRowFaculty
