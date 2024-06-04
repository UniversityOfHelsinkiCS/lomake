import React, { useEffect } from 'react'
import MetaEntity from 'Components/Generic/MetaEntity'
import { useSelector, useDispatch } from 'react-redux'
import { Redirect } from 'react-router'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import { useTranslation } from 'react-i18next'
import { wsJoinRoom, wsLeaveRoom } from 'Utilities/redux/websocketReducer'
import { setViewOnly, getSingleProgrammesAnswers } from 'Utilities/redux/formReducer'
import { getFormViewRights } from 'Utilities/common'
import { isAdmin } from '@root/config/common'

import { metareviewQuestions as questions } from '../../../questionData'
// tämä on samanlainen kuin Evaluationiew/EvaluationFormView/index.js

const form = 7

// eslint-disable-next-line no-unused-vars
const ProgrammeLevelForm = ({ room }) => {
  const lang = useSelector(state => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const currentRoom = useSelector(state => state.room)
  const programme = useSelector(state => state.studyProgrammes.singleProgram)
  const year = 2024
  const { draftYear, nextDeadline } = useSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find(d => d.form === form) : null
  const viewingOldAnswers = useSelector(state => state.form.viewingOldAnswers)
  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const accessToTempAnswers = user.yearsUserHasAccessTo.includes(year)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  useEffect(() => {
    if (!programme) return
    dispatch(getSingleProgrammesAnswers({ room, year, form }))
    if (
      getFormViewRights({
        accessToTempAnswers,
        programme,
        writeAccess,
        viewingOldAnswers,
        draftYear,
        year,
        formDeadline,
        form,
      })
    ) {
      dispatch(setViewOnly(true))
      if (currentRoom) dispatch(wsLeaveRoom(room))
    } else {
      dispatch(wsJoinRoom(room, form))
      dispatch(setViewOnly(false))
    }
  }, [programme, writeAccess, viewingOldAnswers, year, draftYear, accessToTempAnswers, room, user])

  if (!user || !room) return <Redirect to="/" />

  const partComponentMap = {
    META_ENTITY: MetaEntity,
  }

  const partMap = part => {
    const Component = partComponentMap[part.type]

    const divStyle = {}
    const number = 1
    const label = part.label[lang]

    return (
      <div key={part.id} style={divStyle}>
        <Component
          id={part.id}
          label={label}
          description={part.description[lang]}
          required={part.required}
          number={number}
          options={part.options}
          lang={lang}
          radioOptions={part.radioOptions}
          form={form}
          actions={part.actions[lang]}
        />
      </div>
    )
  }

  return (
    <div>
      <h1>Programme Level form</h1>
      {questions.map(question => (
        <div key={question.id}>{partMap(question)}</div>
      ))}
    </div>
  )
}

export default ProgrammeLevelForm
