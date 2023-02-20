import React from 'react'
import { Divider } from 'semantic-ui-react'
// import { useTranslation } from 'react-i18next'

import { colors } from 'Utilities/common'
import './Generic.scss'

// const mapColorToValid = {
//   VIHREÄ: 'green',
//   KELTAINEN: 'yellow',
//   PUNAINEN: 'red',
// }

const InfoBox = ({
  // id,
  label,
  description,
  // required,
  // noColor,
  // number,
  // previousYearsAnswers,
  extrainfo,
  // radioOptions,
}) => {
  // const { t } = useTranslation()
  // const [state, setState] = useState({ value: '' })

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
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
        <br />
        {label}
      </div>
    </div>
  )
}

export default InfoBox
