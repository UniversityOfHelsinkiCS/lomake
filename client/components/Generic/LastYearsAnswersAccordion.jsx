import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { colors } from '../../util/common'
import './Generic.scss'

const LastYearsAnswersAccordion = ({ children }) => {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(false)
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)

  // When viewing old answers, theres really no need to show even "older" answers.
  if (viewingOldAnswers) return null

  return (
    <div className="hide-in-print-mode">
      {expanded && <blockquote>{children}</blockquote>}
      <span
        style={{
          cursor: 'pointer',
          color: colors.blue,
          float: 'right',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? t('generic:collapseText') : t('generic:expandText')}
      </span>
    </div>
  )
}

export default LastYearsAnswersAccordion
