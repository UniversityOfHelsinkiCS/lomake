import React from 'react'
import { useSelector } from 'react-redux'
import { Icon } from 'semantic-ui-react'

export default ({ fieldName }) => {
  const currentEditors = useSelector(({ currentEditors }) => currentEditors.data)

  if (!currentEditors || !currentEditors[fieldName]) return null

  return (
    <span style={{ marginLeft: '2em' }}>
      <Icon loading name={'sync alternate'} /> {currentEditors[fieldName].name}
    </span>
  )
}
