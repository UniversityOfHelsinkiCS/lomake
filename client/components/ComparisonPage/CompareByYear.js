import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { Grid, Radio } from 'semantic-ui-react'
import { useHistory } from 'react-router'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common.js'
import './ComparisonPage.scss'


const CompareByYear = ({ questionsList, usersProgrammes, allAnswers, allYears }) => {
  const [showEmpty, setShowEmpty] = useState(true)
  const [picked, setPicked] = useState([])
  const lang = useSelector((state) => state.language)
  const user = useSelector((state) => state.currentUser.data)
  const history = useHistory()

  if (!usersProgrammes || !allAnswers) return <></>

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  useEffect(() => {
    setPicked(questionsList.map((q) => q.label))
  }, [])

  const addToChosen = (questionLabel) => {
    if (picked.includes(questionLabel)) {
      setPicked(() => picked.filter((label) => label !== questionLabel))
    }
  }

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    allAnswers.forEach((year) => {
      let green = []
      let yellow = []
      let red = []
      let emptyAnswer = []
      year.answers.forEach((answerSet, key) => {
        const questionWithColor = questionsList.find((q) => q.id === key)
        if (questionWithColor && picked.includes(questionWithColor.label)) {
          let colors = {
            green: 0,
            yellow: 0,
            red: 0,
            emptyAnswer: 0,
          }  
          answerSet.forEach((a) => colors[a.color] = colors[a.color] + 1)
          green = [...green, colors.green]
          yellow = [...yellow, colors.yellow]
          red = [...red, colors.red]
          emptyAnswer = [...emptyAnswer, colors.emptyAnswer]
        }
      })
      total = [...total,
        { year: year.year, name: 'positive', color: 'green', data: green },
        { year: year.year, name: 'neutral', color: 'yellow', data: yellow },
        { year: year.year, name: 'negative', color: 'red', data: red },
      ]
      if (showEmpty) {
        total = [...total, { year: year.year, name: 'emptyAnswer', color: 'gray', data: emptyAnswer }]
      }
    })
      
    return total
  }
  const colorSums = colorsTotal()
  
  const series = colorSums.map((sum) => {
    return {
      name: `${sum.year} ${translations[sum.color][lang]}`,
      data: sum.data,
      color: colors[sum.color],
      dataLabels: [{ enabled: true, crop: false, format: '{percentage:.1f} %', style: { fontSize: '10px' }}],
      stack: sum.year,
      point: {
        events: {
          click: function (event) {
            addToChosen(event.point.category)
          },
        },
      },
      label: [{ enabled: true }] ,
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
      categories: picked,
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
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'percent',
      }
    },
    legend: {
      enabled: false,
    },
    series: series
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
          <div className="companion-filter">
          <Radio
            checked={showEmpty}
            onChange={() => setShowEmpty(!showEmpty)}
            label={translations.emptyAnswers[lang]}
            toggle
          />
    </div>
    </div>
  )
}

export default CompareByYear