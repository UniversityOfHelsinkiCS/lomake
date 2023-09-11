/* eslint-disable react/button-has-type */
/* eslint-disable no-restricted-syntax */
import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { degreeReformIndividualQuestions as questionData } from '../../questionData'

const AnswerFilter = ({ filters, setFilters }) => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()

  const yearsInUniv = questionData[0].parts.find(p => p.id === 'how_many_years')
  const options = yearsInUniv.radioOptions.en.map(o => o.id)

  const style = {
    marginTop: 20,
    marginBottom: 20,
    borderStyle: 'solid',
    padding: 10,
  }

  const setTheFilter = opt => {
    setFilters([{ how_many_years: opt }])
  }

  const isSet = opt => {
    if (opt === 'all' && filters.length === 0) {
      return { backgroundColor: 'lightgrey' }
    }

    if (filters.length === 0) {
      return {}
    }

    if (opt === filters[0].how_many_years) {
      return { backgroundColor: 'lightgrey' }
    }

    return {}
  }

  const labelFor = opt => {
    const labels = yearsInUniv.radioOptions[lang]
    return labels.find(lb => lb.id === opt).label
  }

  return (
    <div style={style}>
      <h4>{t('report:filterBy')}</h4>
      <div>
        <div style={{ marginBottom: 10 }}>{yearsInUniv.shortLabel[lang]}</div>
        <div>
          {options.map(opt => (
            <button style={isSet(opt)} key={opt} onClick={() => setTheFilter(opt)}>
              {labelFor(opt)}
            </button>
          ))}
          <span>
            <button style={isSet('all')} onClick={() => setFilters([])}>
              {t('report:all')}
            </button>
          </span>
        </div>
      </div>
    </div>
  )
}

export default AnswerFilter
