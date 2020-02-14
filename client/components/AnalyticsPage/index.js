import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnswersAction } from 'Utilities/redux/answersReducer'
import { degreeLevels, allLightIds, programmes } from 'Utilities/common'
import './AnalyticsPage.scss'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.answers)

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

  const lightEmojiMap = {
    green: positiveEmoji,
    yellow: neutralEmoji,
    red: negativeEmoji
  }

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <label for="filter">Filter programmes:</label>
      <input name="filter" type="text" onChange={handleChange} value={filter} />
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
            const programme = answers.data.find((a) => a.programme === p)
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
                        background: programme.data[q]
                      }}
                    >
                      <div
                        data-tooltip={
                          programme.data[q.replace('light', 'text')]
                            ? programme.data[q.replace('light', 'text')]
                            : undefined
                        }
                      >
                        <img
                          src={lightEmojiMap[programme.data[q]]}
                          style={{ width: '100%', height: 'auto' }}
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
