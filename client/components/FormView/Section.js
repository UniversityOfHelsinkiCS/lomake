import React, { useState } from 'react'

import { requiredFormIds, colors } from 'Utilities/common'
import { useSelector } from 'react-redux'
import { Button } from 'semantic-ui-react'

const Section = ({ title, number, children }) => {
  const [collapsed, setCollapsed] = useState(true)
  const [hasBeenClosed, setHasBeenClosed] = useState(false)
  const viewOnly = useSelector(({ form }) => form.viewOnly)

  const ids = []
    .concat(...children)
    .filter((child) => !!child)
    .map((child) => child.props.id)
    .filter((id) => id !== undefined)
    .reduce((acc, cur) => {
      if (cur === 'measures') {
        return [...acc, `${cur}_1_text`]
      }
      return [...acc, `${cur}_light`, `${cur}_text`]
    }, [])
  const values = useSelector(({ form }) => form.data)
  const getProgressIcon = () => {
    if (!hasBeenClosed) return null

    // checking that every id of a field is either not required or there is some input
    if (ids.every((id) => requiredFormIds.indexOf(id) === -1 || values[id])) {
      return <i className="icon check" style={{ color: 'green' }} />
    }

    return <i className="icon close" style={{ color: 'red' }} />
  }

  const textValuesOverLimit = () => {
    return ids
      .filter((id) => id.indexOf('text') !== -1)
      .some((id) => values[id] && values[id].length > 1000)
  }

  return (
    <>
      <div
        data-cy={`form-section-${number}`}
        className="section-flex"
        onClick={() => {
          setCollapsed(!collapsed)
        }}
      >
        <h2 style={{ margin: '0', maxWidth: '650px' }}>
          <span style={{ color: colors.theme_blue }}>{number}</span> - {title}
        </h2>
        {!viewOnly && (
          <div>
            <i className={collapsed ? 'icon plus' : 'icon minus'} style={{ color: '#007290' }} />
            {getProgressIcon()}
          </div>
        )}
      </div>
      {(!collapsed || viewOnly) && (
        <>
          {children}
          {!viewOnly && (
            <div style={{ marginTop: '2em' }}>
              {textValuesOverLimit() ? (
                <>
                  <Button
                    data-cy={`form-section-${number}-nextbutton`}
                    primary
                    style={{ width: '150px' }}
                    disabled={textValuesOverLimit()}
                  >
                    Next
                  </Button>{' '}
                  <span style={{ color: 'red' }}>One or more answers that are too long</span>
                </>
              ) : (
                <Button
                  data-cy={`form-section-${number}-nextbutton`}
                  primary
                  style={{ width: '150px' }}
                  disabled={textValuesOverLimit()}
                  onClick={() => {
                    setHasBeenClosed(true)
                    setCollapsed(true)
                  }}
                >
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </>
  )
}

export default Section
