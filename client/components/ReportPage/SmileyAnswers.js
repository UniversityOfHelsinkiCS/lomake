import React, { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { Icon, Grid, Popup, Radio } from 'semantic-ui-react'
import { colors } from 'Utilities/common'
import { translations } from 'Utilities/translations'
import './SmileyAnswers.scss'


const SmileyAnswers = ({ 
  allAnswers,
  questionsList,
  filteredProgrammes,
  lang,
  year,
  level
}) => {
  const [showEmptyAnswers, setShowEmptyAnswers] = useState(true)

  const colorsTotal = (question) => {
    if (!question || !allAnswers.get(question.id)) return 0
    let colors = {'green' : 0, 'yellow': 0, 'red': 0, 'emptyAnswer': 0, 'total': 0}
    allAnswers.get(question.id).forEach((q) => {
      colors[q.color] = colors[q.color] + 1
      if (showEmptyAnswers) colors.total = colors.total + 1
      else if (!showEmptyAnswers && q.color !== 'emptyAnswer') colors.total = colors.total + 1
    })

    return colors  
  }

  const data = (question) => {
    const total = colorsTotal(question)
    const data = [
      {
        color: colors.background_green,
        value: total.green || 0,
      },
      {
        color: colors.background_yellow,
        value: total.yellow || 0,
      },
      {
        color: colors.background_red,
        value: total.red || 0,
      },
      {
        color: colors.background_light_gray,
        value: total.emptyAnswer && showEmptyAnswers ? total.emptyAnswer : 0,
      },
    ]
    return data.sort((a,b) => b.value - a.value)
  }

  if (filteredProgrammes.length < 1) return <div><h2>No data for these choices</h2></div>



  return (
    <div className="report-smiley-container">
    <div className="report-smiley-header">
      <Grid>
        <Grid.Column width={4} className="left-header" />
        <Grid.Column width={6} className="center-header">
          <p>{year} - {translations.reportHeader['smileys'][lang]} - {translations[level][lang]}</p>
        </Grid.Column>
        <Grid.Column width={5} className="right-header" floated="right">
          <Popup
            size="large"
            style={{ width: "400px"}}
            trigger={
              <Icon
                name="question circle outline"
                size="large"
              />}
              content={
                <>
                  <p><span className="answer-circle-green" />  {translations.positive[lang]}</p>
                  <p><span className="answer-circle-yellow" />  {translations.neutral[lang]}</p>
                  <p><span className="answer-circle-red" />  {translations.negative[lang]}</p>
                </>
              }
              on="click"
              position="left center"
            />
        </Grid.Column>
      </Grid>
    </div>
    <div className="ui divider"/>
    <div className="report-wide-header">
      <Radio
        checked={showEmptyAnswers}
        onChange={() => setShowEmptyAnswers(!showEmptyAnswers)}
        label={translations.emptyAnswers[lang]}
        toggle
      />
    </div>
    <div className="report-smiley-grid">
      {questionsList.map((question) =>
        (allAnswers.get(question.id) && !question.no_light ? (
          <div className="report-chart-area">
            <div className="report-pie-header">
              <p>{question.labelIndex}. {question.label}</p>
              <p>{translations.responses[lang]}{allAnswers.get(question.id) ? colorsTotal(question).total : 0}</p>
            </div>
            <div className="report-pie-chart">
              <PieChart
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
          </div>)
          :
          <>
          </>
        )
      )}
    </div>
    </div>
  )
} 

export default SmileyAnswers