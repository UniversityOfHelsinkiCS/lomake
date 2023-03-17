import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Grid, Icon } from '@mui/material'

const colorCircle = color => {
  return <span className={`answer-circle-${color || 'gray'}`} />
}

const measuresCount = count => {
  return <span className="measures-count-circle">{count}</span>
}

const SummaryRow = ({ answer, lang, k, years, t }) => {
  const [showText, setShowText] = useState(false)

  return (
    <>
      <Grid.Row className="row" key={k}>
        <Grid spacing={3}>{answer.details.shortLabel[lang]}</Grid>
        {years.map(year => {
          return (
            <Grid spacing={4}>
              {answer[year].count ? measuresCount(answer[year].count) : colorCircle(answer[year].light)}
            </Grid>
          )
        })}
        <Grid spacing={1}>
          <Icon name={`angle ${showText ? 'up' : 'down'}`} onClick={() => setShowText(!showText)} />
        </Grid>
      </Grid.Row>
      {showText && (
        <Grid.Row className="row" key={`${k}-text`}>
          <Grid spacing={3}>
            <p style={{ paddingBottom: '1em' }}>
              <i>{answer.details.description[lang]}</i>
            </p>
            <p>
              <i>{answer.details.extrainfo[lang]}</i>
            </p>
          </Grid>
          {years.map(year => {
            return (
              <Grid width={4} className="old-answer-text">
                {answer[year].text || t('empty')}
              </Grid>
            )
          })}
          <Grid width={1} />
        </Grid.Row>
      )}
    </>
  )
}

const OldAnswersSummary = ({ partId, relatedYearlyAnswers }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)

  if (!relatedYearlyAnswers) {
    return null
  }
  const years = [2020, 2021, 2022]
  const keys = Object.keys(relatedYearlyAnswers)

  return (
    <div className="summary-container">
      <h4>Teemaan liittyvien vuosiseurantakysymysten vastaukset tarkastelujaksolta</h4>
      <div className="summary-grid" data-cy={`${partId}-summary`}>
        <Grid columns={5}>
          <Grid className="row">
            <Grid spacing={3}> </Grid>
            {years.map(year => {
              return <Grid width={4}>{year}</Grid>
            })}
            <Grid spacing={1} />
          </Grid>
          {keys.map(k => {
            return <SummaryRow answer={relatedYearlyAnswers[k]} lang={lang} k={k} years={years} t={t} />
          })}
        </Grid>
      </div>
    </div>
  )
}

export default OldAnswersSummary
