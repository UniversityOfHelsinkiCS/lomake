import React, { useEffect, useState } from 'react'
import Dropdown from 'Components/Generic/Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { getAnswersAction } from 'Utilities/redux/answersReducer'
import { degreeLevels, allLightIds, programmes } from 'Utilities/common'
import './AnalyticsPage.scss'

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

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <label for="filter">Filter programmes:</label>
      <input name="filter" type="text" onChange={handleChange} value={filter} />
      {/* Can't use Semantic's "fixed" because it makes the tooltips go under */}
      <table
        style={{ tableLayout: 'fixed' }}
        className="ui celled striped table"
      >
        <thead>
          <tr>
            <th colSpan="2">Programmes</th>
            {allLightIds.map((id) => (
              <th
                key={id}
                style={{ wordWrap: 'break-word', textAlign: 'center' }}
              >
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
                    <td key={`${p}-${q}`} className="center aligned">
                      <div className="circle dot grey" />
                    </td>
                  ))}
                </tr>
              )
            return (
              <tr key={p}>
                <th colSpan="2">{p}</th>
                {allLightIds.map((q) => {
                  return programme.data[q] ? (
                    <td key={`${p}-${q}`}>
                      <div
                        className={`circle dot ${programme.data[q]}-active`}
                        data-tooltip={
                          programme.data[q.replace('light', 'text')]
                            ? programme.data[q.replace('light', 'text')]
                            : undefined
                        }
                      />
                    </td>
                  ) : (
                    <td key={`${p}-${q}`}>
                      <div className="circle dot grey" />
                    </td>
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
