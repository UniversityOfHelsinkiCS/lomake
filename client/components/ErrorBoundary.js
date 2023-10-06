import { Button } from 'semantic-ui-react'
import { Sentry } from 'Utilities/sentry'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error(error, info)
    Sentry.captureException(error, { extra: info })
    this.setState({ hasError: true })
  }

  render() {
    const { hasError } = this.state
    const { children } = this.props
    if (!hasError) {
      return children
    }

    const isIndividual = window.location.href.includes('/individual')

    const reload = () => {
      window.location.reload()
    }

    return (
      <div style={{ marginTop: '10rem' }}>
        <h1>Something went wrong.</h1>
        <p>Our team has been notified. The information you have so far entered is saved.</p>
        {isIndividual && (
          <Link to="/" onClick={() => this.setState({ hasError: false })}>
            Go back to the front page
          </Link>
        )}
        <Button onClick={reload}>Reload the page</Button>
      </div>
    )
  }
}
