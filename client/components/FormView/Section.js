import React from 'react'
import { InView } from 'react-intersection-observer'
import { colors } from 'Utilities/common'
import { useHistory } from 'react-router'

const Section = ({ title, number, children, programmeKey }) => {
  const history = useHistory()
  return (
    <>
      <div data-cy={`form-section-${number}`} id={number}>
        <InView
          as="div"
          onChange={(inView, entry) => {
            if (inView) {
              history.replace(`/form/${programmeKey}#${number}`)
            }
          }}
        >
          <h2
            style={{
              fontSize: '2em',
              padding: '1.5em 0.5em',
              margin: '1em 0',
              background: '#1B1C1D',
              borderRadius: '5px',
              color: 'white',
            }}
          >
            <span style={{ color: colors.theme_blue }}>{number || '0'}</span> - {title}
          </h2>
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
