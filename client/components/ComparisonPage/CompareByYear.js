import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router'
import { Grid, Radio } from 'semantic-ui-react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import QuestionList from './QuestionList'
import YearSelector from 'Components/Generic/YearSelector'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common.js'
import './ComparisonPage.scss'


const CompareByYear = ({ questionsList, usersProgrammes, allAnswers }) => {
  const [showEmpty, setShowEmpty] = useState(true)
  const [picked, setPicked] = useState([])
  const lang = useSelector((state) => state.language)
  const user = useSelector((state) => state.currentUser.data)
  const years = useSelector(({ filters }) => filters.reportYears)
  const history = useHistory()

  if (!usersProgrammes || !allAnswers) return <></>

  if (!user.admin && usersProgrammes.length <= 5) {
    history.push('/')
  }

  const questionLabels = () => {
    return questionsList.map((q) => q.label.charAt(0) + q.label.slice(1).toLowerCase()) 
  }

  useEffect(() => {
    setPicked(questionLabels())
  }, [])

  const colorsTotal = () => {
    if (!allAnswers) return null
    let total = []
    allAnswers.forEach((rawData) => {
      if (years.includes(rawData.year)) {
        let yearsColors = { green: [], yellow: [], red: [], emptyAnswer: [] }
        rawData.answers.forEach((answerSet, key) => {
          const questionWithColor = questionsList.find((q) => q.id === key)
          if (questionWithColor && picked.includes(questionWithColor.label.charAt(0) + questionWithColor.label.slice(1).toLowerCase())) {
            let colors = {
              green: 0,
              yellow: 0,
              red: 0,
              emptyAnswer: 0,
            }  
            answerSet.forEach((a) => colors[a.color] = colors[a.color] + 1)
            yearsColors.green = [...yearsColors.green, colors.green]
            yearsColors.yellow = [...yearsColors.yellow, colors.yellow]
            yearsColors.red = [...yearsColors.red, colors.red]
            yearsColors.emptyAnswer = [...yearsColors.emptyAnswer, colors.emptyAnswer]
          }
        })
        total = [...total,
          { year: rawData.year, name: 'positive', color: 'green', data: yearsColors.green },
          { year: rawData.year, name: 'neutral', color: 'yellow', data: yearsColors.yellow },
          { year: rawData.year, name: 'negative', color: 'red', data: yearsColors.red },
        ]
        if (showEmpty) {
          total = [...total, { year: rawData.year, name: 'emptyAnswer', color: 'gray', data: yearsColors.emptyAnswer }]
        }
      }
    })
    return total
  }
  const colorSums = colorsTotal()
  
  const seriesData = colorSums.map((series) => {
    return {
      name: `${series.year} ${translations[series.color][lang]}`,
      data: series.data,
      color: colors[series.color],
      dataLabels: [{ enabled: true, crop: false, format: '{percentage:.1f} %', style: { fontSize: '10px' }}],
      stack: series.year,
      enableMouseTracking: false,
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
      reserveSpace: true,
      labels: {
        autoRotationLimit: 40,
        style: {
            fontSize: '10px',
            minWidth: '200px',
            textOverflow: 'none',
        },
        overflow: 'allow',
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: '%',
      },
      stackLabels: {
        enabled: true,
        style: {
          fontWeight: 'bold',
        }
      }
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      column: {
        stacking: 'percent',
        dataLabels: {
          enabled: true,
        }
      }
    },
    legend: {
      enabled: false,
    },
    series: seriesData
  }

  return (
    <div className="comparison-container">
      <Grid>
        <Grid.Column className="comparison-center-header" width={16}>
          {translations.reportHeader['byYear'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <YearSelector reportSelector />
          </Grid.Column>
          <Grid.Column width={6}>

          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <HighchartsReact
              highcharts={Highcharts}
              constructorType="chart"
              options={options}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={12}>
            <QuestionList 
              questions={questionLabels()}
              picked={picked}
              setPicked={setPicked}
            /> 
          </Grid.Column>
          <Grid.Column width={4}>
            <Radio
              checked={showEmpty}
              onChange={() => setShowEmpty(!showEmpty)}
              label={translations.emptyAnswers[lang]}
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  )
}

export default CompareByYear