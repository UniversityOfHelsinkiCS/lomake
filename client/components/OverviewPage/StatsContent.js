import React from 'react'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'
import positiveEmoji from 'Assets/sunglasses.png'
import { PieChart } from 'react-minimal-pie-chart'
import ReactWordcloud from 'react-wordcloud'
import { colors } from 'Utilities/common'

const TO_REPLACE = ['.', ':', '"', '’', '(', ')', '/', '-', ';', '?', '_x000d_', '•']
const MIN_COUNT = 5
const MIN_WORD_LENGTH = 4


const replaceAllAndLower = (word) => {
  let lowerWord = word.toLowerCase()
  //should be replaced with one regex replace
  TO_REPLACE.forEach((replacer) => {
    lowerWord = lowerWord.replace(replacer, '')
  })

  return lowerWord
}

const StatsContent = ({ stats, answers, questionId }) => {
  //const [viewedCloud, setViewedCloud] = useState('total')
  const viewedCloud = 'total'

  const worldCloudObject = answers.reduce(
    (obj, { data }) => {
      const textId = `${questionId}_text`
      const colorId = `${questionId}_light`
      if (data[textId] && data[colorId]) {
        const words = data[textId].split(/,| |\n/).map((word) => replaceAllAndLower(word))
        const color = data[colorId]
        words.forEach((word) => {
          const existingTotal = obj.total[word] || 0
          obj.total[word] = existingTotal + 1

          const existingColor = obj[color][word] || 0
          obj[color][word] = existingColor + 1
        })
      }

      return obj
    },
    { green: {}, yellow: {}, red: {}, total: {} }
  )

  const worldCloudWords = Object.keys(worldCloudObject[viewedCloud]).reduce((acc, key) => {
    const wordCount = worldCloudObject[viewedCloud][key]

    if (wordCount <= MIN_COUNT) return acc
    if (key.length < MIN_WORD_LENGTH) return acc

    return [...acc, { text: key, value: wordCount }]
  }, [])

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
          <div
            style={{ display: 'flex', alignItems: 'center', fontSize: '1.2em', fontWeight: 'bold' }}
          >
            <img
              src={positiveEmoji}
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
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
            <img
              src={negativeEmoji}
              style={{ width: '40px', height: 'auto', marginRight: '5px' }}
            />{' '}
            {stats.red || 0}
          </div>
        </div>
      </div>
      {/*<Dropdown
        onChange={(_e, { value }) => setViewedCloud(value)}
        options={dropdownOptions}
        selection
        value={viewedCloud}
      />*/}
      <ReactWordcloud
        words={worldCloudWords}
        options={{
          colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b'],
          enableTooltip: true,
          deterministic: false,
          fontFamily: 'impact',
          fontSizes: [5, 60],
          fontStyle: 'normal',
          fontWeight: 'normal',
          padding: 1,
          randomSeed: null,
          rotations: 3,
          rotationAngles: [0, 90],
          scale: 'sqrt',
          spiral: 'archimedean',
          transitionDuration: 1000,
        }}
      />
    </>
  )
}

export default StatsContent
