import { Typography } from '@mui/material'

import './Generic.scss'
import LockIcon from '@mui/icons-material/Lock'

const NoPermissions = ({ t, requestedForm }) => {
  const noPermissionsText = t('generic:noPermissions', {
    requestedForm: requestedForm ? requestedForm.toLowerCase() : '',
  }).match(/[^.]+[.]/g)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        paddingTop: '15em',
      }}
    >
      <LockIcon color="grey" fontSize="large" />
      <Typography data-cy="no-permissions-message" sx={{ color: 'grey', textAlign: 'center' }} variant="h1">
        {noPermissionsText[0]}
        <br />
        {noPermissionsText[1]}
      </Typography>
    </div>
  )
}

export default NoPermissions
