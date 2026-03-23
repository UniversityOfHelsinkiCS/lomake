import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { Typography } from '@mui/material'

import { colors } from '../../util/common'
import './Generic.scss'

export default ({ fieldName }) => {
  const { t } = useTranslation()
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)
  const currentUserUid = useSelector(state => state.currentUser.data.uid)

  if (!currentEditors?.[fieldName]) return null
  if (currentEditors[fieldName].uid === currentUserUid) return null

  return (
    <Typography style={{ color: colors.blue, marginLeft: '1em' }} variant="italic">
      {`${currentEditors[fieldName].lastname}, ${currentEditors[fieldName].firstname} ${t('generic:isWriting')}`}
      <Icon name="pencil" style={{ marginLeft: '5px' }} />
    </Typography>
  )
}
