import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import DisabledQuestion from './DisabledQuestion'
import Question from './Question'
import SingleProgramQuestion from './SingleProgramQuestion'
import NoPermissions from 'Components/Generic/NoPermissions'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { reportPageTranslations as translations } from 'Utilities/translations'
import './ReportPage.scss'

const WrittenAnswers = ({ year, usersProgrammes, chosenProgrammes, allAnswers, questionsList, showing, setShowing }) => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  const check = (question) => {
    const answer = allAnswers.get(question.id)
    if (!answer) return false
    const t = answer.find((a) => a.answer)
    if (t) return true
    return false
  }

  if (usersProgrammes.length < 1) return <NoPermissions lang={lang} />

  if (allAnswers.size < 1) {
    return <h3 data-cy="report-no-data">{translations.noData[lang]}</h3>
  }

  return (
    <Accordion fluid className="report-tab-pane">
      <Grid className="report-header">
        <Grid.Column width={4} className="left">
          {translations.questions[lang]}
        </Grid.Column>
        <Grid.Column width={6} className="center">
          {year} - {translations.reportHeader['written'][lang]}
        </Grid.Column>
        <Grid.Column width={5} className="right" floated="right">
          {translations.answered[lang]} / {translations.allProgrammes[lang]}
        </Grid.Column>
      </Grid>
      <div className="ui divider" />
      {questionsList.map((question) =>
        check(question) ? (
          <div key={question.id}>
            {chosenProgrammes.length === 1 ? (
              <SingleProgramQuestion answers={allAnswers.get(question.id)} question={question} />
            ) : (
              <Question
                answers={allAnswers.get(question.id).filter((p) => p.answer)}
                question={question}
                chosenProgrammes={chosenProgrammes}
                year={year}
                handleClick={handleClick}
                showing={chosenProgrammes.length < 2 ? question.id : showing}
              />
            )}
            <div className="ui divider" />
          </div>
        ) : (
          <div key={question.id}>
            <DisabledQuestion question={question} chosenProgrammes={chosenProgrammes} />
            <div className="ui divider" />
          </div>
        )
      )}
    </Accordion>
  )
}

export default WrittenAnswers
