import React from 'react'
import { Button, Modal, Message } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

const SendFormModal = ({ openButton, header, description, sendButton, open, setOpen, message }) => {
  const { t } = useTranslation()

  return (
    <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open} trigger={openButton}>
      <Modal.Header>{header}</Modal.Header>
      {message ? (
        <Modal.Content>
          {' '}
          <Message size="tiny" header={message} color="red" />
        </Modal.Content>
      ) : null}
      <Modal.Content image>
        <Modal.Description>{description}</Modal.Description>
      </Modal.Content>
      <Modal.Actions style={{ display: 'flex' }}>
        <Button
          data-cy="individual-form-send-form-button"
          content={t('send')}
          labelPosition="right"
          icon="checkmark"
          onClick={sendButton}
          positive
        />
        <Button color="black" onClick={() => setOpen(false)}>
          {t('close')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default SendFormModal
