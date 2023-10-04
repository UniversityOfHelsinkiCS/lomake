import { Sentry } from 'Utilities/sentry'
import React from 'react'

const Debug = () => {
  const onClick = () => {
    try {
      // eslint-disable-next-line no-undef
      thisFunctionDoesNotExist()
    } catch (error) {
      Sentry.captureException(error)
    }
  }

  return (
    <div style={{ margin: '1rem' }}>
      <button onClick={onClick} type="button">
        Test simple sentry alert in production
      </button>
    </div>
  )
}

export default Debug
