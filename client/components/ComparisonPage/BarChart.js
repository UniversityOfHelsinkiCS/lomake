import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { colors } from 'Utilities/common'

const BarChart = ({ colorSums, questions }) => {
  const lang = useSelector((state) => state.language)

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
      categories: questions,
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



  return (
    <HighchartsReact
      highcharts={Highcharts}
      constructorType="chart"
      options={options}
    />
  )
}

export default BarChart