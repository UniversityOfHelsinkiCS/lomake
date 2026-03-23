import { useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Radio, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getLabel } from '../../util/common'
import { formKeys } from '../../../config/data'

import PDFDownload from '../Generic/PDFDownload'
import ColorLegend from '../Generic/ColorLegend'
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
        <Grid.Column className="left" width={6} />
        <Grid.Column className="center" width={6}>
          {year} - {t('trafficLights')}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid columns={2}>
        <Grid.Row style={{ display: 'flex', alignItems: 'center' }} textAlign="left">
          <Grid.Column>
            <ColorLegend />
          </Grid.Column>
          <Grid.Column>
            <Radio
              checked={showEmpty}
              label={
                form === formKeys.EVALUATION_FACULTIES || form === formKeys.FACULTY_MONITORING
                  ? t('comparison:emptyFacultyAnswers')
                  : t('comparison:emptyAnswers')
              }
              onChange={() => setShowEmpty(!showEmpty)}
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
                            answers={allAnswers.get(question.id)}
                            chosenProgrammes={chosenProgrammes}
                            form={form}
                            key={`${question.id}-${level}`}
                            level={level}
                            question={question}
                            setActiveTab={setActiveTab}
                            setShowing={setShowing}
                            showEmpty={showEmpty}
                          />
                        )
                      })}
                    </>
                  ) : (
                    <PieChart
                      answers={allAnswers.get(question.id)}
                      chosenProgrammes={chosenProgrammes}
                      form={form}
                      question={question}
                      setActiveTab={setActiveTab}
                      setShowing={setShowing}
                      showEmpty={showEmpty}
                    />
                  )}
                </div>
              )
          )}
        </Grid>
      </div>
    </div>
  )
}

export default ColorAnswers
