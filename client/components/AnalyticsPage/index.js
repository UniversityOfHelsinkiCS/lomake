import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoremIpsum } from 'lorem-ipsum'
import { getAllAnswersAction } from 'Utilities/redux/allAnswersReducer'
import { allLightIds, programmes } from 'Utilities/common'
import './AnalyticsPage.scss'
import { Icon, Modal, Header } from 'semantic-ui-react'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.allAnswers)
  const user = useSelector((state) => state.currentUser.data)

  const [filter, setFilter] = useState('')
  const [modalData, setModalData] = useState(null)

  const handleChange = ({ target }) => {
    const { value } = target
    setFilter(value)
  }

  useEffect(() => {
    dispatch(getAllAnswersAction())
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
    green: 'smile outline',
    yellow: 'meh outline',
    red: 'frown outline'
  }

  const backgroundColorMap = {
    green: '#9dff9d',
    yellow: '#ffffb1',
    red: '#ff7f7f'
  }

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <Modal open={!!modalData} onClose={() => setModalData(null)} basic size="small" closeIcon>
        {/* Right now header is showing the question id but in the final version the full question is shown */}
        <Header icon="question" content={modalData ? modalData.content : ''} />
        <Modal.Content>
          <Modal.Description>{modalData ? modalData.programme : ''}</Modal.Description>
          <h3
            style={{
              color: backgroundColorMap[modalData ? modalData.color : 'green']
            }}
          >
            {modalData ? modalData.header : ''}
          </h3>
        </Modal.Content>
      </Modal>
      <label htmlFor="filter">Filter programmes:</label>
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
      <table style={{ tableLayout: 'fixed' }}>
        <thead>
          <tr>
            <th colSpan="2" />
            {allLightIds.map((id) => (
              <th
                key={id}
                style={{
                  wordWrap: 'break-word',
                  textAlign: 'center',
                  position: 'sticky',
                  background: 'white'
                }}
              >
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
                    <td
                      style={{
                        height: '75px',
                        width: '75px',
                        background: 'whitesmoke'
                      }}
                      key={`${p}-${q}`}
                      className="center aligned"
                    />
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
                        background: backgroundColorMap[programme.data[q]],
                        height: '75px',
                        width: '75px',
                        textAlign: 'center'
                      }}
                    >
                      <Icon
                        name={lightEmojiMap[programme.data[q]]}
                        style={{ cursor: 'pointer' }}
                        size="big"
                        onClick={() =>
                          setModalData({
                            header: programme.data[q.replace('light', 'text')],
                            programme: p,
                            content: q,
                            color: programme.data[q]
                          })
                        }
                      />
                    </td>
                  ) : (
                    <td style={{ background: 'whitesmoke' }} key={`${p}-${q}`}></td>
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
