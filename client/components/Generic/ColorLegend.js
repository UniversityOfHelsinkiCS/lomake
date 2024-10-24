import React from 'react'
import { Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import './Generic.scss'
import { formKeys } from '@root/config/data'

const ColorLegend = () => {
  const { t } = useTranslation()
  const form = useSelector(({ filters }) => filters.form)

  if (form === formKeys.META_EVALUATION) {
    return (
      <Segment>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-red" />
          {t('urgent')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-yellow" />
          {t('semiUrgent')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-green" />
          {t('nonUrgent')}
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="big-circle-gray" />
          {t('irrelevant')}
        </div>
      </Segment>
    )
  }

  return (
    <Segment compact textAlign="left">
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
    </Segment>
  )
}

export default ColorLegend
