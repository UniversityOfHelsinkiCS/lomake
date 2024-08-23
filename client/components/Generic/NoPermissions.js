import React from 'react'
import { Header } from 'semantic-ui-react'

import './Generic.scss'

const NoPermissions = ({ t, requestedForm }) => (
  <Header data-cy="no-permissions-message" style={{ textAlign: 'center', paddingTop: '5em' }} as="h2" disabled>
    {t('generic:noPermissions', { requestedForm: requestedForm ? requestedForm.toLowerCase() : '' })}
  </Header>
)

export default NoPermissions
