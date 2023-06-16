import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'

const PieForFaculty = ({ facultyKey, programmesAnswers, questionId }) => {
  const answers = programmesAnswers || []
  const modifiedQuestionId = questionId.replace('_faculty', '')
  const colorId = `${modifiedQuestionId}_light`
  const countColors = answers.reduce((acc, curr) => {
    if (!curr.data) return acc

    const answerData = curr.data[colorId]
    if (answerData) {
      acc[answerData] = acc[answerData] ? acc[answerData] + 1 : 1
    }

    return acc
  }, {})
  return (
    <>
      <div key={facultyKey} style={{ cursor: 'pointer' }}>
        <PieChart
          animationDuration={500}
          animationEasing="ease-out"
          center={[50, 50]}
          data={[
            {
              color: '#9dff9d',
              value: countColors.green || 0,
            },
            {
              color: '#ffffb1',
              value: countColors.yellow || 0,
            },
            {
              color: '#ff7f7f',
              value: countColors.red || 0,
            },
            countColors.green || countColors.yellow || countColors.red
              ? {
                  color: '#737373',
                  value: 0,
                }
              : {
                  color: '#737373',
                  value: 1,
                },
          ]}
          labelPosition={50}
          lengthAngle={360}
          lineWidth={100}
          paddingAngle={0}
          radius={50}
          startAngle={0}
          viewBoxSize={[100, 100]}
        />
      </div>
    </>
  )
}

export default PieForFaculty
