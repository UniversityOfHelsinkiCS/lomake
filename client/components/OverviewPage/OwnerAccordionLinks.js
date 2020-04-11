import React, { useRef, useState, useEffect } from 'react'
import { Icon, Input } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

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
}

const OwnerAccordionLinks = ({ programme }) => {
  const languageCode = useSelector((state) => state.language)
  const tokens = useSelector((state) => state.programmesTokens)
  const [copied, setCopied] = useState(false)
  const viewLinkRef = useRef(null)
  const editLinkRef = useRef(null)

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

  return (
    <>
      <tr>
        <td colSpan={18}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '1em 3em 0 3em' }}>
            <div style={{ marginRight: '2em', width: '375px' }}>
              {translations.viewPrompt[languageCode]}
            </div>
            <Input
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
              value={viewToken ? `https://study.cs.helsinki.fi/lomake/access/${viewToken.url}` : ''}
              onChange={null}
              ref={viewLinkRef}
            />
            <div
              style={{
                cursor: 'pointer',
                color: 'red',
                textDecoration: 'underline',
                marginLeft: '2em',
                width: '300px',
              }}
            >
              {translations.resetPrompt[languageCode]}
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={18}>
          <div style={{ display: 'flex', alignItems: 'center', margin: '0 3em' }}>
            <div style={{ marginRight: '2em', width: '375px' }}>
              {translations.editPrompt[languageCode]}
            </div>
            <Input
              style={{ width: '500px' }}
              icon={
                <Icon
                  name={copied === 'EDIT' ? 'checkmark' : 'copy'}
                  inverted
                  circular
                  link
                  onClick={() => copyToClipboard('EDIT')}
                />
              }
              value={editToken ? `https://study.cs.helsinki.fi/lomake/access/${editToken.url}` : ''}
              onChange={null}
              ref={editLinkRef}
            />
            <div
              style={{
                cursor: 'pointer',
                color: 'red',
                textDecoration: 'underline',
                marginLeft: '2em',
                width: '300px',
              }}
            >
              {translations.resetPrompt[languageCode]}
            </div>
          </div>
        </td>
      </tr>
    </>
  )
}

export default OwnerAccordionLinks
