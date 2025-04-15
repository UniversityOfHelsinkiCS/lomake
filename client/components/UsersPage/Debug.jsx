import { Sentry } from '../../util/sentry'
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

  const onClick2 = () => {
    Sentry.captureException('custom fakap')
  }

  return (
    <div style={{ margin: '1rem' }}>
      <button onClick={onClick} type="button">
        Test simple sentry alert in production
      </button>
      <button onClick={onClick2} type="button">
        Test another sentry alert in production
      </button>
    </div>
  )
}

export default Debug
