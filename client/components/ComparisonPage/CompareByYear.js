import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Grid } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common.js'
import './ComparisonPage.scss'

const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
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
    allAnswers.forEach((q, key) => {
      const color = questionsList.find(o => o.id === key)
      if (color) {
        let colors = {
          green: 0,
          yellow: 0,
          red: 0,
        }  
        q.forEach((a) => colors[a.color] = colors[a.color] + 1)

        const question = questionsList.find((k) => k.id === key)
        const name = question ? question.label : ''
        total = [...total, {name: name, colors}]  
      }
    })  
      
    return total
  }
  const colorSums = colorsTotal()

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
      categories: questionsList.map((q) => q.label)
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
    series: [
    {
      name: translations.green[lang],
      data: colorSums.map((question) => question.colors.green),
      color: colors.green,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2018,
    }, 
    {
      name: translations.yellow[lang],
      data: colorSums.map((question) => question.colors.yellow),
      color: colors.yellow,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2018,
    }, 
    {
      name: translations.red[lang],
      data: colorSums.map((question) => question.colors.red),
      color: colors.red,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2018,
    },
/*    {
      name: 'Green2019',
      data: [15, 14, 3, 7, 3, 7, 4, 3, 3, 4, 6, 7, 7, 8, 4, 8],
      color: colors.green,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2019,
    }, {
      name: 'Yellow2019',
      data: [2, 2, 3, 2, 1, 0, 15, 14, 3, 7, 3, 7, 4, 3, 3, 2],
      color: colors.yellow,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2019,
    }, {
      name: 'Red2019',
      data: [0, 2, 3, 2, 11, 7, 4, 3, 3, 14, 4, 2, 5, 3, 4, 0],
      color: colors.red,
      dataLabels: [{
        enabled: true,
      }],
      stack: 2019,
    }
    */
  ]
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