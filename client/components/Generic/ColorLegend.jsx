import React from 'react'
import { Segment } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import './Generic.scss'
import { formKeys } from '../../../config/data'

const LegendItem = ({ colorClass, text }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <div className={colorClass} />
    {text}
  </div>
)

const ColorLegend = () => {
  const { t } = useTranslation()
  const form = useSelector(({ filters }) => filters.form)

  const legends = {
    [formKeys.FACULTY_MONITORING]: [
      { colorClass: 'big-circle-red', text: t('facultyTracking:red') },
      { colorClass: 'big-circle-yellow', text: t('facultyTracking:yellow') },
      { colorClass: 'big-circle-green', text: t('facultyTracking:green') },
    ],
    [formKeys.META_EVALUATION]: [
      { colorClass: 'big-circle-red', text: t('urgent') },
      { colorClass: 'big-circle-yellow', text: t('semiUrgent') },
      { colorClass: 'big-circle-green', text: t('nonUrgent') },
      { colorClass: 'big-circle-gray', text: t('irrelevant') },
    ],
    default: [
      { colorClass: 'big-circle-green', text: t('positive') },
      { colorClass: 'big-circle-yellow', text: t('neutral') },
      { colorClass: 'big-circle-red', text: t('negative') },
      { colorClass: 'big-circle-gray', text: t('EMPTY') },
    ],
  }

  const selectedLegends = legends[form] || legends.default

  return (
    <Segment compact={form !== formKeys.FACULTY_MONITORING && form !== formKeys.META_EVALUATION} textAlign="left">
      {selectedLegends.map(({ colorClass, text }) => (
        <LegendItem colorClass={colorClass} text={text} />
      ))}
      {form === undefined && <p className="report-side-note">{t('noColors')}</p>}
    </Segment>
  )
}

export default ColorLegend
