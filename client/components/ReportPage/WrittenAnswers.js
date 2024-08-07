import React, { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import NoPermissions from 'Components/Generic/NoPermissions'
import PDFDownload from 'Components/Generic/PDFDownload'
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

  const getLabel = question => {
    if (!question) return ''
    const index = question.labelIndex < 10 ? `0${question.labelIndex}` : question.labelIndex
    return `${index}${question.label}`
  }

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  const checkIfContent = question => {
    const answer = allAnswers.get(question.id)
    if (!answer) return false
    return answer.some(a => a.answer || a.comment)
  }

  // (!metaEvaluation) to check if both are true
  if (!meta && usersProgrammes.length < 1) return <NoPermissions t={t} />

  if (allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{t('noData')}</h3>
  }

  return (
    <div ref={componentRef}>
      <Accordion fluid className="tab-pane">
        <Grid className="header">
          <Grid.Row className="noprint">
            <Grid.Column floated="right">
              <div className="side-note-large">
                <PDFDownload componentRef={componentRef} />
              </div>
              <p className="report side-note-small">{t('report:pdfNotification')}</p>
            </Grid.Column>
          </Grid.Row>
          <Grid.Column width={4} className="left">
            {t('report:question')}
          </Grid.Column>
          <Grid.Column width={6} className="center">
            {year} - {t('writtenAnswers')}
          </Grid.Column>
          <Grid.Column width={5} className="right" floated="right">
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
                  <SingleProgramQuestion answers={allAnswers.get(question.id)} question={question} />
                ) : (
                  <Question
                    answers={allAnswers.get(question.id).filter(p => p.answer || p.comment)}
                    question={question}
                    chosenProgrammes={chosenProgrammes}
                    year={year}
                    handleClick={handleClick}
                    showing={
                      chosenProgrammes.length < 2 || questions.open.includes(getLabel(question)) ? question.id : showing
                    }
                    meta={meta}
                  />
                )}
                <div className="ui divider" />
              </div>
            ) : (
              <div key={question.id}>
                <DisabledQuestion question={question} chosenProgrammes={chosenProgrammes} />
                <div className="ui divider" />
              </div>
            )),
        )}
      </Accordion>
    </div>
  )
}

export default WrittenAnswers
