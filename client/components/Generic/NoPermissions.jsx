import React from 'react'
import { Header } from 'semantic-ui-react'

import './Generic.scss'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon/Icon'

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
      <Icon name="lock huge grey" />
      <Header data-cy="no-permissions-message" style={{ textAlign: 'center' }} as="h1" disabled>
        {noPermissionsText[0]}
        <br />
        {noPermissionsText[1]}
      </Header>
    </div>
  )
}

export default NoPermissions
