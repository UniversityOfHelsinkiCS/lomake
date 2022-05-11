import React from 'react'
import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const DisabledQuestion = ({ question, chosenProgrammes }) => (
  <Accordion.Title
    index={question.id}
    data-cy={`report-question-disabled-${question.id}`}
    className="report-question-header-disabled"
    id={question.labelIndex}
  >
    <Grid>
      <Grid.Column width={1} className="report-question-caret noprint" />
      <Grid.Column width={11}>
        <span>
          <small className="report-question-title-disabled">
            {romanize(question.titleIndex)} - {question.title}
          </small>
        </span>
        <p className="report-question-label-disabled">
          {question.labelIndex}. {question.label.toUpperCase()}
        </p>
        <p className="report-question-description-disabled">{question.description}</p>
        <p className="report-question-extrainfo">{question.extrainfo}</p>
      </Grid.Column>
      <Grid.Column width={4} floated="right">
        <Label
          data-cy={`answered-label-${question.id}`}
          className="report-question-answered-label-disabled"
          size="large"
        >
          0 / {chosenProgrammes.length}
        </Label>
      </Grid.Column>
    </Grid>
  </Accordion.Title>
)

export default DisabledQuestion
