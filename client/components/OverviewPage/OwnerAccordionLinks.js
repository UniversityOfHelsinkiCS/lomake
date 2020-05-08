import React, { useRef, useState, useEffect } from 'react'
import { Icon, Input } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { resetTokenAction, createTokenAction } from 'Utilities/redux/accessTokenReducer'
import { inProduction } from '../../../config/common'

const translations = {
  editPrompt: {
    fi: 'Linkillä saa vastausoikeuden, jaa vain lomakkeen täyttäjille:',
    en: 'Link grants edit access, share to editors only:',
    se: '',
  },
  viewPrompt: {
    fi: 'Linkillä saa lukuoikeuden, jaa esim. johtoryhmälle:',
    en: 'Link grants read access, share e.g. to student members',
    se: '',
  },
  resetPrompt: {
    fi: 'Nollaa ja luo uusi jakolinkki',
    en: 'Reset the current link, and generate a new one',
    se: '',
  },
  createPrompt: {
    fi: 'Luo linkki',
    en: 'Create link',
    se: '',
  },
}

const OwnerAccordionLinks = ({ programme }) => {
  const languageCode = useSelector((state) => state.language)
  const tokens = useSelector((state) => state.programmesTokens)
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

  const urlPrefix = inProduction
    ? 'https://study.cs.helsinki.fi/lomake/access/'
    : 'http://localhost:8000/access/'

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', margin: '1em 3em 0 3em' }}>
        <div style={{ marginRight: '2em', width: '375px' }}>
          {translations.viewPrompt[languageCode]}
        </div>
        <Input
          data-cy={`${programme}-viewlink`}
          style={{ width: '500px' }}
          icon={
            <Icon
              name={copied === 'VIEW' ? 'checkmark' : 'copy'}
              inverted
              circular
              link
              onClick={() => copyToClipboard('VIEW')}
            />
          }
          value={viewToken ? `${urlPrefix}${viewToken.url}` : ''}
          onChange={null}
          ref={viewLinkRef}
        />
        <div
          onClick={() => createOrResetToken(viewToken, 'READ')}
          data-cy={`${programme}-viewlink-reset`}
          style={{
            cursor: 'pointer',
            color: 'red',
            textDecoration: 'underline',
            marginLeft: '2em',
            width: '300px',
          }}
        >
          {viewToken
            ? translations.resetPrompt[languageCode]
            : translations.createPrompt[languageCode]}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', margin: '0 3em' }}>
        <div style={{ marginRight: '2em', width: '375px' }}>
          {translations.editPrompt[languageCode]}
        </div>
        <Input
          style={{ width: '500px' }}
          data-cy={`${programme}-editlink`}
          icon={
            <Icon
              name={copied === 'EDIT' ? 'checkmark' : 'copy'}
              inverted
              circular
              link
              onClick={() => copyToClipboard('EDIT')}
            />
          }
          value={editToken ? `${urlPrefix}${editToken.url}` : ''}
          onChange={null}
          ref={editLinkRef}
        />
        <div
          data-cy={`${programme}-editlink-reset`}
          onClick={() => createOrResetToken(editToken, 'WRITE')}
          style={{
            cursor: 'pointer',
            color: 'red',
            textDecoration: 'underline',
            marginLeft: '2em',
            width: '300px',
          }}
        >
          {editToken
            ? translations.resetPrompt[languageCode]
            : translations.createPrompt[languageCode]}
        </div>
      </div>
    </>
  )
}

export default OwnerAccordionLinks
