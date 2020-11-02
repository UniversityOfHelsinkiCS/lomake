import React, { useRef, useState } from 'react'
import { Icon, Input, Popup, Button, Message } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { resetTokenAction, createTokenAction } from 'Utilities/redux/accessTokenReducer'
import { basePath } from '@root/config/common'
import { isSuperAdmin } from '@root/config/common'
import { colors } from 'Utilities/common'
import { overviewPageTranslations as translations } from 'Utilities/translations'


const OwnerAccordionLinks = ({ programme }) => {
  const lang = useSelector((state) => state.language)
  const tokens = useSelector((state) => state.programmesTokens)
  const user = useSelector(({ currentUser }) => currentUser.data)
  const [copied, setCopied] = useState(false)
  const viewLinkRef = useRef(null)
  const editLinkRef = useRef(null)
  const dispatch = useDispatch()

  //https://stackoverflow.com/a/42844911
  function copyToClipboard(editOrView) {
    let ref = viewLinkRef
    if (editOrView === 'EDIT') ref = editLinkRef
    ref.current.select()
    document.execCommand('copy')
    setCopied(editOrView)
    setTimeout(() => {
      setCopied(null)
    }, 5000)
  }

  if (!tokens.data || tokens.pending) return null

  const viewToken = tokens.data.find((t) => t.type === 'READ')
  const editToken = tokens.data.find((t) => t.type === 'WRITE')

  const createOrResetToken = (token, type) => {
    if (!token) {
      dispatch(createTokenAction(programme, type))
    } else {
      const { url } = token
      dispatch(resetTokenAction(programme, url))
    }
  }

  const urlPrefix = `${window.location.origin}${basePath}access/`

  const ResetConfirmation = ({ token, type }) => {
    return (
      <Popup
        trigger={
          <div
            data-cy={`${programme}-${type === 'READ' ? 'viewlink' : 'editlink'}-reset`}
            style={{
              cursor: 'pointer',
              color: colors.red,
              textDecoration: 'underline',
              marginLeft: '2em',
              width: '300px',
            }}
          >
            {token
              ? translations.resetPrompt[lang]
              : translations.createPrompt[lang]}
          </div>
        }
        content={
          <>
            <Message negative>
              <Message.Header> {translations.resetWarning[lang]}</Message.Header>
            </Message>
            <Button
              data-cy="confirm-reset"
              fluid
              negative
              content={'OK'}
              onClick={() => createOrResetToken(token, type)}
            />
          </>
        }
        on="click"
        position="top left"
      />
    )
  }

  return (
    <div style={{ margin: '2em 0em' }}>
      <div style={{ fontWeight: 'bold', marginLeft: '3em' }}>
        <h2>{translations.readAccess[lang]}</h2>
        {translations.viewPrompt[lang]}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '1em 3em 0 3em', paddingBottom: '1em'}}>
        <Input
          data-cy={`${programme}-viewlink`}
          style={{ width: '600px' }}
          action={{
            icon: <Icon name={copied === 'VIEW' ? 'checkmark' : 'copy'} link />,
            content: translations.copyLink[lang],
            onClick: () => copyToClipboard('VIEW'),
          }}
          value={viewToken ? `${urlPrefix}${viewToken.url}` : ''}
          onChange={null}
          ref={viewLinkRef}
          />
        {isSuperAdmin(user.uid) && <ResetConfirmation token={viewToken} type="READ" />}
      </div>
      <div style={{ fontWeight: 'bold', marginLeft: '3em', marginTop: '1em', padding: '0.2em 0'}}>
        <h2>{translations.writeAccess[lang]}</h2>
        {translations.editPrompt[lang]}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '1em 3em' }}>
        <Input
          style={{ width: '600px' }}
          data-cy={`${programme}-editlink`}
          action={{
            icon: <Icon name={copied === 'EDIT' ? 'checkmark' : 'copy'} link />,
            content: translations.copyLink[lang],
            onClick: () => copyToClipboard('EDIT'),
          }}
          value={editToken ? `${urlPrefix}${editToken.url}` : ''}
          onChange={null}
          ref={editLinkRef}
        />
        {isSuperAdmin(user.uid) && <ResetConfirmation token={editToken} type="WRITE" />}
      </div>
    </div>
  )
}

export default OwnerAccordionLinks
