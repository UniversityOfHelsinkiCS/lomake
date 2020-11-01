import React from 'react'
import { useSelector } from 'react-redux'
import { PieChart as Chart } from 'react-minimal-pie-chart'
import { colors } from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

export default ({ question, answers, showEmpty, programmeName, programmeFaculty }) => {
  const lang = useSelector((state) => state.language)

  const colorsTotal = (question) => {
    if (!question || !answers) return null
    let colors = {
      green: 0,
      yellow: 0,
      red: 0,
      emptyAnswer: 0,
      withoutEmpty: 0,
      total: 0,
    }
    answers.forEach((a) => {
      colors[a.color] = colors[a.color] + 1
    })
    colors.withoutEmpty = colors.red + colors.green + colors.yellow
    colors.total = colors.withoutEmpty + colors.emptyAnswer
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
        value: colorSums.emptyAnswer && showEmpty ? colorSums.emptyAnswer : 0,
      },
    ]
    return data.sort((a, b) => b.value - a.value)
  }

  return (
    <div className="comparison-smiley-chart-area">
      <div className="comparison-smiley-pie-header">
        <p>
          {question.labelIndex} {question.label}
        </p>
        <p>
          <b>{programmeName}</b>
        </p>
        <p>
          <b>{programmeFaculty}</b>
        </p>
        <p>
          <b>
            {translations.responses[lang]} {showEmpty ? colorSums.total : colorSums.withoutEmpty}/1
          </b>
        </p>
      </div>
      <div className="comparison-smiley-pie-chart" data-cy={`comparison-chart-${question.id}`}>
        <Chart
          center={[72, 65]}
          data={data(question)}
          lengthAngle={360}
          lineWidth={100}
          label={({ dataEntry }) =>
            dataEntry.percentage > 0.5 ? `${Math.round(dataEntry.percentage)} %` : null
          }
          paddingAngle={0}
          radius={50}
          startAngle={270}
          viewBoxSize={[145, 145]}
          labelStyle={{ fontSize: '5px', fontWeight: 'bold' }}
          labelPosition={114}
        />
      </div>
    </div>
  )
}
