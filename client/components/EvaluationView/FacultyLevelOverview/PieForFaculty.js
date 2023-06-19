import React from 'react'
import { PieChart } from 'react-minimal-pie-chart'
import { useSelector } from 'react-redux'
import { evaluationQuestions } from '../../../questionData/index'

const PieForFaculty = ({ facultyKey, programmesAnswers, questionId, setModalData, facultyName }) => {
  const lang = useSelector(state => state.language)

  const answers = programmesAnswers || []
  const modifiedQuestionId = questionId.replace('_faculty', '')
  const colorId = `${modifiedQuestionId}_light`
  const textId = `${modifiedQuestionId}_text`
  const answersCounted = answers.reduce(
    (acc, curr) => {
      if (!curr.data) return acc

      const colorAnswerData = curr.data[colorId]
      const textAnswerData = curr.data[textId]
      if (colorAnswerData) {
        acc.colors[colorAnswerData] = acc.colors[colorAnswerData] ? acc.colors[colorAnswerData] + 1 : 1
      }
      if (textAnswerData) {
        if (acc.text[colorAnswerData] === undefined) {
          acc.text[colorAnswerData] = [
            {
              programme: curr.programme,
              answer: textAnswerData,
            },
          ]
        } else {
          acc.text[colorAnswerData] = acc.text[colorAnswerData].concat({
            programme: curr.programme,
            answer: textAnswerData,
          })
        }
      }

      return acc
    },
    { colors: {}, text: [] }
  )
  return (
    <>
      <div
        key={facultyKey}
        style={{ cursor: 'pointer' }}
        onClick={() =>
          setModalData({
            header: evaluationQuestions.reduce((acc, cur) => {
              if (acc) return acc
              const header = cur.parts.reduce((acc, cur) => {
                if (acc) return acc

                if (cur.id === modifiedQuestionId) {
                  return cur.description[lang]
                }

                return acc
              }, '')
              if (header) return header

              return acc
            }, ''),
            facultyKey,
            facultyName,
            content: answersCounted.text,
            color: answersCounted.colors,
          })
        }
      >
        <PieChart
          animationDuration={500}
          animationEasing="ease-out"
          center={[50, 50]}
          data={[
            {
              color: '#9dff9d',
              value: answersCounted.colors.green || 0,
            },
            {
              color: '#ffffb1',
              value: answersCounted.colors.yellow || 0,
            },
            {
              color: '#ff7f7f',
              value: answersCounted.colors.red || 0,
            },
            answersCounted.colors.green || answersCounted.colors.yellow || answersCounted.colors.red
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
