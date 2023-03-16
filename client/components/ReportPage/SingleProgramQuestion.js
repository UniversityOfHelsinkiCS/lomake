import React from 'react'
import { Accordion, Grid, Typography } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const SingleProgramQuestion = ({ answers, question }) => (
  <>
    <Accordion.Title
      index={question.id}
      active
      data-cy={`report-question-${question.id}`}
      className="question-header"
      id={question.labelIndex}
    >
      <Grid>
        <Grid spacing={1} className="question-caret noprint" />
        <Grid spacing={11}>
          <span>
            <small className="question-title">
              {romanize(question.titleIndex)} - {question.title}
            </small>
          </span>
          <p className="question-label">
            {question.labelIndex}. {question.label.toUpperCase()}
          </p>
          <p className="question-description">{question.description}</p>
        </Grid>
        <Grid spacing={4} floated="right">
          <Typography className="question-answered-label" size="large">
            1 / 1
          </Typography>
        </Grid>
      </Grid>
    </Accordion.Title>
    <Accordion.Content active className="question-content">
      {answers &&
        answers
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(programme => (
            <div key={`${question.id}-${programme.key}`}>
              <label className="answer-title">
                {programme.name} <span className={`answer-circle-${programme.color}`} />
              </label>
              <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                {programme.answer &&
                  programme.answer.split('\n').map((row, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <li key={index} className="answer-row">
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
