import React from 'react'
import { useSelector } from 'react-redux'
import HighchartsReact from 'highcharts-react-official'
import Highcharts from 'highcharts'
import { colors } from 'Utilities/common'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

require('highcharts/modules/exporting')(Highcharts)

const checkSize = seriesData => {
  const questionAmount = (seriesData[0] && seriesData[0].data.length) || 0
  if (questionAmount < 9) return '14px'
  if (questionAmount < 13) return '9px'
  return '7px'
}

const defineLabelAngle = seriesData => (seriesData[0] && seriesData[0].data.length > 9 ? -45 : 0)

const getExportText = ({ lang, multipleYears, faculties, faculty, level }) => {
  const formText = translations.chartExport[lang]
  const time =
    multipleYears.length > 1 ? `${multipleYears[0]}-${multipleYears[multipleYears.length - 1]}` : multipleYears[0]
  const facultyText = faculty === 'allFaculties' ? '' : faculties.find(f => f.code === faculty).name[lang]
  const levelText = translations[level][lang]
  return `${formText}_${time}_${facultyText}_${levelText}`
}

const BarChart = ({ data, questions, unit }) => {
  const { faculty, level, multipleYears } = useSelector(state => state.filters)
  const faculties = useSelector(state => state.faculties.data)
  const lang = useSelector(state => state.language)
  if (!data) return <></>

  const seriesData = data.map((series, index) => {
    return {
      name: translations[series.name][lang],
      id: Math.random(),
      data: series.data,
      changes: series.changes,
      color: colors[series.color],
      stack: series.year,
      label: [{ enabled: true }],
      showInLegend: index < 4,
    }
  })

  const graphImages = {
    menuItemDefinitions: {
      viewFullscreen: {
        text: translations.viewFullscreen[lang],
      },
      downloadPNG: {
        text: translations.downloadPNG[lang],
      },
      downloadSVG: {
        text: translations.downloadSVG[lang],
      },
      downloadPDF: {
        text: translations.downloadPDF[lang],
      },
    },
    width: 2600,
    height: 1650,
    filename: getExportText({ lang, multipleYears, faculties, faculty, level }),
    sourceWidth: 1564,
    sourceHeight: 700,
    buttons: {
      contextButton: {
        menuItems: ['viewFullscreen', 'downloadPNG', 'downloadSVG', 'downloadPDF'],
      },
    },
  }

  const percentageOptions = {
    chart: {
      type: 'column',
      height: '750px',
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
      categories: questions.map(q => q.slice(2, q.length)),
      reserveSpace: true,
      labels: {
        rotation: defineLabelAngle(seriesData),
        style: {
          color: '#000000',
          textOverflow: 'none',
          wordBreak: 'break-all',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '%',
      },
      stackLabels: {
        enabled: true,
        format: '{stack}',
        style: {
          fontSize: checkSize(seriesData),
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
          style: { textOverflow: 'clip', fontSize: checkSize(seriesData) },
          format: '{point.percentage:.1f}%',
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
      itemDistance: 65,
    },
    series: data ? seriesData : [],
  }

  const normalOptions = {
    chart: {
      type: 'column',
      height: '750px',
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
      categories: questions.map(q => q.slice(2, q.length)),
      reserveSpace: true,
      labels: {
        rotation: defineLabelAngle(seriesData),
        style: {
          color: '#000000',
          textOverflow: 'none',
          wordBreak: 'break-all',
        },
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: translations.programmes[lang],
      },
      stackLabels: {
        enabled: true,
        format: '{stack}',
        style: {
          fontSize: checkSize(seriesData),
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
          style: { textOverflow: 'clip', fontSize: checkSize(seriesData) },
          format: '{point.y}',
        },
      },
      column: {
        stacking: 'normal',
      },
    },
    legend: {
      useHTML: true,
      padding: 10,
      itemMarginTop: 10,
      itemDistance: 65,
    },
    series: data ? seriesData : [],
  }

  return (
    <HighchartsReact
      className="bar-chart"
      highcharts={Highcharts}
      constructorType="chart"
      options={unit === 'percentage' ? percentageOptions : normalOptions}
    />
  )
}

export default BarChart
