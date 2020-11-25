import React from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { colors } from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
require('highcharts/modules/exporting')(Highcharts)

const BarChart = ({ data, questions, unit }) => {
  const lang = useSelector((state) => state.language)
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

  const seriesData = data.map((series, index) => {
    return {
      name: translations[series.name][lang],
      data: series.data,
      changes: series.changes,
      color: colors[series.color],
      stack: series.year,
      label: [{ enabled: true }],
      showInLegend: index < 4 ? true : false,
    }
  })

  const checkSize = () => (seriesData[0] && seriesData[0].data.length > 6 ? '10px' : '15px')

  const graphImages = {
    menuItemDefinitions: {
      viewFullscreen: {
        text: 'Koko näyttö',
      },
      downloadPNG: {
        text: 'Lataa PNG-kuvana',
      },
      downloadSVG: {
        text: 'Lataa SVG-kuvana',
      },
      downloadPDF: {
        text: 'Lataa PDF:nä',
      },
    },
    width: 1800,
    height: 1400,
    buttons: {
      contextButton: {
        menuItems: ['viewFullscreen', 'downloadPNG', 'downloadSVG', 'downloadPDF'],
      },
    },
  }

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
    exporting: graphImages,
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
          style: { textOverflow: 'clip', fontSize: checkSize() },
          formatter: function () {
            if (this.y === 0) return ''
            if (unit === 'programmeAmountWithChange') {
              const changes = this.series.userOptions.changes
              if (changes) return this.y + '<br>' + changes[this.point.index]
              return this.y
            } else if (unit === 'programmeAmountWithoutChange' || unit === 'programmeAmount') {
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
      useHTML: true,
      padding: 10,
      itemMarginTop: 10,
    },
    series: data ? seriesData : [],
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
