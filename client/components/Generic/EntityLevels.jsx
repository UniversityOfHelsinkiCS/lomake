import React, { useState } from 'react'
import { Divider, Grid, Icon, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PieChart } from 'react-minimal-pie-chart'
import { colors } from '../../util/common'
import ReactMarkdown from 'react-markdown'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const colorsList = ['green', 'yellow', 'red', 'gray']

const Pie = ({ level, data, onlyBc }) => {
  if (level !== 'bachelor' && onlyBc) {
    return <div />
  }

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

const ProgrammeList = ({ data, lang, onlyBc, showText, showSpecific, handleShowSpecific }) => {
  if (onlyBc) {
    return <div />
  }
  if (!data) {
    return <div>No data</div>
  }
  return (
    <>
      {colorsList.map(color => {
        return data[color].map(p => {
          return (
            <div key={p.key}>
              <p key={`${p.name[lang]}`}>
                <span className={`answer-circle-${color}`} />{' '}
                <span
                  className="programme-list-button"
                  onClick={() => handleShowSpecific(p.key)}
                  style={{ marginLeft: '0.5em' }}
                >
                  {p.name[lang]}
                </span>
              </p>
              {(showText || showSpecific[p.key]) && data.text[p.key] && (
                <ReactMarkdown>{data.text[p.key]}</ReactMarkdown>
              )}
            </div>
          )
        })
      })}
    </>
  )
}

const EntityLevels = ({ id, label, description, required, number, extrainfo, summaryData, form, programme }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const [showProgrammes, setShowProgrammes] = useState(false)
  const [showText, setShowText] = useState({})
  const [showSpecific, setShowSpecific] = useState([])
  const onlyBc = programme === 'H74'

  const hideLevels = id === 'transition_phase_faculty'
  const levels = hideLevels ? ['bachelor', 'master'] : ['bachelor', 'master', 'doctoral']

  const handleShowText = level => {
    if (showText.level === level) {
      setShowText({})
      return true
    }

    setShowText({ level })
    return true
  }

  const handleShowSpecific = programme => {
    if (!showSpecific[programme]) {
      setShowSpecific({ ...showSpecific, [programme]: true })
    } else {
      setShowSpecific({ ...showSpecific, [programme]: !showSpecific[programme] })
    }
  }

  const getStyleForm = level => {
    if (showText?.level === level) {
      return {
        fontStyle: 'italic',
        background: '#CDCDCD',
        padding: 10,
      }
    }
    return {
      padding: 10,
    }
  }

  const textAreaLabel = ['faculty_studyprogramme_status', 'faculty_where_are_we_in_five_years'].includes(id)
    ? t('generic:textAreaLabelQ12and13')
    : t('generic:textAreaLabel')

  const summaryTitle = form !== 6 ? 'formView:facultySummaryTitle' : 'formView:universitySummaryTitle'

  return (
    <div className="form-entity-area">
      <Divider />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ maxWidth: '1000px' }}>
          <h3>
            {number}. {label}{' '}
            {required && <span style={{ color: colors.red, marginLeft: '0.2em', fontWeight: '600' }}>*</span>}
          </h3>
        </div>
      </div>
      <div className="entity-description">
        {description}
        <p className="form-question-extrainfo">{extrainfo}</p>
      </div>

      <div className="level-lights-container">
        {!onlyBc ? (
          levels.map(level => {
            return (
              <div className="traffic-light-row" key={level}>
                <label className="traffic-light-row-label">{t(level)}</label>
                <TrafficLights id={`${id}_${level}`} form={form} />
              </div>
            )
          })
        ) : (
          <div className="traffic-light-row">
            <label className="traffic-light-row-label">{t('bachelor')}</label>
            <TrafficLights id={`${id}_bachelor`} form={form} />
          </div>
        )}
      </div>
      <div className="summary-container">
        <h4>{t(summaryTitle)}</h4>
        <div className="summary-grid" data-cy={`${id}-summary`}>
          <Grid columns={4}>
            <Grid.Row className="row">
              {levels.map(level => {
                if (level === 'doctoral' && hideLevels) return null
                if (onlyBc && level === 'master') return null
                return (
                  <Grid.Column key={`${id}-summary-labels-${level}`} width={5} style={getStyleForm(level)}>
                    {t(level)}
                  </Grid.Column>
                )
              })}
              <Grid.Column width={1} />
            </Grid.Row>
            <Grid.Row className="row">
              {levels.map(level => {
                return (
                  <Grid.Column width={5} key={level}>
                    <Pie level={level} data={summaryData} onlyBc={onlyBc} />
                    {Object.keys(showText).length > 0 && (
                      <Button style={{ marginTop: '1em' }} onClick={() => handleShowText(level, !showText[level])}>
                        {showText?.level === level ? t('formView:hideAnswers') : t('formView:showAnswers')}
                      </Button>
                    )}
                  </Grid.Column>
                )
              })}
              <Grid.Column width={1}>
                <Icon
                  name={`angle ${showProgrammes ? 'up' : 'down'}`}
                  onClick={() => setShowProgrammes(!showProgrammes)}
                />
              </Grid.Column>
            </Grid.Row>
            {Object.keys(showText).length > 0 && (
              <Grid.Row className="row">
                {showText.level &&
                  summaryData[showText.level] &&
                  colorsList.map(color => {
                    return summaryData[showText.level][color].map(p => {
                      return (
                        <div key={p.key} style={{ marginRight: '1em', marginTop: '1em' }}>
                          <p key={`${p.name[lang]}`}>
                            <span className={`answer-circle-${color}`} />{' '}
                            <span
                              className="programme-list-button"
                              onClick={() => handleShowSpecific(p.key)}
                              style={{ marginLeft: '0.5em' }}
                            >
                              {p.name[lang]}
                            </span>
                          </p>
                          {(Object.keys(showText).length > 0 || showSpecific[p.key]) &&
                            summaryData[showText.level].text[p.key] && (
                              <ReactMarkdown>{summaryData[showText.level].text[p.key]}</ReactMarkdown>
                            )}
                        </div>
                      )
                    })
                  })}
              </Grid.Row>
            )}
            {showProgrammes && Object.keys(showText).length === 0 && (
              <Grid.Row className="row">
                {['bachelor', 'master', 'doctoral'].map(level => {
                  if (level === 'doctoral' && hideLevels) return null
                  return (
                    <Grid.Column width={5} key={`${id}-summary-programme-list-${level}`}>
                      <ProgrammeList
                        data={summaryData[level]}
                        lang={lang}
                        onlyBc={false}
                        showText={showText[level]}
                        showSpecific={showSpecific}
                        handleShowSpecific={handleShowSpecific}
                      />
                      <Button onClick={() => handleShowText(level, !showText[level])}>
                        {showText === level ? t('formView:hideAnswers') : t('formView:showAnswers')}
                      </Button>
                    </Grid.Column>
                  )
                })}
              </Grid.Row>
            )}
          </Grid>
        </div>
      </div>
      <Textarea id={id} label={textAreaLabel} EntityLastYearsAccordion={null} form={form} />
    </div>
  )
}

export default EntityLevels
