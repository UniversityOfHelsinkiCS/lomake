import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import NoPermissions from 'Components/Generic/NoPermissions'
import PDFDownload from 'Components/Generic/PDFDownload'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
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
}) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const questions = useSelector(({ filters }) => filters.questions)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])

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

  const checkIfAnswers = question => {
    const answer = allAnswers.get(question.id)
    if (!answer) return false
    const t = answer.find(a => a.answer)
    if (t) return true
    return false
  }

  if (usersProgrammes.length < 1) return <NoPermissions lang={lang} />

  if (allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{t('noData')}</h3>
  }

  return (
    <Accordion fluid className="tab-pane">
      <Grid className="header">
        <Grid.Row className="noprint">
          <Grid.Column floated="right">
            <div className="side-note-large">
              <PDFDownload />
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
          (checkIfAnswers(question) ? (
            <div key={question.id}>
              {chosenProgrammes.length === 1 ? (
                <SingleProgramQuestion answers={allAnswers.get(question.id)} question={question} />
              ) : (
                <Question
                  answers={allAnswers.get(question.id).filter(p => p.answer)}
                  question={question}
                  chosenProgrammes={chosenProgrammes}
                  year={year}
                  handleClick={handleClick}
                  showing={
                    chosenProgrammes.length < 2 || questions.open.includes(getLabel(question)) ? question.id : showing
                  }
                />
              )}
              <div className="ui divider" />
            </div>
          ) : (
            <div key={question.id}>
              <DisabledQuestion question={question} chosenProgrammes={chosenProgrammes} />
              <div className="ui divider" />
            </div>
          ))
      )}
    </Accordion>
  )
}

export default WrittenAnswers
