import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid, Icon, Popup } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { romanize } from 'Utilities/common'

const Question = ({ answers, question, handleClick, showing }) => {
  const [filteredColor, setFilteredColor] = useState(['all', 'all', 'all'])
  const [activeButtons, setActiveButtons] = useState([0, 0, 0])
  const lang = useSelector((state) => state.language)

  const setColor = (yearsIndex, color, colorKey) => {
    const newColors = filteredColor.map((c, index) =>
      index == yearsIndex && filteredColor[yearsIndex] != color ? color : filteredColor[index]
    )
    const newButtons = activeButtons.map((b, index) =>
      index == yearsIndex && activeButtons[yearsIndex] != colorKey ? colorKey : activeButtons[index]
    )
    setFilteredColor(newColors)
    setActiveButtons(newButtons)
  }

  const buttonColors = ['all', 'green', 'yellow', 'red']

  if (!answers) return <></>

  return (
    <>
      <Accordion.Title
        index={question.id}
        active={showing}
        data-cy={`comparison-question-${question.id}`}
        className={`question-header ${showing && 'sticky-header'}`}
        onClick={handleClick}
      >
        <Grid>
          <Grid.Column width={1} className="question-caret">
            <Icon name={`caret ${showing ? 'down' : 'right'}`} />
          </Grid.Column>
          <Grid.Column width={15}>
            <span>
              <small className="question-title">
                {romanize(question.titleIndex)} - {question.title}
              </small>
            </span>
            <p className="question-label">
              {question.labelIndex} {question.label}
            </p>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      <Accordion.Content active={showing}>
        <Grid>
          <Grid.Row columns={answers.length}>
            {answers.map((year, yearsIndex) => (
              <Grid.Column className="comparison-question-content">
                <div className="color-buttons sticky-header">
                  <label>{year.year}</label>
                  {buttonColors.map((color, index) => (
                    <>
                      <Popup
                        content={`${translations.choose[lang]} ${
                          translations[`${color}Ones`][lang]
                        } ${translations.answers[lang]}`}
                        trigger={
                          <button
                            key={index}
                            name={color}
                            active={activeButtons[yearsIndex] === index}
                            type="button"
                            className={`color-button-${
                              activeButtons[yearsIndex] === index ? 'active' : 'non-active'
                            }`}
                            onClick={() => setColor(yearsIndex, color, index)}
                          >
                            <span className={`answer-circle-big-${color}`} />
                          </button>
                        }
                      ></Popup>
                    </>
                  ))}
                </div>
                {year.answers &&
                  year.answers.map((programme, index) => {
                    if (
                      (filteredColor[yearsIndex] === 'all' ||
                        programme.color === filteredColor[yearsIndex]) &&
                      programme.answer
                    ) {
                      return (
                        <div key={index}>
                          <label className="answer-title">
                            {programme.name} <span className={`answer-circle-${programme.color}`} />
                          </label>
                          <ul
                            className="answer-list"
                            data-cy={`compare-question-content-${question.id}`}
                          >
                            {programme.answer &&
                              programme.answer.split('\n').map((row, index) => (
                                <li key={index} className="answer-row">
                                  {row}
                                </li>
                              ))}
                          </ul>
                        </div>
                      )
                    }
                  })}
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </Accordion.Content>
    </>
  )
}

export default Question
