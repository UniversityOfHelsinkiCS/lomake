import React from 'react'
import { Header } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import './Generic.scss'

const NoPermissions = () => {
  const { t } = useTranslation()
  return (
    <Header data-cy="no-permissions-message" style={{ textAlign: 'center', paddingTop: '5em' }} as="h2" disabled>
      {t('generic:noPermissions')}
    </Header>
  )
}

export default NoPermissions
