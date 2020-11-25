import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

const QuestionList = ({ questions, setQuestions, questionLabels, label }) => {
  const lang = useSelector((state) => state.language)

  const addToList = (_, { value }) => {
    setQuestions(value)
  }

  const options = questionLabels.map((q) => Object({ key: q, text: q, value: q }))

  return (
    <div className="questions-list-container" data-cy="comparison-question-list">
      <label className={`questions-list-label${questions.length === 0 ? "-bolded" : ""}`}>{label}</label>
      <Dropdown
        className="questions-list-selector"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder={translations.selectQuestions[lang]}
        options={options}
        onChange={addToList}
        value={questions}
        multiple
        selection
      />
      <Button
        className="questions-list-button"
        color="blue"
        onClick={() => setQuestions(questionLabels)}
        data-cy="questions-list-select-all"
      >
        {translations.selectAll[lang]}
      </Button>
      <Button onClick={() => setQuestions([])} className="questions-list-button">
        {translations.clearSelection[lang]}
      </Button>
    </div>
  )
}

export default QuestionList
