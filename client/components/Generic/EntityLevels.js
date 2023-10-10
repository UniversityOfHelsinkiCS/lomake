import React, { useState } from 'react'
import { Divider, Grid, Icon, Button } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { PieChart } from 'react-minimal-pie-chart'
import { Link } from 'react-router-dom'
import { colors } from 'Utilities/common'
import ReactMarkdown from 'react-markdown'
import Textarea from './Textarea'
import TrafficLights from './TrafficLights'
import './Generic.scss'

const levels = ['bachelor', 'master', 'doctoral']
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

const EntityLevels = ({
  id,
  label,
  description,
  required,
  number,
  extrainfo,
  summaryData,
  form,
  programme,
  summaryUrl,
}) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const [showProgrammes, setShowProgrammes] = useState(false)
  const [showText, setShowText] = useState({})
  const [showSpecific, setShowSpecific] = useState([])
  const onlyBc = programme === 'H74'
  const evaluationSummaryURL = `/evaluation-faculty/programme-evaluation-summary/${programme}`

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
        <h4>{t('formView:facultySummaryTitle')}</h4>
        <div className="summary-grid" data-cy={`${id}-summary`}>
          <Grid columns={4}>
            <Grid.Row className="row">
              <Grid.Column width={5}>{t('bachelor')}</Grid.Column>
              <Grid.Column width={5}>{!onlyBc ? t('master') : ''}</Grid.Column>
              <Grid.Column width={5}>{!onlyBc ? t('doctoral') : ''}</Grid.Column>
              <Grid.Column width={1} />
            </Grid.Row>
            <Grid.Row className="row">
              {levels.map(level => {
                return (
                  <Grid.Column width={5} key={level}>
                    <Pie level={level} data={summaryData} onlyBc={onlyBc} />
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
            {showText && (
              <Grid.Row className="row">
                {showText.level &&
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
                          {(showText || showSpecific[p.key]) && summaryData[showText.level].text[p.key] && (
                            <ReactMarkdown>{summaryData[showText.level].text[p.key]}</ReactMarkdown>
                          )}
                        </div>
                      )
                    })
                  })}
              </Grid.Row>
            )}
            {showProgrammes && (
              <Grid.Row className="row">
                <Grid.Column width={5}>
                  <ProgrammeList
                    data={summaryData.bachelor}
                    lang={lang}
                    onlyBc={false}
                    showText={showText.bachelor}
                    showSpecific={showSpecific}
                    handleShowSpecific={handleShowSpecific}
                  />
                  <Button onClick={() => handleShowText('bachelor', !showText.bachelor)}>
                    {showText === 'bachelor' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                  </Button>
                </Grid.Column>
                <Grid.Column width={5}>
                  <ProgrammeList
                    data={summaryData.master}
                    lang={lang}
                    onlyBc={onlyBc}
                    showText={showText.master}
                    showSpecific={showSpecific}
                    handleShowSpecific={handleShowSpecific}
                  />
                  <Button onClick={() => handleShowText('master', !showText.master)}>
                    {showText === 'master' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                  </Button>
                </Grid.Column>
                <Grid.Column width={5}>
                  <ProgrammeList
                    data={summaryData.doctoral}
                    lang={lang}
                    onlyBc={onlyBc}
                    showText={showText.doctoral}
                    showSpecific={showSpecific}
                    handleShowSpecific={handleShowSpecific}
                  />
                  <Button onClick={() => handleShowText('doctoral', !showText.doctoral)}>
                    {showText === 'doctoral' ? t('formView:hideAnswers') : t('formView:showAnswers')}
                  </Button>
                </Grid.Column>
              </Grid.Row>
            )}
          </Grid>
        </div>
      </div>
      {form === 5 && (
        <>
          <Link data-cy="link-to-old-answers" to={summaryUrl} target="_blank">
            <p style={{ fontSize: '15px', marginTop: '1em' }}>{t('formView:allYearlyAnswerYears')}</p>
          </Link>
          <Link data-cy="link-to-old-answers" to={evaluationSummaryURL} target="_blank">
            <p style={{ fontSize: '15px', marginTop: '1em', marginBottom: '1em' }}>
              Katselmuksen yhteenveto koulutusohjelmittain
            </p>
          </Link>
        </>
      )}
      <Textarea id={id} label={t('generic:textAreaLabel')} EntityLastYearsAccordion={null} form={form} />
    </div>
  )
}

export default EntityLevels
