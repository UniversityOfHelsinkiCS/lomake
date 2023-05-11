import React from 'react'
import { Divider, Grid, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { PieChart } from 'react-minimal-pie-chart'

import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const Pie = ({ level, data }) => {
  return (
    <div className="pie-box">
      <PieChart
        animationEasing="ease-out"
        data={[
          {
            color: '#9dff9d',
            value: data[level]?.green || 0,
          },
          {
            color: '#ffffb1',
            value: data[level]?.yellow || 0,
          },
          {
            color: '#ff7f7f',
            value: data[level]?.red || 0,
          },
          {
            color: '#e6e6e6',
            value: data[level]?.empty || 0,
          },
        ]}
        paddingAngle={0}
        startAngle={0}
      />
    </div>
  )
}

const EntityLevels = ({
  id,
  label,
  description,
  required,
  number,
  extrainfo,
  summaryData,
  form,
  // summaryUrl,
}) => {
  const { t } = useTranslation()

  const showText = false
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
      <div className="level-lights-container">
        <div className="traffic-light-row">
          <label className="traffic-light-row-label">{t('bachelor')}</label>
          <TrafficLights id={`${id}_bachelor`} form={form} />
        </div>
        <div className="traffic-light-row">
          <label className="traffic-light-row-label">{t('master')}</label>
          <TrafficLights id={`${id}_master`} form={form} />
        </div>
        <div className="traffic-light-row">
          <label className="traffic-light-row-label">{t('doctoral')}</label>
          <TrafficLights id={`${id}_doctor`} form={form} />
        </div>
      </div>
      <div className="summary-container">
        <h4>Tiedekunnan koulutusohjelmien johtoryhmät vastasivat tähän teemaan seuraavasti:</h4>
        <div className="summary-grid" data-cy={`${id}-summary`}>
          <Grid columns={4}>
            <Grid.Row className="row">
              <Grid.Column width={5}>{t('bachelor')}</Grid.Column>
              <Grid.Column width={5}>{t('master')}</Grid.Column>
              <Grid.Column width={5}>{t('doctoral')}</Grid.Column>
              <Grid.Column width={1} />
            </Grid.Row>
            <Grid.Row className="row">
              <Grid.Column width={5}>
                <Pie level="bachelor" data={summaryData} />
              </Grid.Column>
              <Grid.Column width={5}>
                <Pie level="master" data={summaryData} />
              </Grid.Column>
              <Grid.Column width={5}>
                <Pie level="doctoral" data={summaryData} />
              </Grid.Column>
              <Grid.Column width={1}>
                <Icon name={`angle ${showText ? 'up' : 'down'}`} />
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
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
