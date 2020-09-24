import React from 'react'
import { Accordion, Grid, Icon, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'


const Question = ({
  answers,
  question,
  filteredProgrammes,
  handleClick,
  disabled,
  showing
}) => (
  <>
    <Accordion.Title
      index={question.id}
      active={showing === question.id}
      onClick={handleClick}
      data-cy={`report-question-${question.id}`}
      className={`question-header-${disabled}`}
    >
      <Grid>
        <Grid.Column width={1} className={`question-caret-${disabled}`}>
          {filteredProgrammes.length > 1 &&  
            <Icon name={`caret ${showing === question.id ? "down" : "right"}`} />
          }
        </Grid.Column>
        <Grid.Column width={11}>
          <span><small className={`question-title-${disabled}`}>
            {romanize(question.titleIndex)} - {question.title}
          </small></span>
          <p className={`question-label-${disabled}`}>{question.label}</p>
          <p className="question-description">{question.description}</p>
        </Grid.Column>
        <Grid.Column width={2}/>
        <Grid.Column width={2} floated="right">
          <Label className={`answered-label-${disabled}`} size="large">
            {answers ? answers.length : 0} / {filteredProgrammes.length}
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
    {answers && (
      <Accordion.Content active={showing === question.id} className="question-content">
        {filteredProgrammes.length > 1 && <div className="ui divider" />}
        {answers && (
          answers.sort((a,b) => a['name'].localeCompare(b['name'])).map((programme, index) =>
            <div key={index}>
              <label className="answer-title">{programme.name}</label>
              <span className={`answer-circle-${programme.color}`} />
              <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                {programme.answer.split('\n').map((row, index) =>
                  <li key={index} className="answer-row">{row}</li>
                )}
              </ul>
            </div>
          )
        )}
      </Accordion.Content>
    )}
  </>
)

export default Question
