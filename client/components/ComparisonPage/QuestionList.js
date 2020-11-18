import React from 'react'
import { useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { comparisonPageTranslations as translations } from 'Utilities/translations'

const QuestionList = ({ questions, setPicked, picked, label }) => {
  const lang = useSelector((state) => state.language)

  const addToList = (_,{ value }) => {
    setPicked(value)
  }

  const options = questions.map((q) => Object({ key: q, text: q, value: q}))

  return (
    <div className="questions-list-container" data-cy="comparison-question-list">
      <label>{label}</label>
      <Dropdown
        className="button basic gray"
        data-cy="questions-list"
        name="questions-list"
        fluid
        placeholder="Select questions"
        options={options}
        onChange={addToList}
        value={picked}
        multiple
        selection
      />
      <Button
        className="questions-list-button"
        color="blue"
        onClick={() => setPicked(questions)}
        data-cy="questions-list-select-all"
      >
        {translations.selectAll[lang]}
      </Button>
      <Button 
        onClick={() => setPicked([])}
        className="questions-list-button"
      >
        {translations.clearSelection[lang]}
      </Button>
    </div>
  )
}

export default QuestionList
