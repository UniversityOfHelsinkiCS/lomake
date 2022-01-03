import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'

import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import positiveEmoji from 'Assets/sunglasses.png'
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
            label={function noRefCheck() {}}
            labelPosition={112}
            labelStyle={function noRefCheck() {}}
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
            <img src={positiveEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} /> {stats.green || 0}
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
            <img
              src={neutralEmoji}
              style={{
                width: '40px',
                height: 'auto',
                marginRight: '5px',
                marginTop: '5px',
                marginBottom: '5px',
              }}
            />{' '}
            {stats.yellow || 0}
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
            <img src={negativeEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} /> {stats.red || 0}
          </div>
        </div>
      </div>
    </>
  )
}

export default StatsContent
