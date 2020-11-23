import React, { useState } from 'react'
import { Accordion, Grid } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import Question from './Question'

const WrittenAnswers = ({ year, questions, allAnswers, chosenProgrammes }) => {
  const [showing, setShowing] = useState(-1)

  const handleClick = (e, titleProps) => {
    const { index } = titleProps
    const newIndex = showing === index ? -1 : index
    setShowing(newIndex)
  }

  return (
    <Accordion fluid className="report-container">
      {questions.map((question) =>
          (<Question
            answers={allAnswers.map((year) => ({year: year.year, answers: year.answers.get(question.id)}))}
            question={question}
            chosenProgrammes={chosenProgrammes}
            showing={showing}
            handleClick={handleClick}
          />)
      )}
    </Accordion>
  )
}

export default WrittenAnswers
