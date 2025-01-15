import React, { useState } from 'react'
import { Accordion, Grid, Icon, Label, Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { romanize } from '../../util/common'
import { useSelector } from 'react-redux'
import { formKeys } from '../../../config/data'
import QuestionTitle from './QuestionTitle'

const Question = ({ answers, question, chosenProgrammes, handleClick, showing, meta }) => {
  const { t } = useTranslation()
  const [chosenColor, setChosenColor] = useState('all')
  const form = useSelector(({ filters }) => filters.form)

  const buttonColors = [
    { key: 'all', text: t('all'), value: 'all' },
    { key: 'green', text: t('green'), value: 'green' },
    { key: 'yellow', text: t('yellow'), value: 'yellow' },
    { key: 'red', text: t('red'), value: 'red' },
  ]

  if (meta) buttonColors.push({ key: 'gray', text: t('gray'), value: 'gray' })

  const commentAppendix = `${t('comment')}:\n\n`

  const handleChange = (_, { value }) => setChosenColor(value)

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
                {form === formKeys.META_EVALUATION || form === formKeys.FACULTY_MONITORING
                  ? question.title
                  : `${romanize(question.titleIndex)} - ${question.title}`}
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
            <Dropdown
              onChange={handleChange}
              text={t(`colors_${chosenColor}`)}
              options={buttonColors}
              value={chosenColor}
            />
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
