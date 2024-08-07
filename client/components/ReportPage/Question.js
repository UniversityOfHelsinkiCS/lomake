import React, { useState } from 'react'
import { Accordion, Grid, Icon, Label, Popup, Button, ButtonGroup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { romanize } from 'Utilities/common'
import QuestionTitle from './QuestionTitle'

const ButtonPopup = ({ color, setChosenColor, t }) => (
  <Popup
    content={`${t('choose')} ${t('colors', { context: color })} ${t('answers')}`}
    trigger={
      <Button
        size="mini"
        color={color === 'all' ? 'black' : color}
        aria-label="Choose color"
        key={color}
        name={color}
        onClick={() => setChosenColor(color)}
      >
        {color === 'all' && <span>{t('all')}</span>}
      </Button>
    }
  />
)

const Question = ({ answers, question, chosenProgrammes, handleClick, showing, meta }) => {
  const { t } = useTranslation()
  const [chosenColor, setChosenColor] = useState('all')

  const buttonColors = ['all', 'green', 'yellow', 'red']

  if (meta) buttonColors.push('gray')

  const commentAppendix = `${t('comment')}:\n\n`

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
          <div className="color-buttons noprint" style={{ paddingBottom: '1em' }}>
            <ButtonGroup>
              {buttonColors.map(color => (
                <ButtonPopup
                  key={color}
                  color={color}
                  circular
                  t={t}
                  chosenColor={chosenColor}
                  setChosenColor={setChosenColor}
                />
              ))}
            </ButtonGroup>
          </div>
          {answers.length > 0 ? (
            answers
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(programme => {
                if (chosenColor === 'all' || programme.color === chosenColor) {
                  return (
                    <div key={`${question.id}-${programme.key}`}>
                      <QuestionTitle id={programme.id} answerColors={programme.color} programmeName={programme.name} />
                      <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                        {programme.answer &&
                          programme.answer.split('\n').map((row, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={index} className="answer-row">
                              {row}
                            </li>
                          ))}
                        {programme.comment &&
                          programme.comment.split('\n').map((row, index) => (
                            // eslint-disable-next-line react/no-array-index-key
                            <li key={index} className="answer-row">
                              {commentAppendix}
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
