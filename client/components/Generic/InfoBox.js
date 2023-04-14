import React, { useState } from 'react'
import { Divider, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { sanitize } from 'Utilities/common'
import './Generic.scss'

const InfoBox = ({ label, description, extrainfo, image }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className="form-description-area">
      <Divider />
      <div
        className="infobox-description"
        style={{
          WebkitMaskImage: open ? null : 'linear-gradient(180deg, #000 60%, transparent)',
          height: open ? 'auto' : '8em',
        }}
      >
        {description && sanitize(description)}
        {extrainfo && <p className="form-question-extrainfo">{extrainfo}</p>}
        {label && <p> {label}</p>}
        {image ? (
          <b>
            <Link to={image.link} target="_blank">
              {image.text}
            </Link>
          </b>
        ) : null}
      </div>
      <Button
        style={open ? null : { top: '-40px' }}
        className="infobox-button"
        content="Read more"
        onClick={() => setOpen(!open)}
      />
    </div>
  )
}

export default InfoBox
