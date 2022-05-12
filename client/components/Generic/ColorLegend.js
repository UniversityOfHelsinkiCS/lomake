import React from 'react'
import { useSelector } from 'react-redux'
import { Segment } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'
import './Generic.scss'

const ColorLegend = () => {
  const lang = useSelector(state => state.language)

  return (
    <Segment compact textAlign="left">
      <p>
        <span className="answer-circle-green" /> {translations.positive[lang]}
      </p>
      <p>
        <span className="answer-circle-yellow" /> {translations.neutral[lang]}
      </p>
      <p>
        <span className="answer-circle-red" /> {translations.negative[lang]}
      </p>
      <p>
        <span className="answer-circle-gray" /> {translations.empty[lang]}
      </p>
      <p className="report-side-note">{translations.noColors[lang]}</p>
    </Segment>
  )
}

export default ColorLegend
