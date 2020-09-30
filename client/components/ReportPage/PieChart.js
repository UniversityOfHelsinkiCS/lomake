import React from 'react'
import { PieChart as Chart } from 'react-minimal-pie-chart'
import { translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'


const PieChart = ({ question, lang, answers, showEmptyAnswers }) => {

  const colorsTotal = (question) => {
    if (!question || !answers) return null

    let colors = {'green' : 0, 'yellow': 0, 'red': 0, 'emptyAnswer': 0, 'total': 0}
    answers.forEach((q) => {
      colors[q.color] = colors[q.color] + 1
      if (showEmptyAnswers) colors.total = colors.total + 1
      else if (!showEmptyAnswers && q.color !== 'emptyAnswer') colors.total = colors.total + 1
    })

    return colors  
  }

  const colorSums = colorsTotal(question)

  const data = () => {
    const data = [
      {
        color: colors.background_green,
        value: colorSums.green || 0,
      },
      {
        color: colors.background_yellow,
        value: colorSums.yellow || 0,
      },
      {
        color: colors.background_red,
        value: colorSums.red || 0,
      },
      {
        color: colors.light_gray,
        value: colorSums.emptyAnswer && showEmptyAnswers ? colorSums.emptyAnswer : 0,
      },
    ]
    return data.sort((a,b) => b.value - a.value)
  }

  if (colorSums.total == 0) return <></>

  return (
    <div className="report-smiley-chart-area">
      <div className="report-smiley-pie-header">
        <p>{question.labelIndex} {question.label}</p>
        <p>{translations.responses[lang]} {answers ? colorSums.total : 0}</p>
      </div>
      <div className="report-smiley-pie-chart">
        <Chart
          animationDuration={500}
          animationEasing="ease-out"
          center={[72, 65]}
          data={data(question)}
          lengthAngle={360}
          lineWidth={100}
          label={({ dataEntry }) => dataEntry.percentage > 0.5 ? `${Math.round(dataEntry.percentage)} %` : null}
          paddingAngle={0}
          radius={50}
          startAngle={270}
          viewBoxSize={[145, 145]}
          labelStyle={{ fontSize: '5px', fontWeight: 'bold'}}
          labelPosition={112}
        />
      </div>
    </div>
  )

}

export default PieChart