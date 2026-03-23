import { useState } from 'react'
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
        active={showing === question.id}
        data-cy={`report-question-${question.id}`}
        // eslint-disable-next-line react/jsx-sort-props
        className="question-header"
        id={question.labelIndex}
        index={question.id}
        onClick={handleClick}
      >
        <Grid>
          <Grid.Column className="question-caret noprint" width={1}>
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
          <Grid.Column floated="right" width={4}>
            <Label className="question-answered-label" data-cy={`answered-label-${question.id}`} size="large">
              {answers.length} / {chosenProgrammes.length}
            </Label>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      {answers ? (
        <Accordion.Content active={showing === question.id} className="question-content">
          {chosenProgrammes.length > 1 && <div className="ui divider" />}
          <div className="color-buttons noprint" style={{ paddingBottom: '1em' }}>
            <Dropdown
              onChange={handleChange}
              options={buttonColors}
              text={t(`colors_${chosenColor}`)}
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
                      <QuestionTitle answerColors={programme.color} id={programme.id} programmeName={programme.name} />
                      <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                        {programme.answer?.split('\n').map((row, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li className="answer-row" key={index}>
                            {row}
                          </li>
                        ))}
                        {programme.comment?.split('\n').map((row, index) => (
                          // eslint-disable-next-line react/no-array-index-key
                          <li className="answer-row" key={index}>
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
      ) : null}
    </>
  )
}

export default Question
