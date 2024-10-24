import React, { useState } from 'react'
import { PieChart as Chart } from 'react-minimal-pie-chart'
import { Button } from 'semantic-ui-react'
import { HashLink as Link } from 'react-router-hash-link'
import { useTranslation } from 'react-i18next'
import { colors } from 'Utilities/common'
import { formKeys } from '@root/config/data'

export default ({
  question,
  answers,
  showEmpty,
  chosenProgrammes,
  faculty,
  allProgrammes,
  setActiveTab,
  setShowing,
  level = null,
  form = 1,
}) => {
  const { t } = useTranslation()
  const [toolTipData, setToolTipData] = useState(null)

  const colorsTotal = question => {
    if (!question || !answers) return null
    const colors = {
      green: { value: 0, programmes: [] },
      yellow: { value: 0, programmes: [] },
      red: { value: 0, programmes: [] },
      emptyAnswer: { value: 0, programmes: [] },
      withoutEmpty: { value: 0, programmes: [] },
      total: { value: 0 },
    }
    answers.forEach(a => {
      if (!a) return

      if (form === formKeys.EVALUATION_FACULTIES) {
        if (a.color && a.color[level] && colors[a.color[level]]) {
          colors[a.color[level]].value += 1
          colors[a.color[level]].programmes = [...colors[a.color[level]].programmes, a.name]
        } else {
          colors.emptyAnswer.value += 1
          colors.emptyAnswer.programmes = [...colors.emptyAnswer.programmes, a.name]
        }
      } else if (a.color && colors[a.color]) {
        colors[a.color].value += 1
        colors[a.color].programmes = [...colors[a.color].programmes, a.name]
      } else {
        colors.emptyAnswer.value += 1
        colors.emptyAnswer.programmes = [...colors.emptyAnswer.programmes, a.name]
      }
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
        toolTipHeader: t('positive'),
        value: colorSums.green.value || 0,
        programmes: colorSums.green.programmes,
      },
      {
        color: colors.background_yellow,
        toolTipColor: 'yellow',
        toolTipHeader: t('neutral'),
        value: colorSums.yellow.value || 0,
        programmes: colorSums.yellow.programmes,
      },
      {
        color: colors.background_red,
        toolTipColor: 'red',
        toolTipHeader: t('negative'),
        value: colorSums.red.value || 0,
        programmes: colorSums.red.programmes,
      },
      {
        color: colors.light_gray,
        toolTipColor: 'gray',
        toolTipHeader: t('EMPTY'),
        value: colorSums.emptyAnswer.value && showEmpty ? colorSums.emptyAnswer.value : 0,
        programmes: colorSums.emptyAnswer.programmes,
      },
    ]
    return data.sort((a, b) => b.value - a.value)
  }

  const amountOfResponses = () => {
    let answered = `${t('responses')} `
    if (answers) {
      answered = answered.concat(`${showEmpty ? chosenProgrammes.length : colorSums.withoutEmpty.value}`)
    } else {
      answered = answered.concat('0')
    }
    const all = allProgrammes ? ` / ${allProgrammes.length}` : ''
    return answered + all
  }

  const toolTipText = segmentIndex => {
    if (!segmentIndex) {
      setToolTipData(null)
    }
    const segmentData = data()[segmentIndex]
    const toolTip = {
      color: segmentData.toolTipColor,
      header: segmentData.toolTipHeader,
      programmes: segmentData.programmes.sort((a, b) => a.localeCompare(b)),
    }
    setToolTipData(toolTip)
  }

  const showWritten = id => {
    setShowing(id)
    setActiveTab(0)
  }
  const configs =
    form === formKeys.EVALUATION_FACULTIES
      ? { secondLabel: `overview:uniAnswerLevels:${level}` }
      : { secondLabel: faculty }
  return (
    <div style={{ width: '400px', paddingBottom: '300px' }} key={`${chosenProgrammes}-${answers}-${showEmpty}`}>
      <div>
        <p>
          {question.labelIndex}. {question.label.toUpperCase()}
        </p>
        <p>
          <b>{t(configs.secondLabel)}</b>
        </p>
        <p>
          <b>{amountOfResponses()}</b>
        </p>
        <p>
          <Link to={`/report#${question.labelIndex}`} onClick={() => showWritten(question.id)}>
            {t('report:clickToCheck')}
          </Link>
        </p>
      </div>
      <div data-cy={`report-chart-${question.id}`} style={{ maxHeight: '150px' }}>
        {toolTipData && (
          <span>
            <p>
              <b>
                {question.labelIndex} - {question.label}
              </b>
              <Button color="red" size="mini" onClick={() => setToolTipData(null)}>
                <b>X</b>
              </Button>
            </p>
            <p>
              <b>
                <span className={`answer-circle-${toolTipData.color}`} /> {toolTipData.header}
              </b>
            </p>
            {toolTipData.programmes.map(p => (
              <p key={`${p}-${level}`}>{p}</p>
            ))}
          </span>
        )}
        <div>
          <Chart
            key={`${chosenProgrammes}-${answers}-${showEmpty}-${level}-${toolTipData}`}
            data={data()}
            lengthAngle={360}
            lineWidth={100}
            label={({ dataEntry }) => (dataEntry.percentage > 0.5 ? `${Math.round(dataEntry.percentage)} %` : null)}
            paddingAngle={0}
            radius={40}
            startAngle={270}
            labelStyle={{ fontSize: '5px', fontWeight: 'bold' }}
            labelPosition={80}
            onClick={(e, segmentIndex) => toolTipText(segmentIndex)}
          />
        </div>
      </div>
    </div>
  )
}
