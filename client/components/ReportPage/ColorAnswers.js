import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import _ from 'lodash'

import PDFDownload from 'Components/Generic/PDFDownload'
import ColorLegend from 'Components/Generic/ColorLegend'
import PieChart from './PieChart'

const ColorAnswers = ({ year, allAnswers, questionsList, chosenProgrammes, setActiveTab, setShowing }) => {
  const { t } = useTranslation()
  const [showEmpty, setShowEmpty] = useState(true)
  const componentRef = useRef()
  const questions = useSelector(({ filters }) => filters.questions)

  if (chosenProgrammes.length < 1 || allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{t('noData')}</h3>
  }

  const getLabel = question => {
    if (!question) return ''
    const label = _.capitalize(question.label)
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${label}`
  }

  return (
    <div className="tab-pane" ref={componentRef}>
      <Grid className="header">
        <Grid.Row className="noprint">
          <Grid.Column floated="right">
            <div className="side-note-large">
              <PDFDownload componentRef={componentRef} />
            </div>
            <p className="report side-note-small">{t('report:pdfNotification')}</p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Column width={4} className="left" />
        <Grid.Column width={6} className="center">
          {year} - {t('trafficLights')}
        </Grid.Column>
        <Grid.Column width={5} className="right" floated="right" />
      </Grid>
      <div className="ui divider" />
      <Grid centered>
        <Grid.Row textAlign="left">
          <ColorLegend />
        </Grid.Row>
        <Grid.Row className="noprint">
          <Radio
            checked={showEmpty}
            onChange={() => setShowEmpty(!showEmpty)}
            label={t('comparison:emptyAnswers')}
            toggle
          />
        </Grid.Row>
      </Grid>
      <div className="color-grid">
        {questionsList.map(
          question =>
            allAnswers.get(question.id) &&
            !question.no_color &&
            questions.selected.includes(getLabel(question)) && (
              <div key={question.id} style={{ margin: '1em' }}>
                <PieChart
                  question={question}
                  answers={allAnswers.get(question.id)}
                  showEmpty={showEmpty}
                  chosenProgrammes={chosenProgrammes}
                  setActiveTab={setActiveTab}
                  setShowing={setShowing}
                />
              </div>
            ),
        )}
      </div>
    </div>
  )
}

export default ColorAnswers
