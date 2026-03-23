import { Accordion, Grid, Label } from 'semantic-ui-react'
import { romanize } from '../../util/common'
import { useSelector } from 'react-redux'
import { formKeys } from '../../../config/data'

const DisabledQuestion = ({ question, chosenProgrammes }) => {
  const form = useSelector(({ filters }) => filters.form)

  return (
    <Accordion.Title
      className="question-header-disabled"
      data-cy={`report-question-disabled-${question.id}`}
      id={question.labelIndex}
      index={question.id}
    >
      <Grid>
        <Grid.Column className="question-caret noprint" width={1} />
        <Grid.Column width={11}>
          <span>
            <small className="question-title-disabled">
              {form === formKeys.FACULTY_MONITORING
                ? question.title
                : `${romanize(question.titleIndex)} - ${question.title}`}
            </small>
          </span>
          <p className="question-label-disabled">
            {question.labelIndex}. {question.label.toUpperCase()}
          </p>
          <p className="question-description-disabled">{question.description}</p>
          <p className="question-extrainfo">{question.extrainfo}</p>
        </Grid.Column>
        <Grid.Column floated="right" width={4}>
          <Label className="question-answered-label-disabled" data-cy={`answered-label-${question.id}`} size="large">
            0 / {chosenProgrammes.length}
          </Label>
        </Grid.Column>
      </Grid>
    </Accordion.Title>
  )
}

export default DisabledQuestion
