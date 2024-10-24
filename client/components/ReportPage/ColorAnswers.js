import React, { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Radio, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getLabel } from 'Utilities/common'
import { formKeys } from '@root/config/data'

import PDFDownload from 'Components/Generic/PDFDownload'
import ColorLegend from 'Components/Generic/ColorLegend'
import PieChart from './PieChart'

const ColorAnswers = ({ year, allAnswers, questionsList, chosenProgrammes, setActiveTab, setShowing }) => {
  const { t } = useTranslation()
  const [showEmpty, setShowEmpty] = useState(true)
  const componentRef = useRef()
  const questions = useSelector(({ filters }) => filters.questions)
  const form = useSelector(({ filters }) => filters.form)
  if (chosenProgrammes.length < 1 || allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{t('noData')}</h3>
  }

  const showFacultyPie = form === formKeys.EVALUATION_FACULTIES

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
        <Grid.Column width={6} className="left" />
        <Grid.Column width={6} className="center">
          {year} - {t('trafficLights')}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid columns={2}>
        <Grid.Row textAlign="left" style={{ display: 'flex', alignItems: 'center' }}>
          <Grid.Column>
            <ColorLegend />
          </Grid.Column>
          <Grid.Column>
            <Radio
              checked={showEmpty}
              onChange={() => setShowEmpty(!showEmpty)}
              label={
                form === formKeys.EVALUATION_FACULTIES || formKeys.FACULTY_MONITORING
                  ? t('comparison:emptyFacultyAnswers')
                  : t('comparison:emptyAnswers')
              }
              toggle
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className="ui divider" />
      <div style={{ paddingTop: '2em' }}>
        <Grid centered columns={3}>
          {questionsList.map(
            question =>
              allAnswers.get(question.id) &&
              !question.no_color &&
              questions.selected.includes(getLabel(question)) && (
                <div key={question.id}>
                  {showFacultyPie ? (
                    <>
                      {['bachelor', 'master', 'doctoral'].map(level => {
                        return (
                          <PieChart
                            key={`${question.id}-${level}`}
                            question={question}
                            answers={allAnswers.get(question.id)}
                            showEmpty={showEmpty}
                            chosenProgrammes={chosenProgrammes}
                            setActiveTab={setActiveTab}
                            setShowing={setShowing}
                            level={level}
                            form={form}
                          />
                        )
                      })}
                    </>
                  ) : (
                    <PieChart
                      question={question}
                      answers={allAnswers.get(question.id)}
                      showEmpty={showEmpty}
                      chosenProgrammes={chosenProgrammes}
                      setActiveTab={setActiveTab}
                      setShowing={setShowing}
                      form={form}
                    />
                  )}
                </div>
              ),
          )}
        </Grid>
      </div>
    </div>
  )
}

export default ColorAnswers
