import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Redirect } from 'react-router'

import { isAdmin } from '@root/config/common'
import { getProgramme } from 'Utilities/redux/studyProgrammesReducer'

const PastAnswersView = ({ programmeKey }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  const writeAccess = (user.access[programmeKey] && user.access[programmeKey].write) || isAdmin(user)
  const readAccess = (user.access[programmeKey] && user.access[programmeKey].read) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('Katselmus')} - ${programmeKey}`
    dispatch(getProgramme(programmeKey))
  }, [lang, programmeKey])

  if (!programmeKey || (!readAccess && !writeAccess)) return <Redirect to="/" />

  return <>Tässä tuloksia ohjelmalle {programmeKey} </>
}

export default PastAnswersView
