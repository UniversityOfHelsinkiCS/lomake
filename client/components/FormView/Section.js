import React from 'react'
import { InView } from 'react-intersection-observer'
import { colors } from 'Utilities/common'
import { useHistory } from 'react-router'

const Section = ({ title, number, children, programmeKey }) => {
  const history = useHistory()
  return (
    <>
      <div data-cy={`form-section-${number}`} className="section-flex" id={number}>
        <InView
          as="div"
          onChange={(inView, entry) => {
            if (inView) {
              history.replace(`/form/${programmeKey}#${number}`)
            }
          }}
        >
          <h2 style={{ fontSize: '2em' }}>
            <span style={{ color: colors.theme_blue }}>{number}</span> - {title}
          </h2>
        </InView>
      </div>
      {children}
    </>
  )
}

export default Section
