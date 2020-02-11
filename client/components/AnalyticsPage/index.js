import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAnswersAction } from 'Utilities/redux/answersReducer'
import { allLightIds, programmes } from 'Utilities/common'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector((state) => state.answers)

  useEffect(() => {
    dispatch(getAnswersAction())
  }, [])

  if (answers.pending || !answers.data) return <>SPINNING!</>

  return (
    <>
      <table className="ui fixed celled striped table">
        <thead>
          <tr>
            <th>Programmes</th>
            {allLightIds.map((id) => (
              <th>{id.substring(0, id.length - 6)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {programmes.map((p) => {
            const programme = answers.data.find((a) => a.programme === p)
            if (!programme)
              return (
                <tr>
                  <th>{p}</th>
                  {allLightIds.map((q) => (
                    <td key={`${p}-${q}`} className="center aligned">
                      <div className="circle grey" />
                    </td>
                  ))}
                </tr>
              )
            return (
              <tr>
                <th>{p}</th>
                {allLightIds.map((q) => {
                  return programme.data[q] ? (
                    <td key={`${p}-${q}`}>
                      <div className={`circle ${programme.data[q]}-active`} />
                    </td>
                  ) : (
                    <td key={`${p}-${q}`}>
                      <div className="circle grey" />
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
