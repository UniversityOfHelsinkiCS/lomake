import React from 'react'
import { Divider } from 'semantic-ui-react'
// import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import sanitizeHtml from 'sanitize-html'

import './Generic.scss'

const InfoBox = ({ label, description, extrainfo, image }) => {
  return (
    <div className="form-entity-area">
      <Divider />
      <div
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: 'RGB(203, 203, 203, 1)',
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
          fontSize: '16px',
        }}
      >
        {description && (
          <p dangerouslySetInnerHTML={{ __html: sanitizeHtml(description) }} style={{ whiteSpace: 'pre-line' }} />
        )}
        {extrainfo && <p className="form-question-extrainfo">{extrainfo}</p>}
        {label && <p> {label}</p>}
        {image ? (
          <b>
            <Link to={image.link} target="_blank" />
          </b>
        ) : null}
      </div>
    </div>
  )
}

export default InfoBox
