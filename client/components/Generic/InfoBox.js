import React from 'react'
import { Divider } from 'semantic-ui-react'
// import { useTranslation } from 'react-i18next'

import { colors } from 'Utilities/common'
import studyPath from 'Assets/koulutusuudistus/study_path.png'
import './Generic.scss'

const InfoBox = ({ label, description, extrainfo, image }) => {
  return (
    <div className="form-entity-area">
      <Divider />
      <div
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_light_gray,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
          fontSize: '16px',
        }}
      >
        <p style={{ whiteSpace: 'pre-line' }}>{description}</p>
        <p className="form-question-extrainfo">{extrainfo}</p>
        <br />
        {label}
        {image ? <img src={studyPath} alt={image.alt} /> : null}
      </div>
    </div>
  )
}

export default InfoBox
