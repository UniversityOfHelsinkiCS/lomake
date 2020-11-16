import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Segment } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

const QuestionList = ({ questions, setPicked, picked }) => {
  const lang = useSelector((state) => state.language)

  const addToList = (question) => {
    if (!picked.includes(question)) {
      setPicked(() => [...picked, question])
    }
  }

  return (
    <>
    <Segment className="question-list-container" data-cy="comparison-question-list">
      <p>{translations.nowShowing[lang]}</p>
      {questions.length > 0 ? (
        <>
          {questions.map(
            (p) =>
              picked.includes(p) && (
                <p
                  className="question-list-included"
                  data-cy={`question-list-${p}`}
                  onClick={() => addToList(p)}
                  key={p}
                >
                  {p}
                </p>
              )
          )}
          <div className="ui divider" />
          <p>{translations.chooseMore[lang]}</p>
          {questions.map(
            (p) =>
              !picked.includes(p) && (
                <p
                  className="question-list-excluded"
                  data-cy={`question-list-${p.key}`}
                  onClick={() => addToList(p)}
                  key={p.key}
                >
                  {p}
                </p>
              )
          )}
        </>
      ) : (
        <h4>{translations.noData[lang]}</h4>
      )}
    </Segment>
    <Button
      color="blue"
      onClick={() => setPicked(questions)}
      data-cy="question-list-select-all"
    >
      {translations.selectAll[lang]}
    </Button>
    <Button onClick={() => setPicked([])}>{translations.clearSelection[lang]}</Button>
    </>
  )
}

export default QuestionList
