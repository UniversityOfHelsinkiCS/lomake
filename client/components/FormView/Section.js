import React from 'react'
import { InView } from 'react-intersection-observer'

const Section = ({ title, number, children, programmeKey }) => {
  return (
    <>
      <div data-cy={`form-section-${number}`} id={number || '0'}>
        <InView
          as="div"
          onChange={(inView) => {
            if (inView) {
              window.history.pushState({}, '', `/form/${programmeKey}#${number}`)
            }
          }}
        >
          <h2
            className="form-section-header"
            style={{
              fontSize: '2em',
              padding: '1.5em 0.5em',
              margin: '7em 0em 1em 0em',
              background: '#1B1C1D',
              borderRadius: '5px',
              color: 'white',
            }}
          >
            {number || '0'} - {title}
          </h2>
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
