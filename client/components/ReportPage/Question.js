import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid, Icon, Label, Popup } from 'semantic-ui-react'
import { reportPageTranslations as translations } from 'Utilities/translations'
import { romanize } from 'Utilities/common'

const Question = ({ answers, question, chosenProgrammes, handleClick, showing }) => {
  const lang = useSelector(state => state.language)
  const [chosenColor, setChosenColor] = useState('all')

  const buttonColors = ['all', 'green', 'yellow', 'red']

  const ButtonPopup = ({ color, index }) => (
    <Popup
      content={`${translations.choose[lang]} ${translations[`${color}Ones`][lang]} ${translations.answers[lang]}`}
      trigger={
        <button
          key={index}
          name={color}
          type="button"
          className={`color-button-${chosenColor === color ? 'active' : ''}`}
          onClick={() => setChosenColor(color)}
        >
          <span className={`answer-circle-big-${color}`} />
        </button>
      }
    />
  )

  return (
    <>
      <Accordion.Title
        index={question.id}
        active={showing === question.id}
        onClick={handleClick}
        data-cy={`report-question-${question.id}`}
        className="question-header"
        id={question.labelIndex}
      >
        <Grid>
          <Grid.Column width={1} className="question-caret noprint">
            {chosenProgrammes.length > 1 && <Icon name={`caret ${showing === question.id ? 'down' : 'right'}`} />}
          </Grid.Column>
          <Grid.Column width={11}>
            <span>
              <small className="question-title">
                {romanize(question.titleIndex)} - {question.title}
              </small>
            </span>
            <p className="question-label">
              {question.labelIndex}. {question.label.toUpperCase()}
            </p>
            <p className="question-description">{question.description}</p>
            <p className="question-extrainfo">{question.extrainfo}</p>
          </Grid.Column>
          <Grid.Column width={4} floated="right">
            <Label data-cy={`answered-label-${question.id}`} className="question-answered-label" size="large">
              {answers.length} / {chosenProgrammes.length}
            </Label>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      {answers && (
        <Accordion.Content active={showing === question.id} className="question-content">
          {chosenProgrammes.length > 1 && <div className="ui divider" />}
          <div className="color-buttons noprint">
            {buttonColors.map((color, index) => (
              <ButtonPopup key={index} color={color} index={index} />
            ))}
          </div>
          {answers.length > 0 ? (
            answers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((programme, index) => {
                if (chosenColor === 'all' || programme.color === chosenColor) {
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
              })
          ) : (
            <h4>{translations.noData[lang]}</h4>
          )}
        </Accordion.Content>
      )}
    </>
  )
}

export default Question
