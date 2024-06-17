import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Icon, Input, Radio } from 'semantic-ui-react'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { sortedItems } from 'Utilities/common'
import MetaTableCell from './MetaTableCell'

const MetaTable = ({
  programmes,
  questions,
  onButtonClick,
  handleFilterChange,
  filterValue,
  handleShowProgrammes,
  showAllProgrammes,
}) => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers)
  const [sorter, setSorter] = useState('name')
  const [reverse, setReverse] = useState(false)

  const form = 7
  const year = 2024

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, year))
  }, [dispatch])

  const sortedProgrammes = sortedItems(programmes, sorter, lang)
  if (reverse) sortedProgrammes.reverse()

  const sort = sortValue => {
    setSorter(sortValue)
    setReverse(!reverse)
  }

  const selectorLabel = t('showAllProgrammes')

  return (
    <table border="0">
      <thead className="sticky-header">
        <tr>
          <th>
            <div style={{ cursor: 'pointer' }} onClick={() => sort('name')}>
              {t('programmeHeader')}
              <Icon name="sort" />
            </div>
          </th>
          <th>
            <div style={{ cursor: 'pointer' }} onClick={() => sort('key')}>
              {t('code')}
              <Icon name="sort" />
            </div>
          </th>
          {questions.map(question =>
            question.parts.map(part => (
              <th>
                <span className="vertical-text">
                  {part.shortLabel[lang]} {part.index}
                </span>
              </th>
            )),
          )}
        </tr>
      </thead>
      <tbody>
        <tr key="radio-row">
          <td key="radio">
            <Radio
              style={{ marginRight: 'auto', marginBottom: '2em' }}
              data-cy="overviewpage-filter-button"
              toggle
              onChange={handleShowProgrammes}
              checked={showAllProgrammes}
              label={selectorLabel}
            />
          </td>
        </tr>
        <tr key="input-row">
          <td key="input">
            <Input
              style={{ marginBottom: '0.5em' }}
              icon="filter"
              size="small"
              placeholder={t('programmeFilter')}
              onChange={handleFilterChange}
              value={filterValue}
              aria-label={`${t('programmeFilter')}`}
            />
          </td>
        </tr>
        {programmes.map(programme => (
          <tr style={{ lineHeight: '3' }} key={programme.id}>
            <td key={`${programme.id}-name`}>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.name[lang]}</Link>
            </td>
            <td key={`${programme.id}-key`}>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.key}</Link>
            </td>
            {questions.map(question =>
              question.parts.map(part => {
                const programmeAnswers = answers.data
                  ? answers.data.find(answer => answer.programme === programme.key)
                  : null
                const answer = programmeAnswers ? programmeAnswers.data[`${part.id}_text`] : undefined
                return (
                  <MetaTableCell
                    key={`${programme.id}-${question.id}-${part.id}`}
                    question={part}
                    answer={answer}
                    onButtonClick={onButtonClick}
                  />
                )
              }),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MetaTable
