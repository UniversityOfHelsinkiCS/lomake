import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Grid } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common.js'
import './ComparisonPage.scss'


const CompareByYear = ({ questionsList, usersProgrammes, allAnswers, allYears }) => {
  const lang = useSelector((state) => state.language)
  const user = useSelector((state) => state.currentUser.data)
  const history = useHistory()

  if (!usersProgrammes || !allAnswers) return <></>

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    allAnswers.forEach((year) => {
      let green = []
      let yellow = []
      let red = []
      let emptyAnswer = []
      year.answers.forEach((q, key) => {
        const color = questionsList.find((q) => q.id === key)
        if (color) {
          let colors = {
            green: 0,
            yellow: 0,
            red: 0,
            emptyAnswer: 0,
          }  
          q.forEach((a) => colors[a.color] = colors[a.color] + 1)
          green = [...green, colors.green]
          yellow = [...yellow, colors.yellow]
          red = [...red, colors.red]
          emptyAnswer = [...emptyAnswer, colors.emptyAnswer]
        }
      })
      total = [...total, 
        { year: year.year, name: 'positive', color: 'green', data: green}, 
        { year: year.year, name: 'neutral', color: 'yellow', data: yellow }, 
        { year: year.year, name: 'negative', color: 'red', data: red }, 
        { year: year.year, name: 'empty', color: 'gray', data: emptyAnswer } 
      ]
    })
      
    return total
  }
  const colorSums = colorsTotal()
  
  const data = colorSums.map((sum) => {
    return {
      name: `${sum.year} ${translations[sum.name][lang]}`,
      data: sum.data,
      color: colors[sum.color],
      dataLabels: [{ enabled: true }],
      stack: sum.year,
    }
  })

  const options = {
    chart: {
      type: 'column'
    },
    title: {
      text: '',
    },
    subtitle: {
      text: '',
    },
    credits: {
      text: '',
    },
    xAxis: {
      categories: questionsList.map((q) => q.label),
      labels: {
        rotation: -45,
        style: {
            fontSize: '8px',
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '%',
      },
    },
    tooltip: {
      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
      pointFormat: '<tr><td style=color:{series.color};padding:0">{series.name}: </td>'
          + '<td style="padding:0"><b>{point.y:.0f} ohjelmaa</b></td></tr>',
      footerFormat: '</table>',
      shared: true,
      useHTML: true,
    },
    plotOptions: {
      column: {
          stacking: 'percent'
      }
    },
    legend: {
      enabled: false,
    },
    series: data
  }

  return (
    <div className="comparison-container">
      <Grid>
        <Grid.Column className="comparison-center-header" width={16}>
          {translations.reportHeader['byYear'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <HighchartsReact
        highcharts={Highcharts}
        constructorType="chart"
        options={options}
      />
    </div>
  )
}

export default CompareByYear