import React from 'react'
import { Typography } from '@mui/material'

import './Generic.scss'

const NoPermissions = ({ t }) => (
  <Typography data-cy="no-permissions-message" style={{ textAlign: 'center', paddingTop: '5em' }} as="h2" disabled>
    {t('generic:noPermissions')}
  </Typography>
)

export default NoPermissions
