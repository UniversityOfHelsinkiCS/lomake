import { Accordion, Grid, Label } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { formKeys } from '../../../config/data'
import { romanize } from '../../util/common'
import QuestionTitle from './QuestionTitle'

const SingleProgramQuestion = ({ answers, question }) => {
  const { t } = useTranslation()
  const commentAppendix = `${t('comment')}:\n\n`
  const form = useSelector(({ filters }) => filters.form)

  return (
    <>
      <Accordion.Title
        active
        className="question-header"
        data-cy={`report-question-${question.id}`}
        id={question.labelIndex}
        index={question.id}
      >
        <Grid>
          <Grid.Column className="question-caret noprint" width={1} />
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
          </Grid.Column>
          <Grid.Column floated="right" width={4}>
            <Label className="question-answered-label" size="large">
              1 / 1
            </Label>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      <Accordion.Content active className="question-content">
        {answers
          ?.sort((a, b) => a.name.localeCompare(b.name))
          .map(programme => (
            <div key={`${question.id}-${programme.key}`}>
              <QuestionTitle answerColors={programme.color} id={question.id} programmeName={programme.name} />
              <ul className="answer-list" data-cy={`report-question-content-${question.id}`}>
                {programme.answer?.split('\n').map((row, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <li className="answer-row" key={index}>
                    {row}
                  </li>
                ))}
                {programme.comment ? (
                  <>
                    {commentAppendix}
                    {programme.comment.split('\n').map((row, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <li className="answer-row" key={index}>
                        {row}
                      </li>
                    ))}
                  </>
                ) : null}
              </ul>
            </div>
          ))}
      </Accordion.Content>
    </>
  )
}

export default SingleProgramQuestion
