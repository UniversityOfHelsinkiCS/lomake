import React, { useState } from 'react'
import { PieChart as Chart } from 'react-minimal-pie-chart'
import { translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'


const PieChart = ({
  question,
  lang,
  answers,
  showEmpty,
  chosenProgrammes
}) => {
  const [accordionData, setAccordionData] = useState(null)

  const colorsTotal = (question) => {
    if (!question || !answers) return null
    let colors = { 
      green : { 'value' : 0, 'programmes': [] },
      yellow : { 'value' : 0, 'programmes': [] },
      red : { 'value' : 0, 'programmes': [] },
      emptyAnswer : { 'value' : 0, 'programmes': [] },
      withoutEmpty : { 'value' : 0, 'programmes': [] },
      total: { 'value': 0 }
    }
    answers.forEach((a) => {
      colors[a.color]['value'] = colors[a.color]['value'] + 1
      colors[a.color]['programmes'] = [...colors[a.color]['programmes'], a.name]
    })
    colors.withoutEmpty.value = colors.red.value + colors.green.value + colors.yellow.value
    colors.total.value = colors.withoutEmpty.value + colors.emptyAnswer.value
    return colors
  }

  const colorSums = colorsTotal(question)

  const data = () => {
    const data = [
      {
        color: colors.background_green,
        value: colorSums.green.value || 0,
        programmes: colorSums.green.programmes,
      },
      {
        color: colors.background_yellow,
        value: colorSums.yellow.value || 0,
        programmes: colorSums.yellow.programmes,
      },
      {
        color: colors.background_red,
        value: colorSums.red.value || 0,
        programmes: colorSums.red.programmes,
      },
      {
        color: colors.light_gray,
        value: colorSums.emptyAnswer.value && showEmpty ? colorSums.emptyAnswer.value : 0,
        programmes: colorSums.emptyAnswer.programmes,

      },
    ]
    return data.sort((a,b) => b.value - a.value)
  }

  if (colorSums.total == 0) return <></>

  return (
    <div className="report-smiley-chart-area">
      <div className="report-smiley-pie-header">
        <p>{question.labelIndex} {question.label}</p>
        <p>{translations.responses[lang]} {answers ?
            (showEmpty ? chosenProgrammes.length : colorSums.withoutEmpty.value) : 0}
          </p>
      </div>
      <div
        className="report-smiley-pie-chart"
        data-cy={`report-chart-${question.id}`}
      >
        {accordionData && 
          <span className="report-smiley-pie-tip"> 
            {accordionData.map((p) => <p key={p}>{p}</p>)}
          </span>
        }
        <Chart
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
          onMouseOver={(e, segmentIndex) =>setAccordionData(data(question)[segmentIndex]['programmes'])}
          onMouseOut={() =>setAccordionData(null)}
       />
      </div>
    </div>
  )
}

export default PieChart