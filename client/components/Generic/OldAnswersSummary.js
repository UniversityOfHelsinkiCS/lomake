import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Grid, Icon } from 'semantic-ui-react'

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
        <Grid.Column width={3}>{answer.details.shortLabel[lang]}</Grid.Column>
        {years.map(year => {
          return (
            <Grid.Column width={4} key={year}>
              {answer[year]?.count ? measuresCount(answer[year].count) : colorCircle(answer[year]?.light)}
            </Grid.Column>
          )
        })}
        <Grid.Column width={1}>
          <Icon name={`angle ${showText ? 'up' : 'down'}`} onClick={() => setShowText(!showText)} />
        </Grid.Column>
      </Grid.Row>
      {showText && (
        <Grid.Row className="row" key={`${k}-text`}>
          <Grid.Column width={3}>
            <p style={{ paddingBottom: '1em' }}>
              <i>{answer.details.description[lang]}</i>
            </p>
            <p>
              <i>{answer.details.extrainfo[lang]}</i>
            </p>
          </Grid.Column>
          {years.map(year => {
            return (
              <Grid.Column width={4} className="old-answer-text" key={year}>
                {answer[year].text || t('empty')}
              </Grid.Column>
            )
          })}
          <Grid.Column width={1} />
        </Grid.Row>
      )}
    </>
  )
}

const OldAnswersSummary = ({ partId, relatedYearlyAnswers }) => {
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)

  if (Object.entries(relatedYearlyAnswers).length === 0) {
    return null
  }
  const years = [2021, 2022, 2023]
  const keys = Object.keys(relatedYearlyAnswers)

  return (
    <div className="summary-container">
      <h4>{t('formView:progSummaryTitle')}</h4>
      <div className="summary-grid" data-cy={`${partId}-summary`}>
        <Grid columns={5}>
          <Grid.Row className="row">
            <Grid.Column width={3}> </Grid.Column>
            {years.map(year => {
              return (
                <Grid.Column width={4} key={year}>
                  {year}
                </Grid.Column>
              )
            })}
            <Grid.Column width={1} />
          </Grid.Row>
          {keys.map(k => {
            return <SummaryRow answer={relatedYearlyAnswers[k]} lang={lang} k={k} years={years} t={t} key={k} />
          })}
        </Grid>
      </div>
    </div>
  )
}

export default OldAnswersSummary
