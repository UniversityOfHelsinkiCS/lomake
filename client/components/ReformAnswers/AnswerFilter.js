/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

const FilterQuestion = ({ question, filters, setFilters }) => {
  const options = question.radioOptions.en.map(o => o.id)
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const questionId = question.id

  const setTheFilter = opt => {
    const otherFilters = filters.filter(f => !f[question.id])
    setFilters(otherFilters.concat({ [questionId]: opt }))
  }

  const resetTheFilter = () => {
    const newFilters = filters.filter(f => !f[question.id])
    setFilters(newFilters)
  }

  const labelFor = opt => {
    const labels = question.radioOptions[lang]
    return labels.find(lb => lb.id === opt).label
  }

  const isSet = opt => {
    const theFilter = filters.find(f => Object.keys(f).includes(question.id))

    if (opt === 'all' && !theFilter) {
      return { backgroundColor: 'lightgrey', marginRight: 3 }
    }

    if (theFilter && opt === theFilter[question.id]) {
      return { backgroundColor: 'lightgrey', marginRight: 3 }
    }

    return { marginRight: 3 }
  }

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ marginBottom: 5 }}>{question.shortLabel[lang]}</div>
      <div>
        {options.map(opt => (
          <button style={isSet(opt)} key={opt} onClick={() => setTheFilter(opt)}>
            {labelFor(opt)}
          </button>
        ))}
        <span>
          <button style={isSet('all')} onClick={() => resetTheFilter()}>
            {t('report:all')}
          </button>
        </span>
      </div>
    </div>
  )
}

const AnswerFilter = ({ filters, setFilters }) => {
  const { t } = useTranslation()

  const filterQuestionIds = ['how_many_years', 'primary_role', 'background_unit']

  const filterQuestions = filterQuestionIds.map(id => questionData[0].parts.find(p => p.id === id))

  const style = {
    marginTop: 20,
    marginBottom: 20,
    borderStyle: 'solid',
    padding: 10,
  }

  return (
    <div style={style}>
      <h4>{t('report:filterBy')}</h4>
      {filterQuestions.map(question => (
        <FilterQuestion key={question.id} question={question} setFilters={setFilters} filters={filters} />
      ))}
    </div>
  )
}

export default AnswerFilter
