import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { useTranslation } from 'react-i18next'

const SummaryRowFaculty = ({ setStatsToShow, stats, selectedAnswers, tableIds }) => {
  const { t } = useTranslation()
  const studyLevels = ['bachelor', 'master', 'doctoral']
  return (
    <>
      {studyLevels.map(level => {
        return (
          <>
            {level !== 'bachelor' ? (
              <>
                {' '}
                <div />
                <div />
                <div />
              </>
            ) : null}
            <p style={{ margin: '0' }}>{t(level)}</p>
            {tableIds.map(idObject => {
              let levelStats = stats[`${idObject.id}_${level}`]
              if (idObject.id === 'transition_phase_faculty') {
                levelStats = stats[idObject.id]
              }
              return (
                <div
                  key={`${idObject.id}_${level}`}
                  style={{ maxHeight: '5em' }}
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
                        value: levelStats?.green || 0,
                      },
                      {
                        color: '#ffffb1',
                        value: levelStats?.yellow || 0,
                      },
                      {
                        color: '#ff7f7f',
                        value: levelStats?.red || 0,
                      },
                    ]}
                    labelPosition={50}
                    lengthAngle={360}
                    lineWidth={100}
                    paddingAngle={0}
                    radius={35}
                    startAngle={0}
                    viewBoxSize={[100, 100]}
                  />
                </div>
              )
            })}
          </>
        )
      })}
    </>
  )
}

export default SummaryRowFaculty
