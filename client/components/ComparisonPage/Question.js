import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Accordion, Grid, Icon, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { romanize } from 'Utilities/common'

const generateRandomKey = value => `${value}-${Math.random()}`

const ButtonPopup = ({ color, index, yearsIndex, buttons, filterColor }) => {
  const { t } = useTranslation()
  return (
    <Popup
      content={`${`${t('choose')} ${t('colors', { context: color })} ${t('answers')}`}`}
      trigger={
        <button
          aria-label="Choose color"
          key={color}
          name={color}
          type="button"
          className={`color-button-${buttons[yearsIndex] === index ? 'active' : ''}`}
          onClick={() => filterColor(yearsIndex, color, index)}
        >
          <span className={`answer-circle-big-${color}`} />
        </button>
      }
    />
  )
}

const Question = ({ answers, question, handleClick, showing, form }) => {
  const { t } = useTranslation()
  const stateLength = new Date().getFullYear() - 2019 + 1
  const [colors, setColors] = useState(Array(stateLength).fill('all'))
  const [buttons, setButtons] = useState(Array(stateLength).fill(0))
  const multipleYears = useSelector(({ filters }) => filters.multipleYears)

  const yearSelection = form === 'evaluation' ? [2019, 2020, 2021, 2022, 2023] : multipleYears

  const filterColor = (yearsIndex, color, colorKey) => {
    const newColors = colors.map((c, index) =>
      index === yearsIndex && colors[yearsIndex] !== color ? color : colors[index],
    )
    const newButtons = buttons.map((b, index) =>
      index === yearsIndex && buttons[yearsIndex] !== colorKey ? colorKey : buttons[index],
    )
    setColors(newColors)
    setButtons(newButtons)
  }

  const buttonColors = ['all', 'green', 'yellow', 'red']

  if (!answers) return null

  const columnNumber = form === 'evaluation' ? answers.length + 1 : answers.length

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
              {question.labelIndex}. {question.label.toUpperCase()}
            </p>
          </Grid.Column>
        </Grid>
      </Accordion.Title>
      <Accordion.Content active={showing}>
        <Grid>
          <Grid.Row columns={columnNumber}>
            {answers.map(
              (year, yearsIndex) =>
                yearSelection.includes(year.year) && (
                  <Grid.Column key={generateRandomKey(year)} className="question-content">
                    <div className="comparison color-buttons noprint">
                      <label>{year.year}</label>
                      {!form === 'evaluation' &&
                        buttonColors.map((color, index) => (
                          <ButtonPopup
                            key={color}
                            color={color}
                            index={index}
                            yearsIndex={yearsIndex}
                            buttons={buttons}
                            filterColor={filterColor}
                          />
                        ))}
                    </div>
                    {year.answers.length > 0 ? (
                      year.answers.map(programme => {
                        if (colors[yearsIndex] === 'all' || programme.color === colors[yearsIndex]) {
                          return (
                            <div key={generateRandomKey(`${programme}-${year}`)}>
                              <label className="answer-title">
                                {programme.name} <span className={`answer-circle-${programme.color}`} />
                              </label>
                              <ul className="answer-list" data-cy={`compare-question-content-${question.id}`}>
                                {programme.answer &&
                                  programme.answer.split('\n').map(row => (
                                    <li key={generateRandomKey(programme)} className="answer-row">
                                      {row}
                                    </li>
                                  ))}
                              </ul>
                            </div>
                          )
                        }
                        return null
                      })
                    ) : (
                      <h4>{form === 'evaluation' ? t('empty') : t('noData')}</h4>
                    )}
                  </Grid.Column>
                ),
            )}
          </Grid.Row>
        </Grid>
      </Accordion.Content>
    </>
  )
}

export default Question
