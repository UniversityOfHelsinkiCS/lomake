import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio, Segment } from 'semantic-ui-react'
import { reportPageTranslations as translations } from 'Utilities/translations'
import PieChart from './PieChart'

const SmileyAnswers = ({ year, allAnswers, questionsList, chosenProgrammes }) => {
  const lang = useSelector((state) => state.language)
  const [showEmpty, setShowEmpty] = useState(true)

  if (chosenProgrammes.length < 1 || allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{translations.noData[lang]}</h3>
  }

  return (
    <div className="report-container">
      <Grid>
        <Grid.Column className="report-center-header" width={16}>
          {year} - {translations.reportHeader['smileys'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid centered>
        <Grid.Row textAlign="left">
          <Segment compact textAlign="left">
            <p>
              <span className="answer-circle-green" /> {translations.positive[lang]}
            </p>
            <p>
              <span className="answer-circle-yellow" /> {translations.neutral[lang]}
            </p>
            <p>
              <span className="answer-circle-red" /> {translations.negative[lang]}
            </p>
            <p>
              <span className="answer-circle-gray" /> {translations.empty[lang]}
            </p>
            <p className="report-side-note">{translations.noColors[lang]}</p>
          </Segment>
        </Grid.Row>
        <Grid.Row>
          <Radio
            checked={showEmpty}
            onChange={() => setShowEmpty(!showEmpty)}
            label={translations.emptyAnswers[lang]}
            toggle
          />
        </Grid.Row>
      </Grid>
      <div className="report-smiley-grid">
        {questionsList.map(
          (question) =>
            allAnswers.get(question.id) &&
            !question.no_color && (
              <PieChart
                key={question.id}
                question={question}
                answers={allAnswers.get(question.id)}
                showEmpty={showEmpty}
                chosenProgrammes={chosenProgrammes}
              />
            )
        )}
      </div>
    </div>
  )
}

export default SmileyAnswers
