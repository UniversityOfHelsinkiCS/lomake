import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { colors } from 'Utilities/common'

const StatsContent = ({ stats }) => {
  return (
    <>
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
    </>
  )
}

export default StatsContent
