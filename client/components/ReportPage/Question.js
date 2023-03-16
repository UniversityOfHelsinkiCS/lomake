import React, { useState } from 'react'
import { Accordion, Grid, Icon, Typography, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { romanize } from 'Utilities/common'

const Question = ({ answers, question, chosenProgrammes, handleClick, showing }) => {
  const { t } = useTranslation()
  const [chosenColor, setChosenColor] = useState('all')

  const buttonColors = ['all', 'green', 'yellow', 'red']

  const ButtonPopup = ({ color }) => (
    <Popup
      content={`${t('choose')} ${t('colors', { context: color })} ${t('answers')}`}
      trigger={
        <button
          key={color}
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
          <Grid spacing={1} className="question-caret noprint">
            {chosenProgrammes.length > 1 && <Icon name={`caret ${showing === question.id ? 'down' : 'right'}`} />}
          </Grid>
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
            <p className="question-extrainfo">{question.extrainfo}</p>
          </Grid>
          <Grid spacing={4} floated="right">
            <Typography data-cy={`answered-label-${question.id}`} className="question-answered-label" size="large">
              {answers.length} / {chosenProgrammes.length}
            </Typography>
          </Grid>
        </Grid>
      </Accordion.Title>
      {answers && (
        <Accordion.Content active={showing === question.id} className="question-content">
          {chosenProgrammes.length > 1 && <div className="ui divider" />}
          <div className="color-buttons noprint">
            {buttonColors.map(color => (
              <ButtonPopup key={color} color={color} />
            ))}
          </div>
          {answers.length > 0 ? (
            answers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(programme => {
                if (chosenColor === 'all' || programme.color === chosenColor) {
                  return (
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
                  )
                }
                return undefined
              })
          ) : (
            <h4>{t('noData')}</h4>
          )}
        </Accordion.Content>
      )}
    </>
  )
}

export default Question
