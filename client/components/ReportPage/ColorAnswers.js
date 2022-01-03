import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import PDFDownload from 'Components/Generic/PDFDownload'
import ColorLegend from 'Components/Generic/ColorLegend'
import { reportPageTranslations as translations } from 'Utilities/translations'
import PieChart from './PieChart'

const ColorAnswers = ({ year, allAnswers, questionsList, chosenProgrammes, setActiveTab, setShowing }) => {
  const lang = useSelector(state => state.language)
  const [showEmpty, setShowEmpty] = useState(true)
  const questions = useSelector(({ filters }) => filters.questions)

  if (chosenProgrammes.length < 1 || allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{translations.noData[lang]}</h3>
  }

  const getLabel = question => {
    if (!question) return ''
    const label = _.capitalize(question.label)
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${label}`
  }

  return (
    <div className="report-tab-pane">
      <Grid className="report-header">
        <Grid.Column className="left" width={4} />
        <Grid.Column className="center" width={6}>
          {year} - {translations.reportHeader.colors[lang]}
        </Grid.Column>
        <Grid.Column width={5} className="right noprint" floated="right">
          <PDFDownload />
          <p className="report-side-note-small">{translations.pdfNotification[lang]}</p>
        </Grid.Column>
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
            label={translations.emptyAnswers[lang]}
            toggle
          />
        </Grid.Row>
      </Grid>
      <div className="report-color-grid">
        {questionsList.map(
          question =>
            allAnswers.get(question.id) &&
            !question.no_color &&
            questions.selected.includes(getLabel(question)) && (
              <PieChart
                key={question.id}
                question={question}
                answers={allAnswers.get(question.id)}
                showEmpty={showEmpty}
                chosenProgrammes={chosenProgrammes}
                setActiveTab={setActiveTab}
                setShowing={setShowing}
              />
            )
        )}
      </div>
    </div>
  )
}

export default ColorAnswers
