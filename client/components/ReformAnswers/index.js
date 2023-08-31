import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReformAnswers } from 'Utilities/redux/reformAnswerReducer'

export default () => {
  const dispatch = useDispatch()
  const answers = useSelector(state => state.reformAnswers)

  console.log(answers)

  useEffect(() => {
    dispatch(getReformAnswers())
  }, [])

  if (!answers.data || answers.pending || answers.error) {
    return null
  }

  return (
    <div>
      <h1>reform answers</h1>

      <p>how many {answers.data.length}</p>

      <pre>{JSON.stringify(answers.data, null, 2)}</pre>
    </div>
  )
}
