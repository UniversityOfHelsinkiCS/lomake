/* eslint-disable react/button-has-type */
import React, { useEffect, useState } from 'react'

export default () => {
  const [faker, setFaker] = useState(null)
  const [info, setInfo] = useState(null)

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

  const onHover = () => {
    if (!faker) {
      setInfo('Click the button AND refresh the browser')
    }
  }

  return (
    <div>
      <button onMouseEnter={onHover} onMouseLeave={() => setInfo(null)} onClick={onClick}>
        {faker ? 'turn faker off' : 'turn faker on'}
      </button>
      <span style={{ marginLeft: 15 }}>{info}</span>
    </div>
  )
}
