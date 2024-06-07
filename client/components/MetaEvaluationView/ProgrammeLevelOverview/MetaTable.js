import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Loader, Icon } from 'semantic-ui-react'
import { getTempAnswersByFormAndYear } from 'Utilities/redux/tempAnswersReducer'
import { sortedItems } from 'Utilities/common'

const MetaTable = ({ programmes, questions }) => {
  const lang = useSelector(state => state.language)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const answers = useSelector(state => state.tempAnswers)
  const [sorter, setSorter] = useState('name')
  const [reverse, setReverse] = useState(false)

  const form = 7

  useEffect(() => {
    dispatch(getTempAnswersByFormAndYear(form, 2024))
  }, [dispatch])

  const sortedProgrammes = sortedItems(programmes, sorter, lang)
  if (reverse) sortedProgrammes.reverse()

  const sort = sortValue => {
    setSorter(sortValue)
    setReverse(!reverse)
  }

  if (answers.pending || !answers.data) {
    return <Loader active inline="centered" />
  }

  return (
    <table border="0">
      <thead className="sticky-header">
        <tr>
          <th>
            <div onClick={() => sort('name')}>
              {t('programmeHeader')}
              <Icon name="sort" />
            </div>
          </th>
          <th>
            <div onClick={() => sort('key')}>
              {t('code')}
              <Icon name="sort" />
            </div>
          </th>
          {questions.map(question => (
            <th key={question.id}>
              <span className="vertical-text">{question.shortLabel[lang]}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {programmes.map(programme => (
          <tr style={{ lineHeight: '3' }} key={programme.id}>
            <td>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.name[lang]}</Link>
            </td>
            <td>
              <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.key}</Link>
            </td>
            {questions.map(question => {
              const programmeAnswers = answers.data.find(answer => answer.programme === programme.key)
              const answerStatus =
                programmeAnswers && programmeAnswers.data[`${question.id}_text`] !== undefined ? 'Filled' : 'Not Filled'
              return <td key={question.id}>{answerStatus}</td>
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MetaTable
