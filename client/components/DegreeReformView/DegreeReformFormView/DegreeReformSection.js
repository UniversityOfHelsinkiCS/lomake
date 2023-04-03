import React from 'react'
import { InView } from 'react-intersection-observer'
import { basePath, colors } from 'Utilities/common'

const Section = ({ title, number, children, programmeKey, formType }) => {
  let historyState = `${window.location.origin}${basePath}${formType}/form/${programmeKey}#${number}`
  if (formType === 'degree-reform-individual') {
    historyState = `${window.location.origin}${basePath}${formType}/form/`
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
              background: 'rgb(133 188 243)',
              borderRadius: '5px',
              color: colors.grey,
            }}
          >
            {title}
          </h2>
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
