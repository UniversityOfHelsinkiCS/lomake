import React from 'react'
import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const SingleProgramQuestion = ({ answers, question }) => (
  <>
    <Accordion.Title
      index={question.id}
      active
      data-cy={`report-question-${question.id}`}
      className="report-question-header"
      id={question.labelIndex}
    >
      <Grid>
        <Grid.Column width={1} className="report-question-caret noprint" />
        <Grid.Column width={11}>
          <span>
            <small className="report-question-title">
              {romanize(question.titleIndex)} - {question.title}
            </small>
          </span>
          <p className="report-question-label">
            {question.labelIndex}. {question.label.toUpperCase()}
          </p>
          <p className="report-question-description">{question.description}</p>
        </Grid.Column>
        <Grid.Column width={4} floated="right">
          <Label className="report-question-answered-label" size="large">
            1 / 1
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
    <Accordion.Content active className="report-question-content">
      {answers &&
        answers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((programme, index) => (
            <div key={index}>
              <label className="report-answer-title">
                {programme.name} <span className={`report-answer-circle-${programme.color}`} />
              </label>
              <ul className="report-answer-list" data-cy={`report-question-content-${question.id}`}>
                {programme.answer &&
                  programme.answer.split('\n').map((row, index) => (
                    <li key={index} className="report-answer-row">
                      {row}
                    </li>
                  ))}
              </ul>
            </div>
          ))}
    </Accordion.Content>
  </>
)

export default SingleProgramQuestion
