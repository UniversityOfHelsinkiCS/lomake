import React from 'react'
import { Paper } from '@mui/material'
import { useTranslation } from 'react-i18next'
import './Generic.scss'

const ColorLegend = () => {
  const { t } = useTranslation()

  return (
    <Paper compact textAlign="left">
      <p>
        <span className="answer-circle-green" /> {t('positive')}
      </p>
      <p>
        <span className="answer-circle-yellow" /> {t('neutral')}
      </p>
      <p>
        <span className="answer-circle-red" /> {t('negative')}
      </p>
      <p>
        <span className="answer-circle-gray" /> {t('EMPTY')}
      </p>
      <p className="report-side-note">{t('noColors')}</p>
    </Paper>
  )
}

export default ColorLegend
