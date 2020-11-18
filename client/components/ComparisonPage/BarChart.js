import React from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'

const BarChart = ({ colorSums, questions }) => {
  const lang = useSelector((state) => state.language)

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
    <HighchartsReact
      className="comparison-bar-chart"
      highcharts={Highcharts}
      constructorType="chart"
      options={options}
    />
  )
}

export default BarChart