import React, { useEffect, useState } from 'react'
import { Divider, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import studyPath from '../../assets/degreeReform/study_path.png'
import './Generic.scss'

const InfoBox = ({ id, label, description, extrainfo, image }) => {
  const { t } = useTranslation()
  const [accordion, setAccordion] = useState({ open: false, fetched: null, lines: 0 })
  let lines = 0
  useEffect(() => {
    lines = description.split(/\r\n|\r|\n/).length
    lines += label ? label.split(/\r\n|\r|\n/).length : 0
    lines += extrainfo ? extrainfo.split(/\r\n|\r|\n/).length : 0
    if (image) lines += 10
    if (lines < 4) {
      setAccordion({ open: true, fetched: true, lines })
    } else {
      setAccordion({ open: false, fetched: true, lines })
    }
  }, [])

  return (
    <div className="form-description-area">
      <Divider />

      <div
        className="infobox-description"
        id={`infobox-description-${id}`}
        style={{
          WebkitMaskImage:
            accordion.fetched && accordion.open ? null : 'linear-gradient(180deg, #000 60%, transparent)',
          maxHeight: accordion.fetched && accordion.open ? '' : '8em',
          overflow: accordion.fetched && accordion.open ? null : 'hidden',
        }}
      >
        {description && (
          <p
            style={{
              whiteSpace: 'pre-line',
              overflow: 'hidden',
            }}
            id="infobox-description-paragraph"
          >
            {description}
          </p>
        )}
        {extrainfo && <p className="form-question-extrainfo">{extrainfo}</p>}
        {label && (
          <p
            style={{
              whiteSpace: 'pre-line',
              overflow: 'hidden',
            }}
          >
            {' '}
            {label}
          </p>
        )}
        {image ? <img src={studyPath} alt="three-step" style={{ maxWidth: '100%', height: 'auto' }} /> : null}
      </div>
      {accordion.fetched && accordion.lines > 4 ? (
        <Button
          style={accordion.fetched && accordion.open ? null : { top: '-40px' }}
          className="infobox-button"
          content={accordion.open ? t('read-less') : t('read-more')}
          onClick={() => setAccordion({ ...accordion, open: !accordion.open })}
        />
      ) : null}
    </div>
  )
}

export default InfoBox
