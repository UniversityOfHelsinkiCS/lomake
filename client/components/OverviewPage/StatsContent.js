import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

const StatsContent = ({ stats }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    <div style={{ height: '500px', width: '500px' }}>
      <PieChart
        animationDuration={500}
        animationEasing="ease-out"
        center={[50, 50]}
        data={[
          {
            color: '#9dff9d',
            title: 'Green',
            value: stats.green || 0,
          },
          {
            color: '#ffffb1',
            title: 'Yellow',
            value: stats.yellow || 0,
          },
          {
            color: '#ff7f7f',
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
        <img src={positiveEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} />{' '}
        {stats.green || 0}
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
        <img src={negativeEmoji} style={{ width: '40px', height: 'auto', marginRight: '5px' }} />{' '}
        {stats.red || 0}
      </div>
    </div>
  </div>
)

export default StatsContent
