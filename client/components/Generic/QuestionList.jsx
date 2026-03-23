/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Dropdown } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getLabel } from '../../util/common'
import { setQuestions } from '../../redux/filterReducer'
import './Generic.scss'

const QuestionList = ({ label, questionsList, onlyColoredQuestions }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)

  const questions = useSelector(({ filters }) => filters.questions)

  const questionLabels = questionsList.map(q => getLabel(q))

  useEffect(() => {
    dispatch(setQuestions({ selected: questionLabels, open: [] }))
  }, [lang])

  const addToList = (_, { value }) => {
    dispatch(setQuestions({ selected: value, open: [] }))
  }

  const options = questionsList.map(q => {
    if (onlyColoredQuestions && !q.noColor) {
      return Object({ key: q.index, text: q.label, value: getLabel(q) })
    }
    if (!onlyColoredQuestions) {
      if (q.type === 'ENTITY' || q.type === 'MEASUREMENTS' || q.type === 'CHOOSE-RADIO') {
        return Object({ key: q.labelIndex, text: `${q.labelIndex}. ${q.label}`, value: getLabel(q) })
      }
      return Object({ key: `${q.labelIndex}. ${q.id}`, text: `${q.labelIndex}. ${q.label}`, value: getLabel(q) })
    }
    return undefined
  })

  return (
    <div className="questions-list-container" data-cy="comparison-question-list">
      <label className={`questions-list-label${questions.length === 0 ? '-bolded' : ''}`}>{label}</label>
      <Dropdown
        className="comparison-questions-list-selector"
        data-cy="questions-list"
        fluid
        multiple
        name="questions-list"
        onChange={addToList}
        options={options}
        placeholder={label}
        selection
        value={questions.selected}
      />
      <Button
        className="questions-list-button"
        color="blue"
        data-cy="questions-list-select-all"
        onClick={() => dispatch(setQuestions({ selected: questionLabels, open: [] }))}
      >
        {t('selectAll')}
      </Button>
      <Button
        className="comparison-questions-list-button"
        onClick={() => dispatch(setQuestions({ selected: [], open: [] }))}
      >
        {t('clearSelection')}
      </Button>
    </div>
  )
}

export default QuestionList
