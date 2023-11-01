import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { useTranslation } from 'react-i18next'

const SummaryRowFaculty = ({ setStatsToShow, stats, selectedAnswers, tableIds, showDataByProgramme }) => {
  const { t } = useTranslation()
  const studyLevels = ['bachelor', 'master', 'doctoral']
  let answersCounted = {}
  if (showDataByProgramme) {
    const selectedAnswersFiltered = selectedAnswers.filter(answer => answer.form === 4)
    answersCounted = selectedAnswersFiltered.reduce(
      (acc, curr) => {
        if (!curr.data || Object.keys(curr.data).length === 0) return acc
        tableIds.forEach(({ id }) => {
          const modifiedQuestionId = id.replace('_faculty', '')
          const colorId = `${modifiedQuestionId}_light`
          const textId = `${modifiedQuestionId}_text`
          const colorAnswerData = curr.data[colorId]
          const textAnswerData = curr.data[textId]
          let currentLevel = null
          if (curr.programme.startsWith('KH')) {
            currentLevel = 'bachelor'
          } else if (curr.programme.startsWith('MH')) {
            currentLevel = 'master'
          } else if (curr.programme.startsWith('T')) {
            currentLevel = 'doctoral'
          }
          acc[currentLevel][modifiedQuestionId] = { colors: {}, text: [] }
          if (colorAnswerData) {
            acc[currentLevel][modifiedQuestionId].colors[colorAnswerData] = acc[currentLevel][modifiedQuestionId]
              .colors[colorAnswerData]
              ? acc[currentLevel][modifiedQuestionId].colors[colorAnswerData] + 1
              : 1
          }
          if (textAnswerData) {
            if (acc[currentLevel][modifiedQuestionId].text[colorAnswerData] === undefined) {
              acc[currentLevel][modifiedQuestionId].text[colorAnswerData] = [
                {
                  programme: curr.programme,
                  answer: textAnswerData,
                },
              ]
            } else {
              acc[currentLevel][modifiedQuestionId].text[colorAnswerData] = acc[currentLevel][modifiedQuestionId].text[
                colorAnswerData
              ].concat({
                programme: curr.programme,
                answer: textAnswerData,
              })
            }
          }
        })
        return acc
      },
      { bachelor: {}, master: {}, doctoral: {} },
    )
  }
  return (
    <>
      {studyLevels.map(level => {
        return (
          <React.Fragment key={level}>
            {level !== 'bachelor' ? (
              <>
                {' '}
                <div />
                <div />
                <div />
              </>
            ) : null}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p>{t(level)}</p>
            </div>
            {tableIds.map(idObject => {
              let levelStats = stats[`${idObject.id}_${level}`]

              if (showDataByProgramme) {
                const modifiedQuestionId = idObject.id.replace('_faculty', '')
                if (!answersCounted[level][modifiedQuestionId]) {
                  levelStats = { green: 0, yellow: 0, red: 0 }
                } else {
                  levelStats = answersCounted[level][modifiedQuestionId].colors
                }
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
          </React.Fragment>
        )
      })}
    </>
  )
}

export default SummaryRowFaculty
