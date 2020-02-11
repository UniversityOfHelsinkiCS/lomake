import React, { useEffect, useState } from 'react'
import Dropdown from 'Components/Generic/Dropdown'
import { useDispatch, useSelector } from 'react-redux'
import { getAnswersAction } from 'Utilities/redux/answersReducer'
import { degreeLevels, allLightIds, programmes } from 'Utilities/common'
import './AnalyticsPage.scss'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.answers)

  const [chosenDegreeLevel, setDegree] = useState('')

  const handleChange = async ({ target }) => {
    const { value } = target
    setDegree(value)
  }

  useEffect(() => {
    dispatch(getAnswersAction())
  }, [])

  /**
   * Copy of total insanity
   */

  const filteredProgrammes = programmes.filter((prog) => {
    if (!chosenDegreeLevel || chosenDegreeLevel === 'All levels') return true

    const starting = prog.substr(0, 4)
    const shortDegrees = degreeLevels.map((dl) => dl.substr(0, 4))
    if (!shortDegrees.includes(starting)) return true

    if (chosenDegreeLevel.includes(starting)) return true
    return false
  })

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <Dropdown
        id="degree_level"
        value={chosenDegreeLevel}
        label="Degree level"
        options={['All levels'].concat(degreeLevels)}
        onChange={handleChange}
      />
      <table className="ui fixed celled striped table">
        <thead>
          <tr>
            <th colspan="2">Programmes</th>
            {allLightIds.map((id) => (
              <th key={id}>{id.substring(0, id.length - 6)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredProgrammes.map((p) => {
            const programme = answers.data.find((a) => a.programme === p)
            if (!programme)
              return (
                <tr key={p}>
                  <th colspan="2">{p}</th>
                  {allLightIds.map((q) => (
                    <td key={`${p}-${q}`} className="center aligned">
                      <div className="circle dot grey" />
                    </td>
                  ))}
                </tr>
              )
            return (
              <tr key={p}>
                <th colspan="2">{p}</th>
                {allLightIds.map((q) => {
                  return programme.data[q] ? (
                    <td key={`${p}-${q}`}>
                      <div
                        className={`circle dot ${programme.data[q]}-active`}
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
