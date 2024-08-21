import React from 'react'
import { InView } from 'react-intersection-observer'
import { basePath, colors } from '../../../util/common'
import { formKeys } from '../../../../config/data'

const Section = ({ title, number, children, programmeKey, form }) => {
  let id = ''

  if (form === formKeys.EVALUATION_FACULTIES || form === formKeys.FACULTY_MONITORING) {
    id = '-faculty'
  } else if (form === formKeys.EVALUATION_COMMTTEES) {
    id = '-university'
  }

  const url = `${window.location.origin}${basePath}evaluation${id}/form/${form}/${programmeKey}#${number}`

  return (
    <>
      <div data-cy={`form-section-${number}`} id={number || '0'}>
        <InView
          as="div"
          onChange={inView => {
            if (form !== 7 && inView) {
              window.history.pushState({}, '', url)
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
