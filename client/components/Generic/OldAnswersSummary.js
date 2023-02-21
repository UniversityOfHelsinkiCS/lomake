import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Grid, Icon } from 'semantic-ui-react'

const colorCircle = color => {
  return <span className={`answer-circle-${color || 'gray'}`} />
}

const SummaryRow = ({ answer, lang, k, years, t }) => {
  const [showText, setShowText] = useState(false)

  return (
    <>
      <Grid.Row className="row" key={k}>
        <Grid.Column>{answer.details.shortLabel[lang]}</Grid.Column>
        {years.map(year => {
          return <Grid.Column>{colorCircle(answer[year].light)}</Grid.Column>
        })}
        <Grid.Column>
          <Icon name={`angle ${showText ? 'up' : 'down'}`} onClick={() => setShowText(!showText)} />
        </Grid.Column>
      </Grid.Row>
      {showText && (
        <Grid.Row className="row" key={`${k}-text`}>
          <Grid.Column>
            <p style={{ paddingBottom: '1em' }}>
              <i>{answer.details.description[lang]}</i>
            </p>
            <p>
              <i>{answer.details.extrainfo[lang]}</i>
            </p>
          </Grid.Column>
          {years.map(year => {
            return <Grid.Column>{answer[year].text || t('empty')}</Grid.Column>
          })}
          <Grid.Column />
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
      <h4>Teemaan liittyvien vuosiseurantakysymyksien vastaukset tarkastelujaksolta</h4>
      <div className="summary-grid" data-cy={`${partId}-summary`}>
        <Grid columns={5}>
          <Grid.Row className="row">
            <Grid.Column> </Grid.Column>
            {years.map(year => {
              return <Grid.Column>{year}</Grid.Column>
            })}
            <Grid.Column />
          </Grid.Row>
          {keys.map(k => {
            return <SummaryRow answer={relatedYearlyAnswers[k]} lang={lang} k={k} years={years} t={t} />
          })}
        </Grid>
      </div>
    </div>
  )
}

export default OldAnswersSummary
