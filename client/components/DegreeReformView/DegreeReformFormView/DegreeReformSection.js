import React from 'react'
import { InView } from 'react-intersection-observer'
import { basePath, colors } from 'Utilities/common'

const Section = ({ title, number, children, programmeKey, form }) => {
  let historyState = `${window.location.origin}${basePath}${form}/form/${programmeKey}#${number}`
  if (form === 'degree-reform-individual') {
    historyState = `${window.location.origin}${basePath}${form}/form/`
  }

  return (
    <>
      <div data-cy={`form-section-${number}`} id={number || '0'}>
        <InView
          as="div"
          onChange={inView => {
            if (inView) {
              window.history.pushState({}, '', historyState)
            }
          }}
        >
          <h2
            className="form-section-header"
            style={{
              fontSize: '2em',
              padding: '1.5em 0.5em',
              margin: '4em 0em 1em 0em',
              background: colors.background_black,
              borderRadius: '5px',
              color: colors.white,
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
