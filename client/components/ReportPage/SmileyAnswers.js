import React, { useState } from 'react'
import { Grid, Radio, Segment } from 'semantic-ui-react'
import { translations } from 'Utilities/translations'
import PieChart from './PieChart'


const SmileyAnswers = ({ 
    allAnswers,
    questionsList,
    filteredProgrammes,
    lang,
    year,
  }) => {
  const [showEmptyAnswers, setShowEmptyAnswers] = useState(true)

  if (filteredProgrammes.length < 1 || allAnswers.size < 1) return <div><h3 data-cy="report-no-data">{translations.noData[lang]}</h3></div>

  return (
    <div className="report-container">
      <Grid >
        <Grid.Column className="report-center-header" width={16}>
          {year} - {translations.reportHeader['smileys'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider"/>
      <Grid centered>
        <Grid.Row textAlign="left">
          <Segment compact textAlign="left">
            <p><span className="answer-circle-green" />  {translations.positive[lang]}</p>
            <p><span className="answer-circle-yellow" />  {translations.neutral[lang]}</p>
            <p><span className="answer-circle-red" />  {translations.negative[lang]}</p>
            <p><span className="answer-circle-gray" /> {translations.empty[lang]}</p>
            <p className="report-side-note">{translations.noColors[lang]}</p>
          </Segment>
        </Grid.Row>
        <Grid.Row>
          <Radio
            checked={showEmptyAnswers}
            onChange={() => setShowEmptyAnswers(!showEmptyAnswers)}
            label={translations.emptyAnswers[lang]}
            toggle
          />
        </Grid.Row>
      </Grid>
      <div className="report-smiley-grid">
        {questionsList.map((question) =>
          (allAnswers.get(question.id) && !(question.no_light) &&
            <PieChart
              key={question.id}
              question={question}
              lang={lang}
              answers={allAnswers.get(question.id)}
              showEmptyAnswers={showEmptyAnswers}
              filteredProgrammes={filteredProgrammes}
            />
          )
        )}
      </div>
    </div>
  )
} 

export default SmileyAnswers