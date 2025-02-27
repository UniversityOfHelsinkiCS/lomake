import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { colors } from '../../util/common'
import './Generic.scss'

export default ({ fieldName }) => {
  const { t } = useTranslation()
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)
  const currentUserUid = useSelector(state => state.currentUser.data.uid)

  if (!currentEditors || !currentEditors[fieldName]) return null
  if (currentEditors[fieldName].uid === currentUserUid) return null

  return (
    <Typography variant="italic" style={{ color: colors.blue, marginLeft: '1em' }}>
      {`${currentEditors[fieldName].lastname}, ${currentEditors[fieldName].firstname} ${t('generic:isWriting')}`}
      <Icon style={{ marginLeft: '5px' }} name="pencil" />
    </Typography>
  )
}
