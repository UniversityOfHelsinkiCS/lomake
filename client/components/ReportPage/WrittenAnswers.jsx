import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getLabel } from '../../util/common'
import NoPermissions from '../Generic/NoPermissions'
import PDFDownload from '../Generic/PDFDownload'
import SingleProgramQuestion from './SingleProgramQuestion'
import Question from './Question'
import DisabledQuestion from './DisabledQuestion'
import './ReportPage.scss'

const WrittenAnswers = ({
  year,
  usersProgrammes,
  chosenProgrammes,
  allAnswers,
  questionsList,
  showing,
  setShowing,
  meta = false,
}) => {
  const { t } = useTranslation()
  const componentRef = useRef()
  const questions = useSelector(({ filters }) => filters.questions)

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  const checkIfContent = question => {
    const answer = allAnswers.get(question.id)
    if (!answer) return false
    return answer.some(a => a.answer ?? a.comment)
  }

  // (!metaEvaluation) to check if both are true
  if (!meta && usersProgrammes.length < 1) return <NoPermissions requestedForm={t('report:reportPage')} t={t} />

  if (allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{t('noData')}</h3>
  }

  return (
    <div ref={componentRef}>
      <Accordion className="tab-pane" fluid>
        <Grid className="header">
          <Grid.Row className="noprint">
            <Grid.Column floated="right">
              <div className="side-note-large">
                <PDFDownload componentRef={componentRef} />
              </div>
              <p className="report side-note-small">{t('report:pdfNotification')}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column className="left" width={4}>
            {t('report:question')}
          </Grid.Column>
          <Grid.Column className="center" width={6}>
            {year} - {t('writtenAnswers')}
          </Grid.Column>
          <Grid.Column className="right" floated="right" width={5}>
            {t('report:answered')} / {t('allProgrammes')}
          </Grid.Column>
        </Grid>
        <div className="ui divider" />
        {questionsList.map(
          question =>
            questions.selected.includes(getLabel(question)) &&
            (checkIfContent(question) ? (
              <div key={question.id}>
                {chosenProgrammes.length === 1 ? (
                  <SingleProgramQuestion
                    answers={allAnswers.get(question.id).filter(p => p.answer ?? p.comment)}
                    question={question}
                  />
                ) : (
                  <Question
                    answers={allAnswers.get(question.id).filter(p => p.answer ?? p.comment)}
                    chosenProgrammes={chosenProgrammes}
                    handleClick={handleClick}
                    meta
                    question={question}
                    showing={
                      chosenProgrammes.length < 2 || questions.open.includes(getLabel(question)) ? question.id : showing
                    }
                    year={year}
                  />
                )}
                <div className="ui divider" />
              </div>
            ) : (
              <div key={question.id}>
                <DisabledQuestion chosenProgrammes={chosenProgrammes} question={question} />
                <div className="ui divider" />
              </div>
            ))
        )}
      </Accordion>
    </div>
  )
}

export default WrittenAnswers
