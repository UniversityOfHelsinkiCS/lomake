import React, { useState } from 'react'
import { Icon, Grid, Popup, Radio } from 'semantic-ui-react'
import { translations } from 'Utilities/translations'
import PieChart from './PieChart'
import './SmileyAnswers.scss'


const SmileyAnswers = ({ 
    allAnswers,
    questionsList,
    filteredProgrammes,
    lang,
    year,
  }) => {
  const [showEmptyAnswers, setShowEmptyAnswers] = useState(true)

  if (filteredProgrammes.length < 1 || allAnswers.size < 1) return <div><h3>{translations.noData[lang]}</h3></div>

  return (
    <div className="report-smiley-container">
      <Grid>
        <Grid.Column width={4} className="report-left-header" />
        <Grid.Column width={6} className="report-center-header">
          <p>{year} - {translations.reportHeader['smileys'][lang]}</p>
        </Grid.Column>
        <Grid.Column width={5} className="report-right-header" floated="right">
          <Popup
            size="large"
            position="left center"
            trigger={<Icon name="question circle outline" size="large"/>}
            content={
              <>
                <p><span className="answer-circle-green" />  {translations.positive[lang]}</p>
                <p><span className="answer-circle-yellow" />  {translations.neutral[lang]}</p>
                <p><span className="answer-circle-red" />  {translations.negative[lang]}</p>
                <p><span className="answer-circle-gray" /> {translations.empty[lang]}</p>
              </>
            }
          />
        </Grid.Column>
      </Grid>
      <div className="ui divider"/>
      <div className="report-smiley-wide-header">
        <Radio
          checked={showEmptyAnswers}
          onChange={() => setShowEmptyAnswers(!showEmptyAnswers)}
          label={translations.emptyAnswers[lang]}
          toggle
        />
      </div>
      <div className="report-smiley-grid">
        {questionsList.map((question) =>
          (allAnswers.get(question.id) && !question.no_light ?
            <PieChart
              key={question.id}
              question={question}
              lang={lang}
              allAnswers={allAnswers}
              showEmptyAnswers={showEmptyAnswers}
            />
            :
            null
          )
        )}
      </div>
    </div>
  )
} 

export default SmileyAnswers