import React from 'react'
import { Accordion, Grid, Typography } from '@mui/material'
import { romanize } from 'Utilities/common'

const DisabledQuestion = ({ question, chosenProgrammes }) => (
  <Accordion.Title
    index={question.id}
    data-cy={`report-question-disabled-${question.id}`}
    className="question-header-disabled"
    id={question.labelIndex}
  >
    <Grid>
      <Grid spacing={1} className="question-caret noprint" />
      <Grid spacing={11}>
        <span>
          <small className="question-title-disabled">
            {romanize(question.titleIndex)} - {question.title}
          </small>
        </span>
        <p className="question-label-disabled">
          {question.labelIndex}. {question.label.toUpperCase()}
        </p>
        <p className="question-description-disabled">{question.description}</p>
        <p className="question-extrainfo">{question.extrainfo}</p>
      </Grid>
      <Grid spacing={4} floated="right">
        <Typography data-cy={`answered-label-${question.id}`} className="question-answered-label-disabled" size="large">
          0 / {chosenProgrammes.length}
        </Typography>
      </Grid>
    </Grid>
  </Accordion.Title>
)

export default DisabledQuestion
