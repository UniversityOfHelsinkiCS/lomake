import React from 'react'
import { Divider } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
// import { PieChart } from 'react-minimal-pie-chart'

import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

// const mapColorToValid = {
//   VIHREÄ: 'green',
//   KELTAINEN: 'yellow',
//   PUNAINEN: 'red',
// }

const EntityLevels = ({
  id,
  label,
  description,
  required,
  // noColor,
  number,
  extrainfo,
  // formType,
  // summaryData,
  form,
  // summaryUrl,
}) => {
  const { t } = useTranslation()
  // console.log(summaryData)

  // const level = 'master'
  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '500px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
        <div>
          <TrafficLights id={`${id}_bachelor`} form={form} />
          <label>{t('bachelor')}</label>
        </div>
        <div>
          <TrafficLights id={`${id}_master`} form={form} />
          <label>{t('master')}</label>
        </div>
        <div>
          <TrafficLights id={`${id}_doctor`} form={form} />
          <label>{t('doctoral')}</label>
        </div>
      </div>
      <div
        className="entity-description"
        style={{
          lineHeight: 2,
          backgroundColor: colors.background_beige,
          padding: '1em',
          borderRadius: '5px',
          margin: '1em 0',
        }}
      >
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>
      {/* <PieChart
        animationDuration={500}
        animationEasing="ease-out"
        center={[50, 50]}
        data={[
          {
            color: '#9dff9d',
            value: summaryData[level]?.green || 0,
          },
          {
            color: '#ffffb1',
            value: summaryData[level]?.yellow || 0,
          },
          {
            color: '#ff7f7f',
            value: summaryData[level]?.red || 0,
          },
        ]}
        labelPosition={50}
        lengthAngle={360}
        lineWidth={100}
        paddingAngle={0}
        radius={50}
        startAngle={0}
        viewBoxSize={[600, 600]}
      /> */}
      {/* {formType === 'evaluation' && (
        <Link data-cy="link-to-old-answers" to={summaryUrl} target="_blank">
          <p style={{ marginTop: '1em' }}>Kaikki vuosiseurannan vuodet</p>
        </Link>
      )} */}
      <Textarea id={id} label={t('generic:textAreaLabel')} EntityLastYearsAccordion={null} form={form} />
    </div>
  )
}

export default EntityLevels
