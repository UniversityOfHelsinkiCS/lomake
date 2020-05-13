import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'

export default ({ fieldName }) => {
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)
  const currentUserUid = useSelector((state) => state.currentUser.data.uid)
  const languageCode = useSelector((state) => state.language)

  const translations = {
    isWriting: {
      fi: 'kirjoittaa',
      se: '',
      en: 'is writing',
    },
  }

  if (!currentEditors || !currentEditors[fieldName]) return null
  if (currentEditors[fieldName].uid === currentUserUid) return null

  return (
    <span style={{ color: 'red', fontStyle: 'italic', marginLeft: '1em' }}>
      {`${currentEditors[fieldName].lastname}, ${currentEditors[fieldName].firstname} ${translations['isWriting'][languageCode]}`}
      <Icon style={{ marginLeft: '5px' }} name={'pencil'} />
    </span>
  )
}
