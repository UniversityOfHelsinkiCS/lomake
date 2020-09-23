import React from 'react'
import { Accordion, Grid, Icon, Label } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'


const Question = ({
  answers,
  question,
  usersProgrammes,
  handleClick,
  showing
}) => (
  <>
    <Accordion.Title
      index={question.id}
      active={showing === question.id}
      onClick={handleClick}
      className="question-header"
    >
      <Grid>
        <Grid.Column width={1} className="question-caret">
          <Icon name={`caret ${showing === question.id ? "down" : "right"}`} />
        </Grid.Column>
        <Grid.Column width={11}>
          <span><small className="question-title">
            {romanize(question.titleIndex)} - {question.title}
          </small></span>
          <p className="question-label">{question.label}</p>
          <p className="question-description">{question.description}</p>
        </Grid.Column>
        <Grid.Column width={2}/>
        <Grid.Column width={2} floated="right">
          <Label className={answers ? "answered-label" : "not-answered-label"} size="large">
            {answers ? answers.length : 0} / {usersProgrammes.length}
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
    <Accordion.Content active={showing === question.id}>
      {usersProgrammes.length > 1 && <div className="ui divider" />}
      {answers && (
        answers.map((programme, index) => 
          <div key={index}>
            <label className="answer-title">{programme.name}</label>
            <ul className="answer-list">{programme.answer.split('\n').map((row, index) => 
              <li key={index} className="answer-row">{row}</li>
            )}
            </ul>
          </div>
        )
      )}
    </Accordion.Content>
  </>
)

export default Question
