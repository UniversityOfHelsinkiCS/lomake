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
              background: '#F8F8F9',
              borderRadius: '5px',
              border: '1px solid',
              borderColor: '#9ed0e2',
            }}
          >
            <span style={{ color: colors.theme_blue }}>{number}</span> - {title}
          </h2>
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
