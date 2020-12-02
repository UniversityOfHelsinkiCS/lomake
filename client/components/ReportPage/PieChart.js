import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { PieChart as Chart } from 'react-minimal-pie-chart'
import { HashLink as Link } from 'react-router-hash-link'
import { reportPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'

export default ({ question, answers, showEmpty, chosenProgrammes, faculty, allProgrammes, setActiveTab, setShowing }) => {
  const lang = useSelector((state) => state.language)
  const [toolTipData, setToolTipData] = useState(null)

  const colorsTotal = (question) => {
    if (!question || !answers) return null
    let colors = {
      green: { value: 0, programmes: [] },
      yellow: { value: 0, programmes: [] },
      red: { value: 0, programmes: [] },
      emptyAnswer: { value: 0, programmes: [] },
      withoutEmpty: { value: 0, programmes: [] },
      total: { value: 0 },
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
        toolTipColor: 'green',
        toolTipHeader: translations.positive[lang],
        value: colorSums.green.value || 0,
        programmes: colorSums.green.programmes,
      },
      {
        color: colors.background_yellow,
        toolTipColor: 'yellow',
        toolTipHeader: translations.neutral[lang],
        value: colorSums.yellow.value || 0,
        programmes: colorSums.yellow.programmes,
      },
      {
        color: colors.background_red,
        toolTipColor: 'red',
        toolTipHeader: translations.negative[lang],
        value: colorSums.red.value || 0,
        programmes: colorSums.red.programmes,
      },
      {
        color: colors.light_gray,
        toolTipColor: 'gray',
        toolTipHeader: translations.empty[lang],
        value: colorSums.emptyAnswer.value && showEmpty ? colorSums.emptyAnswer.value : 0,
        programmes: colorSums.emptyAnswer.programmes,
      },
    ]
    return data.sort((a, b) => b.value - a.value)
  }

  const amountOfResponses = () => {
    const answered = `${translations.responses[lang]} ${
      answers ? (showEmpty ? chosenProgrammes.length : colorSums.withoutEmpty.value) : 0
    }`
    const all = allProgrammes ? ` / ${allProgrammes.length}` : ''
    return answered + all
  }

  const toolTipText = (segmentIndex) => {
    const segmentData = data()[segmentIndex]
    const toolTip = {
      color: segmentData.toolTipColor,
      header: segmentData.toolTipHeader,
      programmes: segmentData.programmes.sort((a, b) => a.localeCompare(b)),
    }
    setToolTipData(toolTip)
  }

  const showWritten = (id) => {
    setShowing(id)
    setActiveTab(0)
  }

  return (
    <div className="report-color-chart-area">
      <div className="report-color-pie-header">
        <p>
          {question.labelIndex} {question.label}
        </p>
        <p>
          <b>{faculty}</b>
        </p>
        <p>
          <b>{amountOfResponses()}</b>
        </p>
        <p>
          <Link
            to={`/report#${question.labelIndex}`}
            onClick={() => showWritten(question.id)}
          >
            {translations.clickToCheck[lang]}
          </Link>
        </p>
      </div>
      <div className="report-color-pie-chart" data-cy={`report-chart-${question.id}`}>
        {toolTipData && (
          <span className="report-color-pie-tip">
            <p>
              <b>
                {question.labelIndex} - {question.label}
              </b>
            </p>
            <p>
              <b>
                <span className={`answer-circle-${toolTipData.color}`} /> {toolTipData.header}
              </b>
            </p>
            {toolTipData.programmes.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </span>
        )}
        <Chart
          center={[72, 65]}
          data={data()}
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
          labelPosition={112}
          onMouseOver={(e, segmentIndex) => toolTipText(segmentIndex)}
          onMouseOut={() => setToolTipData(null)}
        />
      </div>
    </div>
  )
}
