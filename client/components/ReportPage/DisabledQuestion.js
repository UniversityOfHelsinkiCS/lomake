import React from 'react'
import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const DisabledQuestion = ({ question, filteredProgrammes }) => (
    <Accordion.Title
      index={question.id}
      data-cy={`report-question-${question.id}`}
      className="question-header-disabled"
    >
      <Grid>
        <Grid.Column width={1} className="left-header" />
        <Grid.Column width={11}>
          <span><small className="question-title-disabled">
            {romanize(question.titleIndex)} - {question.title}
          </small></span>
          <p className="question-label-disabled">{question.label}</p>
          <p className="question-description-disabled">{question.description}</p>
        </Grid.Column>
        <Grid.Column width={2}/>
        <Grid.Column width={2} floated="right">
          <Label className="answered-label-disabled" size="large">
             0 / {filteredProgrammes.length}
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
  )

export default DisabledQuestion
