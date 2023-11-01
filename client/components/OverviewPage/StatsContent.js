import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { colors } from 'Utilities/common'
import { useTranslation } from 'react-i18next'
import { degreeReformIndividualQuestions } from '../../questionData'

const ShowThemeQuestions = ({ themeQuestions }) => {
  const reversed = degreeReformIndividualQuestions.reduce((acc, theme) => {
    const reversedInTheme = theme.parts.filter(p => p.reversed).map(p => p.label)
    return reversedInTheme.length > 0 ? acc.concat(reversedInTheme) : acc
  }, [])
  const reverseLabels = reversed.reduce((acc, label) => acc.concat([label.fi, label.en, label.se]), [])

  return (
    <div>
      {themeQuestions.map(({ label, average }) => {
        const acualAverage = reverseLabels.includes(label) ? 5 - Number(average) : Number(average)
        return (
          <div key={label}>
            <p>
              <span style={{ marginRight: 10 }}>{label}</span> <strong>{acualAverage.toFixed(1)}</strong>
            </p>
          </div>
        )
      })}
    </div>
  )
}

const StatsContent = ({ statsToShow }) => {
  const { t } = useTranslation()
  const stats = statsToShow?.stats
  if (!stats) {
    if (statsToShow?.themeQuestions) {
      return <ShowThemeQuestions themeQuestions={statsToShow.themeQuestions} />
    }
    return <div>{t('generic:noData')}</div>
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ height: '250px', width: '250px' }}>
        <PieChart
          animationDuration={500}
          animationEasing="ease-out"
          center={[50, 50]}
          data={[
            {
              color: colors.background_green,
              title: 'Green',
              value: stats.green || 0,
            },
            {
              color: colors.background_yellow,
              title: 'Yellow',
              value: stats.yellow || 0,
            },
            {
              color: colors.background_red,
              title: 'Red',
              value: stats.red || 0,
            },
          ]}
          lengthAngle={360}
          lineWidth={100}
          paddingAngle={0}
          radius={42}
          startAngle={0}
          viewBoxSize={[100, 100]}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
          <div className="traffic-light-green" /> {stats.green || 0}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '5px 0',
            fontSize: '1.2em',
            fontWeight: 'bold',
          }}
        >
          <div className="traffic-light-yellow" /> {stats.yellow || 0}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0.5em',
            fontSize: '1.2em',
            fontWeight: 'bold',
          }}
        >
          <div className="traffic-light-red" /> {stats.red || 0}
        </div>
      </div>
    </div>
  )
}

export default StatsContent
