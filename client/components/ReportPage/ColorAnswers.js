import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Grid, Radio } from 'semantic-ui-react'
import ColorLegend from 'Components/Generic/ColorLegend'
import { reportPageTranslations as translations } from 'Utilities/translations'
import PieChart from './PieChart'

const ColorAnswers = ({ year, allAnswers, questionsList, chosenProgrammes, setActiveTab }) => {
  const lang = useSelector((state) => state.language)
  const [showEmpty, setShowEmpty] = useState(true)

  if (chosenProgrammes.length < 1 || allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{translations.noData[lang]}</h3>
  }

  return (
    <div className="report-container">
      <Grid>
        <Grid.Column className="report-center-header" width={16}>
          {year} - {translations.reportHeader['colors'][lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      <Grid centered>
        <Grid.Row textAlign="left">
          <ColorLegend />
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
      <div className="report-color-grid">
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
                setActiveTab={setActiveTab}
              />
            )
        )}
      </div>
    </div>
  )
}

export default ColorAnswers
