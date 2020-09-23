import React from 'react'
import { Header } from 'semantic-ui-react'
import { translations } from 'Utilities/translations'

const NoPermissions = ({ languageCode }) => (
  <Header
    data-cy="noPermissions-message"
    style={{ textAlign: 'center', paddingTop: '5em' }}
    as="h2"
    disabled
  >
    {translations.noPermissions[languageCode]}
  </Header>
)

export default NoPermissions