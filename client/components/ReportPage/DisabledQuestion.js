import React from 'react'
import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const DisabledQuestion = ({ question, chosenProgrammes }) => (
  <Accordion.Title
    index={question.id}
    data-cy={`report-question-disabled-${question.id}`}
    className="question-header-disabled"
  >
    <Grid>
      <Grid.Column width={1} className="question-caret" />
      <Grid.Column width={11}>
        <span>
          <small className="question-title-disabled">
            {romanize(question.titleIndex)} - {question.title}
          </small>
        </span>
        <p className="question-label-disabled">
          {question.labelIndex} {question.label}
        </p>
        <p className="question-description-disabled">{question.description}</p>
      </Grid.Column>
      <Grid.Column width={4} floated="right">
        <Label
          data-cy={`answered-label-${question.id}`}
          className="answered-label-disabled"
          size="large"
        >
          0 / {chosenProgrammes.length}
        </Label>
      </Grid.Column>
    </Grid>
  </Accordion.Title>
)

export default DisabledQuestion
