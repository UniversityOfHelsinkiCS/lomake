import React from 'react'
import { useSelector } from 'react-redux'
// import { useTranslation } from 'react-i18next'
import { Grid, Icon } from 'semantic-ui-react'

const OldAnswersSummary = ({ partId, relatedYearlyAnswers }) => {
  // const { t } = useTranslation()
  const lang = useSelector(state => state.language)

  if (!relatedYearlyAnswers) {
    return null
  }

  const keys = Object.keys(relatedYearlyAnswers)

  return (
    <div className="summary-container">
      <h4>Teemaan liittyvien vuosiseurantakysymyksien vastaukset</h4>
      <div className="summary-grid" data-cy={`${partId}-summary`}>
        <Grid columns={5}>
          <Grid.Row className="row">
            <Grid.Column> </Grid.Column>
            <Grid.Column> 2020</Grid.Column>
            <Grid.Column> 2021</Grid.Column>
            <Grid.Column> 2022</Grid.Column>
            <Grid.Column />
          </Grid.Row>
          {keys.map(k => {
            return (
              <Grid.Row className="row">
                <Grid.Column>{relatedYearlyAnswers[k].details.shortLabel[lang]}</Grid.Column>
                <Grid.Column>{relatedYearlyAnswers[k][2020].light}</Grid.Column>
                <Grid.Column>{relatedYearlyAnswers[k][2021].light}</Grid.Column>
                <Grid.Column>{relatedYearlyAnswers[k][2022].light}</Grid.Column>
                <Grid.Column>
                  <Icon name="angle down" />
                </Grid.Column>
              </Grid.Row>
            )
          })}
        </Grid>
      </div>
    </div>
  )
}

export default OldAnswersSummary
