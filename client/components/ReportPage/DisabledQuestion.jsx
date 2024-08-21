import React from 'react'
import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from '../../util/common'
import { useSelector } from 'react-redux'
import { formKeys } from '@root/config/data'

const DisabledQuestion = ({ question, chosenProgrammes }) => {
  const form = useSelector(({ filters }) => filters.form)

  return (
    <Accordion.Title
      index={question.id}
      data-cy={`report-question-disabled-${question.id}`}
      className="question-header-disabled"
      id={question.labelIndex}
    >
      <Grid>
        <Grid.Column width={1} className="question-caret noprint" />
        <Grid.Column width={11}>
          <span>
            <small className="question-title-disabled">
              {form === formKeys.FACULTY_MONITORING
                ? question.title
                : `${romanize(question.titleIndex)} - ${question.title}`}
            </small>
          </span>
          <p className="question-label-disabled">
            {question.labelIndex}. {question.label.toUpperCase()}
          </p>
          <p className="question-description-disabled">{question.description}</p>
          <p className="question-extrainfo">{question.extrainfo}</p>
        </Grid.Column>
        <Grid.Column width={4} floated="right">
          <Label data-cy={`answered-label-${question.id}`} className="question-answered-label-disabled" size="large">
            0 / {chosenProgrammes.length}
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
  )
}

export default DisabledQuestion
