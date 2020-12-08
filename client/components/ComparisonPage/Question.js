import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid, Icon, Popup } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'
import { romanize } from 'Utilities/common'

const Question = ({ answers, question, handleClick, showing }) => {
  const [colors, setColors] = useState(['all', 'all', 'all'])
  const [buttons, setButtons] = useState([0, 0, 0])
  const multipleYears = useSelector(({ filters }) => filters.multipleYears)
  const lang = useSelector((state) => state.language)

  const filterColor = (yearsIndex, color, colorKey) => {
    const newColors = colors.map((c, index) =>
      index == yearsIndex && colors[yearsIndex] != color ? color : colors[index]
    )
    const newButtons = buttons.map((b, index) =>
      index == yearsIndex && buttons[yearsIndex] != colorKey ? colorKey : buttons[index]
    )
    setColors(newColors)
    setButtons(newButtons)
  }

  const ButtonPopup = ({ color, index, yearsIndex }) => (
    <Popup
      content={`${translations.choose[lang]} ${
        translations[`${color}Ones`][lang]
      } ${translations.answers[lang]}`}
      trigger={
        <button
          key={index}
          name={color}
          type="button"
          className={`color-button-${buttons[yearsIndex] === index ? 'active' : ''}`}
          onClick={() => filterColor(yearsIndex, color, index)}
        >
          <span className={`answer-circle-big-${color}`} />
        </button>
      }
    ></Popup>
  )

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
              {question.labelIndex}. {(question.label).toUpperCase()}
            </p>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      <Accordion.Content active={showing}>
        <Grid>
          <Grid.Row columns={answers.length}>
            {answers.map((year, yearsIndex) =>
              multipleYears.includes(year.year) && (
              <Grid.Column
                key={yearsIndex} 
                className="comparison-question-content">
                <div className="color-buttons-sticky sticky-header">
                  <label>{year.year}</label>
                  {buttonColors.map((color, index) => (
                    <ButtonPopup
                      key={index}
                      color={color}
                      index={index}
                      yearsIndex={yearsIndex}
                    />
                  ))}
                </div>
                {year.answers.length > 0 ?
                  year.answers.map((programme, index) => {
                    if (colors[yearsIndex] === 'all' || programme.color === colors[yearsIndex]) {
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
                  })
                  : <h4>{translations.noData[lang]}</h4>
                }
              </Grid.Column>
            ))}
          </Grid.Row>
        </Grid>
      </Accordion.Content>
    </>
  )
}

export default Question
