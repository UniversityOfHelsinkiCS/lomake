import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Redirect, useHistory } from 'react-router'
import { Button } from 'semantic-ui-react'
import { useSelector } from 'react-redux'
import { isAdmin } from '@root/config/common'

const FacultyFormView = ({ room, formString }) => {
  const history = useHistory()
  const form = parseInt(formString, 10) || null
  const { t } = useTranslation()
  const lang = useSelector(state => state.language)
  const user = useSelector(state => state.currentUser.data)

  useEffect(() => {
    document.title = `${t('evaluation')} - ${room}`
  }, [lang, room])

  // TO FIX To be removed
  if (!isAdmin(user)) return <Redirect to="/" />

  if (!room || !form) return <Redirect to="/" />

  return (
    <>
      <div style={{ marginBottom: '2em' }}>
        <Button onClick={() => history.push('/evaluation-faculty')} icon="arrow left" />
      </div>
      Saavuit tiedekunnan {room} lomakesivulle! Tämä näkymä on vielä kehitysvaiheessa.
    </>
  )
}

export default FacultyFormView
