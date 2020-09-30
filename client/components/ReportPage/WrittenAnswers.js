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


const WrittenAnswers = ({ 
  lang, 
  year, 
  usersProgrammes, 
  filteredProgrammes, 
  allAnswers, 
  questionsList 
}) => {
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
    <Accordion fluid className="report-container">
      <Grid>
        <Grid.Column width={4} className="report-left-header">
          {translations.questions[lang]}
        </Grid.Column>
        <Grid.Column width={6} className="report-center-header">
          {year} - {translations.reportHeader['written'][lang]}
        </Grid.Column>
        <Grid.Column width={5} className="report-right-header" floated="right">
          {translations.answered[lang]} / {translations.allProgrammes[lang]}            
        </Grid.Column>
      </Grid>
      <div className="ui divider"/>
      {questionsList.map((question) =>
        (allAnswers.get(question.id) ? (
          <div key={question.id}>
            {filteredProgrammes.length === 1 ?
              <SingleProgramQuestion
                answers={allAnswers.get(question.id)}
                question={question}
              />
              :
              <Question
                answers={allAnswers.get(question.id)}
                question={question}
                filteredProgrammes={filteredProgrammes}
                year={year}
                handleClick={handleClick}
                showing={filteredProgrammes.length < 2 ? question.id : showing}
              />
            }
            <div className="ui divider"/>
          </div>)
          :
          <div key={question.id}>
            <DisabledQuestion
              question={question}
              filteredProgrammes={filteredProgrammes}
            />
            <div className="ui divider"/>
          </div>
        )
      )}
    </Accordion>
  )
}

export default WrittenAnswers