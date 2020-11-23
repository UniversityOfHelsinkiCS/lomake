import React from 'react'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { colors } from 'Utilities/common'

const BarChart = ({ data, questions, unit }) => {
  if (!data) return <></>

  const calculateChange = () => {
    if (!data) return []
    data.forEach((series) => {
      const previousYear = data.find((y) => series.year - 1 === y.year && series.color === y.color)
      if (previousYear) {
        series.changes = series.data.map((d, index) => {
          let change = d - previousYear.data[index]
          if (change >= 0) change = `(+${change})`
          else if (change < 0) change = `(${change})`
          return change
        })
      }
    })
  }

  calculateChange()

  const seriesData = data.map((series) => {
    return {
      name: Number(series.year),
      data: series.data,
      changes: series.changes,
      color: colors[series.color],
      stack: series.year,
      label: [{ enabled: true }],
    }
  })

  const options = {
    chart: {
      type: 'column',
      height: '600px',
      marginTop: 50,
      marginRight: 30,
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
      categories: questions,
      reserveSpace: true,
      labels: {
        autoRotationLimit: 90,
        style: {
          color: '#000000',
          minWidth: '200px',
          textOverflow: 'none',
          wordBreak: 'break-all',
        },
        overflow: 'allow',
      },
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
        },
      },
    },
    tooltip: {
      enabled: false,
    },
    plotOptions: {
      series: {
        groupPadding: 0.13,
        enableMouseTracking: false,
        dataLabels: {
          enabled: true,
          crop: false,
          inside: true,
          pointPadding: 0.1,
          style: { textOverflow: 'clip' },
          formatter: function () {
            if (unit === 'programmeAmountWithChanges') {
              const changes = this.series.userOptions.changes
              if (changes) return this.y + '<br>' + changes[this.point.index]
              return this.y
            } else if (unit === 'programmeAmountWithoutChanges' || unit === 'programmeAmount') {
              return this.y
            } else {
              return `${this.point.percentage.toFixed(1)} %`
            }
          },
        },
      },
      column: {
        stacking: 'percent',
      },
    },
    legend: {
      enabled: false,
    },
    series: seriesData,
  }

  return (
    <HighchartsReact
      className="comparison-bar-chart"
      highcharts={Highcharts}
      constructorType="chart"
      options={options}
    />
  )
}

export default BarChart
