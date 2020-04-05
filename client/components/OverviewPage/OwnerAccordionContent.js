import React, { useRef, useState, useEffect } from 'react'
import { Icon, Header, Input, Grid, Segment } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { getProgrammesTokensAction } from 'Utilities/redux/programmesTokensReducer'
import { getProgrammesUsersAction } from 'Utilities/redux/programmesUsersReducer'

const translations = {
  editPrompt: {
    fi: 'Linkillä saa vastausoikeuden, jaa vain lomakkeen täyttäjille:',
    en: 'Link grants edit access, share to editors only:',
    se: ''
  },
  viewPrompt: {
    fi: 'Linkillä saa lukuoikeuden, jaa esim. johtoryhmälle:',
    en: 'Link grants read access, share e.g. to student members',
    se: ''
  },
  resetPrompt: {
    fi: 'Nollaa ja luo uusi jakolinkki',
    en: 'Reset the current link, and generate a new one',
    se: ''
  },
  nameHeader: {
    fi: 'Nimi',
    en: 'Name',
    se: ''
  },
  viewHeader: {
    fi: 'Luku',
    en: 'Read',
    se: ''
  },
  editHeader: {
    fi: 'Vastaus',
    en: 'Edit',
    se: ''
  },
  owerHeader: {
    fi: 'Omistaja',
    en: 'Owner',
    se: ''
  }
}

const mockUserData = [
  {
    id: 1,
    name: 'Testi Testilä',
    email: 'testi.testila@helsinki.fi',
    canView: true,
    canEdit: false,
    isOwner: false
  },
  {
    id: 2,
    name: 'Useri Superi',
    email: 'useri.superi@helsinki.fi',
    canView: true,
    canEdit: true,
    isOwner: true
  }
]

const OwnerAccordionLinks = ({ programme }) => {
  const dispatch = useDispatch()
  const languageCode = useSelector((state) => state.language)
  const tokens = useSelector((state) => state.programmesTokens)
  const [copied, setCopied] = useState(false)
  const viewLinkRef = useRef(null)
  const editLinkRef = useRef(null)

  useEffect(() => {
    dispatch(getProgrammesTokensAction(programme))
  }, [])

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
              style={{ width: '300px' }}
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
                width: '300px'
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
              style={{ width: '300px' }}
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
                width: '300px'
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

const OwnerAccordionUsers = ({ programme }) => {
  const dispatch = useDispatch()
  const languageCode = useSelector((state) => state.language)
  const users = useSelector((state) => state.programmesUsers)

  useEffect(() => {
    dispatch(getProgrammesUsersAction(programme))
  }, [])

  if (!users.data || users.pending) return null

  return (
    <>
      <tr>
        <td colSpan={18}>
          <Segment style={{ margin: '1em 5em' }}>
            <Grid celled="internally">
              <Grid.Row>
                <Grid.Column width={2} style={{ textAlign: 'center' }}>
                  <Header as="h4">{translations.nameHeader[languageCode]}</Header>
                </Grid.Column>
                <Grid.Column width={3} style={{ textAlign: 'center' }}>
                  <Header as="h4">Email</Header>
                </Grid.Column>
                <Grid.Column width={2} style={{ textAlign: 'center' }}>
                  <Header as="h4">{translations.viewHeader[languageCode]}</Header>
                </Grid.Column>
                <Grid.Column width={2} style={{ textAlign: 'center' }}>
                  <Header as="h4">{translations.editHeader[languageCode]}</Header>
                </Grid.Column>
                <Grid.Column width={2} style={{ textAlign: 'center' }}>
                  <Header as="h4">{translations.owerHeader[languageCode]}</Header>
                </Grid.Column>
              </Grid.Row>
              {mockUserData.map((user) => (
                <Grid.Row key={user.id}>
                  <Grid.Column width={2} style={{ textAlign: 'center' }}>
                    {user.name}
                  </Grid.Column>
                  <Grid.Column width={3} style={{ textAlign: 'center' }}>
                    {user.email}
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={2}>
                    <Icon
                      name={user.canView ? 'check' : 'close'}
                      color={user.canView ? 'green' : 'red'}
                      size="large"
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={2}>
                    <Icon
                      name={user.canEdit ? 'check' : 'close'}
                      color={user.canEdit ? 'green' : 'red'}
                      size="large"
                    />
                  </Grid.Column>
                  <Grid.Column textAlign="center" width={2}>
                    <Icon
                      name={user.isOwner ? 'check' : 'close'}
                      color={user.isOwner ? 'green' : 'red'}
                      size="large"
                    />
                  </Grid.Column>
                </Grid.Row>
              ))}
            </Grid>
          </Segment>
        </td>
      </tr>
    </>
  )
}

const OwnerAccordionContent = ({ program }) => {
  return (
    <>
      <OwnerAccordionLinks programme={program} />
      <OwnerAccordionUsers programme={program} />
    </>
  )
}

export default OwnerAccordionContent
