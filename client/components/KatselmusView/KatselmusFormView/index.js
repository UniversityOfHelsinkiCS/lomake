import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import { isAdmin } from '@root/config/common'
import { colors } from 'Utilities/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'
import NoPermissions from 'Components/Generic/NoPermissions'
import NavigationSidebar from 'Components/FormView/NavigationSidebar'

// import positiveEmoji from 'Assets/sunglasses.png'
// import neutralEmoji from 'Assets/neutral.png'
// import negativeEmoji from 'Assets/persevering.png'

// import questions from '../../../katselmusQuestions.json'

const KatselmusFormView = ({ room }) => {
  const dispatch = useDispatch()
  // const history = useHistory()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)
  // const programme = useSelector(state => state.studyProgrammes.singleProgram)
  // ^ might need to create a new state to not mess with vuosikatsaus?

  // temporary fix for programme being lost in refresh
  const allProgrammes = useSelector(state => state.studyProgrammes.data)
  const programme = Object.values(allProgrammes).find(p => p.key === room)

  const writeAccess = (user.access[room] && user.access[room].write) || isAdmin(user)
  const readAccess = (user.access[room] && user.access[room].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('Katselmus')} - ${room}`
    dispatch(getProgramme(room))
  }, [lang, room])

  if (!room) return <Redirect to="/" />

  if (!readAccess && !writeAccess) return <NoPermissions t={t} />

  return (
    <div className="form-container">
      <NavigationSidebar programmeKey={room} katselmus />
      <div className="the-form">
        <h1 style={{ color: colors.blue }}>{programme.name[lang]}</h1>
        <h3 style={{ marginTop: '0' }} data-cy="formview-title">
          {t('katselmus')} 2023
        </h3>
      </div>
    </div>
  )
}

export default KatselmusFormView
