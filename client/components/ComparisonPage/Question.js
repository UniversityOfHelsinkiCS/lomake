import React, { useState } from 'react'
import { Accordion, Grid, Icon } from 'semantic-ui-react'
import { romanize } from 'Utilities/common'

const Question = ({ answers, question, chosenProgrammes, handleClick, showing }) => {
  const [filteredColor, setFilteredColor] = useState(['all','all','all'])

  const setColor = (yearsIndex, color) => {
    const newColors = filteredColor.map((c, index) => (index == yearsIndex && filteredColor[yearsIndex] != color) ? color : filteredColor[index])
    setFilteredColor(newColors)
  }

  return (
    <>
      <Accordion.Title
        index={question.id}
        active={showing === question.id}
        data-cy={`report-question-${question.id}`}
        className="question-header sticky-header"
        onClick={handleClick}
      >
        <Grid>
          <Grid.Column width={1} className="question-caret">
            <Icon name={`caret ${showing === question.id ? 'down' : 'right'}`} />
          </Grid.Column>
          <Grid.Column  width={15}>
            <span>
              <small className="question-title">
                {romanize(question.titleIndex)} - {question.title}
              </small>
            </span>
            <p className="question-label">
              {question.labelIndex} {question.label} 
            </p>
            <p className="question-description">{question.description}</p>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      {answers && (
        <Accordion.Content active={showing === question.id}>
          <Grid>
            <Grid.Row columns={answers.length}>
              {answers.map((year, yearsIndex) => 
                <Grid.Column className="comparison-question-content">
                  <div className="sticky-header">
                  <label>{year.year}</label>
                    <button className="color-button" onClick={() => setColor(yearsIndex, 'green')}><span className="answer-circle-big-green" /></button>
                    <button className="color-button" onClick={() => setColor(yearsIndex, 'yellow')}><span className="answer-circle-big-yellow" /></button>
                    <button className="color-button" onClick={() => setColor(yearsIndex, 'red')}><span className="answer-circle-big-red" /></button>
                    <button className="color-button" onClick={() => setColor(yearsIndex, 'emptyAnswer')}><span className="answer-circle-big-gray" /></button>
                    </div>
                  {year.answers && year.answers.length > 1 && year.answers
                    .sort((a, b) => a['name'].localeCompare(b['name']))
                    .map((programme, index) => {
                      if (filteredColor[yearsIndex] === 'all' || programme.color === filteredColor[yearsIndex]) {
                        return (
                          <div key={index}>
                            <label className="answer-title">
                              {programme.name} <span className={`answer-circle-${programme.color}`} />
                            </label>
                            <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                              {programme.answer &&
                                programme.answer.split('\n').map((row, index) => (
                                  <li key={index} className="answer-row">
                                    {row}
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )
      
                      }
                    }
                  )}
                </Grid.Column>            
              )}
            </Grid.Row>
          </Grid>

        </Accordion.Content>
      )}
    </>
  )

}

export default Question
