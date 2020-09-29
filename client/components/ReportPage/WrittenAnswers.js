import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Accordion, Grid } from 'semantic-ui-react'
import DisabledQuestion from './DisabledQuestion'
import Question from './Question'
import SingleProgramQuestion from './SingleProgramQuestion'
import NoPermissions from 'Components/Generic/NoPermissions'
import { getAllTempAnswersAction } from 'Utilities/redux/tempAnswersReducer'
import { translations } from 'Utilities/translations'
import './ReportPage.scss'


const WrittenAnswers = ({ lang, year, usersProgrammes, filteredProgrammes, allAnswers, questionsList }) => {
  const dispatch = useDispatch()
  const [showing, setShowing] = useState(-1)

  useEffect(() => {
    dispatch(getAllTempAnswersAction())
  }, [])
  
  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  if (usersProgrammes.length < 1) return <NoPermissions languageCode={lang} />

  return (
    <Accordion fluid className="question-accordion">
        <Grid>
          <Grid.Column width={4} className="report-left-header">
            <p>{translations.questions[lang]}</p>
          </Grid.Column>
          <Grid.Column width={6} className="report-center-header">
            <p>{year} - {translations.reportHeader['written'][lang]}</p>
          </Grid.Column>
          <Grid.Column width={5} className="report-right-header" floated="right">
            <p >
              {translations.answered[lang]} / {translations.allProgrammes[lang]}
            </p>
          </Grid.Column>
        </Grid>
      <div className="ui divider"/>
      {questionsList.map((question) =>
        (allAnswers.get(question.id) ? (
          <>
          {filteredProgrammes.length === 1 ?
            <SingleProgramQuestion 
              key={question.id}
              answers={allAnswers.get(question.id)}
              question={question}
            />
            :
            <Question
              key={question.id}
              answers={allAnswers.get(question.id)}
              question={question}
              filteredProgrammes={filteredProgrammes}
              year={year}
              handleClick={handleClick}
              showing={filteredProgrammes.length < 2 ? question.id : showing}
            />
          }
          <div className="ui divider"/>
          </>)
          :
          <>
          <DisabledQuestion
            key={question.id}
            question={question}
            filteredProgrammes={filteredProgrammes}
          />
          <div className="ui divider"/>
          </>
        )
      )}
    </Accordion>
  )
}

export default WrittenAnswers