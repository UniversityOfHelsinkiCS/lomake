import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Icon } from 'semantic-ui-react'

const ReadyToggle = ({ ready, handleClick }) => {
  const { t } = useTranslation()

  return (
    <div style={{ margin: '10rem 0 10rem 0' }}>
      <Button color={ready ? 'green' : 'blue'} onClick={handleClick} icon labelPosition="left" data-cy="toggleReady">
        <Icon name={ready ? 'check' : 'time'} />
        {ready ? t('generic:ready') : t('generic:notReady')}
      </Button>
    </div>
  )
}

export default ReadyToggle
