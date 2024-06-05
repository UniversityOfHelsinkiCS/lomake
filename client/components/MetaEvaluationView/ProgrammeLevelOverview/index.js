import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { useVisibleOverviewProgrammes } from 'Utilities/overview'

const ProgrammeLevelOverview = () => {
  const { t } = useTranslation()
  const showAllProgrammes = false

  const lang = useSelector(state => state.language)
  const currentUser = useSelector(state => state.currentUser)
  const programmes = useSelector(({ studyProgrammes }) => studyProgrammes.data)

  // eslint-disable-next-line
  const form = 8
  // eslint-disable-next-line
  const formType = 'meta-evaluation'

  const questions = ['q1', 'q2']

  useEffect(() => {
    document.title = `${t('overview')}`
  }, [lang])

  const usersProgrammes = useVisibleOverviewProgrammes({ currentUser, programmes, showAllProgrammes })

  const isQuestionFilled = (programmeId, questionId) => {
    // Replace this with your logic to determine if a question is filled
    // For demonstration, let's assume an object where this data is stored
    const filledQuestions = {
      1: { 1: true, 2: false },
      2: { 1: true, 2: true },
    }

    return filledQuestions[programmeId] && filledQuestions[programmeId][questionId]
  }

  return (
    <div>
      <h1>Programme Level Overview</h1>
      {usersProgrammes.length > 0 ? (
        <table border="1">
          <thead>
            <tr>
              <th>Programme / Question</th>
              {questions.map(question => (
                <th key={question.id}>{question}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {programmes.map(programme => (
              <tr key={programme.id}>
                <td>
                  <Link to={`/meta-evaluation/form/${programme.key}`}>{programme.name[lang]}</Link>
                </td>
                {questions.map(question => (
                  <td key={question.id}>{isQuestionFilled(programme.id, question.id) ? 'Filled' : 'Not Filled'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No visible programmes</p>
      )}
    </div>
  )
}

export default ProgrammeLevelOverview
