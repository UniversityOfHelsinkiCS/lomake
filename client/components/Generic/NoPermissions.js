import React from 'react'
import { Header } from 'semantic-ui-react'
import { genericTranslations as translations } from 'Utilities/translations'

const NoPermissions = ({ languageCode }) => (
  <Header
    data-cy="no-permissions-message"
    style={{ textAlign: 'center', paddingTop: '5em' }}
    as="h2"
    disabled
  >
    {translations.noPermissions[languageCode]}
  </Header>
)

export default NoPermissions