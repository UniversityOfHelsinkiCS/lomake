import React, { useState } from 'react'
import { Divider, Grid, Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PieChart } from 'react-minimal-pie-chart'

import { colors } from 'Utilities/common'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const levels = ['bachelor', 'master', 'doctoral']
const colorsList = ['green', 'yellow', 'red', 'gray']

const Pie = ({ level, data }) => {
  return (
    <div className="pie-box">
      <PieChart
        animationEasing="ease-out"
        data={[
          {
            color: '#9dff9d',
            value: data[level]?.green.length || 0,
          },
          {
            color: '#ffffb1',
            value: data[level]?.yellow.length || 0,
          },
          {
            color: '#ff7f7f',
            value: data[level]?.red.length || 0,
          },
          {
            color: '#e6e6e6',
            value: data[level]?.gray.length || 0,
          },
        ]}
        paddingAngle={0}
        startAngle={0}
      />
    </div>
  )
}

const ProgrammeList = ({ data, lang }) => {
  return (
    <>
      {colorsList.map(color => {
        return data[color].map(p => {
          return (
            <p key={`${p[lang]}`}>
              <span className={`answer-circle-${color}`} /> <span style={{ marginLeft: '0.5em' }}>{p[lang]}</span>
            </p>
          )
        })
      })}
    </>
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
  const lang = useSelector(state => state.language)
  const [showText, setShowText] = useState(false)

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
        {levels.map(level => {
          return (
            <div className="traffic-light-row" key={level}>
              <label className="traffic-light-row-label">{t(level)}</label>
              <TrafficLights id={`${id}_${level}`} form={form} />
            </div>
          )
        })}
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
              {levels.map(level => {
                return (
                  <Grid.Column width={5} key={level}>
                    <Pie level={level} data={summaryData} />
                  </Grid.Column>
                )
              })}
              <Grid.Column width={1}>
                <Icon name={`angle ${showText ? 'up' : 'down'}`} onClick={() => setShowText(!showText)} />
              </Grid.Column>
            </Grid.Row>
            {showText && (
              <Grid.Row className="row">
                <Grid.Column width={5}>
                  <ProgrammeList data={summaryData.bachelor} lang={lang} />
                </Grid.Column>
                <Grid.Column width={5}>
                  <ProgrammeList data={summaryData.master} lang={lang} />
                </Grid.Column>
                <Grid.Column width={5}>
                  <ProgrammeList data={summaryData.doctoral} lang={lang} />
                </Grid.Column>
              </Grid.Row>
            )}
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
