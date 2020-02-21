import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoremIpsum } from 'lorem-ipsum'
import { getAnswersAction } from 'Utilities/redux/answersReducer'
import { allLightIds, programmes } from 'Utilities/common'
import './AnalyticsPage.scss'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.answers)
  const user = useSelector((state) => state.currentUser.data)

  const [filter, setFilter] = useState('')

  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  useEffect(() => {
    dispatch(getAnswersAction())
  }, [])

  /**
   * Copy of total insanity
   */

  const filteredProgrammes = programmes.filter((prog) => {
    return prog.toLowerCase().includes(filter.toLowerCase())
  })

  const transformIdToTitle = (id) => {
    const formatted = id.substring(0, id.length - 6).replace('_', ' ')

    return (
      <span
        style={{
          writingMode: 'vertical-lr'
        }}
      >
        {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
      </span>
    )
  }
  const [fakeAnswers, setFakeAnswers] = useState([])
  const fakeData = () => {
    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: 8,
        min: 4
      },
      wordsPerSentence: {
        max: 16,
        min: 4
      }
    })

    const newFakeAnswers = []

    programmes.forEach((programme, index) => {
      const skip = Math.random() > 0.95
      if (!skip) {
        newFakeAnswers.push({
          id: index,
          programme,
          data: allLightIds.reduce((acc, cur) => {
            //65% are green 20% yellow 10% red 5% skip
            let randomLight = 'green'
            const randomLightNumber = Math.random()
            if (randomLightNumber > 0.95) {
              return acc
            } else if (randomLightNumber > 0.9) {
              randomLight = 'red'
            } else if (randomLightNumber > 0.7) {
              randomLight = 'yellow'
            }

            return {
              ...acc,
              [cur]: randomLight,
              [cur.replace('light', 'text')]: lorem.generateSentences(Math.ceil(Math.random() * 10))
            }
          }, {})
        })
      }
    })

    setFakeAnswers(newFakeAnswers)
  }

  const lightEmojiMap = {
    green: positiveEmoji,
    yellow: neutralEmoji,
    red: negativeEmoji
  }

  const backgroundColorMap = {
    green: '#e5fbe5',
    yellow: '#ffffed',
    red: '#ffcccb'
  }

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <label for="filter">Filter programmes:</label>
      <input name="filter" type="text" onChange={handleChange} value={filter} />
      {user.adminMode && (
        <div style={{ marginTop: '1em' }}>
          {fakeAnswers.length === 0 ? (
            <button onClick={() => fakeData()}>Fake answers</button>
          ) : (
            <button onClick={() => setFakeAnswers([])}>Use answers from backend</button>
          )}
        </div>
      )}
      {/* Can't use Semantic's "fixed" because it makes the tooltips go under */}
      <table style={{ tableLayout: 'fixed' }} className="ui celled striped table">
        <thead>
          <tr>
            <th colSpan="2">Programmes</th>
            {allLightIds.map((id) => (
              <th key={id} style={{ wordWrap: 'break-word', textAlign: 'center' }}>
                {transformIdToTitle(id)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProgrammes.map((p) => {
            const answersToUse = fakeAnswers.length > 0 ? fakeAnswers : answers.data
            const programme = answersToUse.find((a) => a.programme === p)
            if (!programme)
              return (
                <tr key={p}>
                  <th colSpan="2">{p}</th>
                  {allLightIds.map((q) => (
                    <td key={`${p}-${q}`} className="center aligned"></td>
                  ))}
                </tr>
              )
            return (
              <tr key={p}>
                <th colSpan="2">{p}</th>
                {allLightIds.map((q) => {
                  return programme.data[q] ? (
                    <td
                      key={`${p}-${q}`}
                      style={{
                        background: backgroundColorMap[programme.data[q]]
                      }}
                    >
                      <div
                        className="emoji-cell"
                        style={{ display: 'flex', justifyContent: 'center' }}
                        data-tooltip={
                          programme.data[q.replace('light', 'text')]
                            ? programme.data[q.replace('light', 'text')]
                            : undefined
                        }
                      >
                        <img
                          src={lightEmojiMap[programme.data[q]]}
                          style={{ width: '75%', maxWidth: '50px', height: 'auto' }}
                        />
                      </div>
                    </td>
                  ) : (
                    <td key={`${p}-${q}`}></td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
}
