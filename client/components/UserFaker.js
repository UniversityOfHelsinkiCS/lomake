/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react'

export default () => {
  const [faker, setFaker] = useState(null)

  useEffect(() => {
    const val = window.localStorage.getItem('pickUser')
    setFaker(val)
  }, [])

  const onClick = () => {
    if (faker) {
      setFaker(null)
      window.localStorage.removeItem('pickUser')
    } else {
      setFaker(1)
      window.localStorage.setItem('pickUser', 1)
    }
  }
  return (
    <div>
      <button onClick={onClick}>{faker ? 'turn faker off' : 'turn faker on'}</button>
    </div>
  )
}
