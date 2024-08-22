import React from 'react'
import { colors } from 'Utilities/common'

const FacultyLevelSection = ({ title, number, children, faculty }) => {
  return (
    <>
      <div data-cy={`form-section-${number}`} id={number || '0'}>
        <h2
          className="form-section-header"
          style={{
            fontSize: '2em',
            padding: '1.5em 0.5em',
            margin: '1.5em 0em 1em 0em',
            background: colors.background_black,
            borderRadius: '5px',
            color: colors.white,
          }}
        >
          {title}
        </h2>
      </div>
      {children}
    </>
  )
}

export default FacultyLevelSection
