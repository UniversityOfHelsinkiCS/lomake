import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { colors } from 'Utilities/common'
import './Generic.scss'

export default ({ fieldName }) => {
  const { t } = useTranslation()
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)
  const currentUserUid = useSelector(state => state.currentUser.data.uid)

  if (!currentEditors || !currentEditors[fieldName]) return null
  if (currentEditors[fieldName].uid === currentUserUid) return null

  return (
    <span style={{ color: colors.blue, fontStyle: 'italic', marginLeft: '1em' }}>
      {`${currentEditors[fieldName].lastname}, ${currentEditors[fieldName].firstname} ${t('generic:isWriting')}`}
      <Icon style={{ marginLeft: '5px' }} name="pencil" />
    </span>
  )
}
