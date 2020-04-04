import React, { useRef, useState } from 'react'
import { Icon, Header, Input, Grid, Segment } from 'semantic-ui-react'
import { useSelector } from 'react-redux'

const translations = {
  editPrompt: {
    fi: 'Linkilla saa vastausoikeuden, jaa vain lomakkeen täyttäjille:',
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
  nameHeader: {
    fi: 'Nimi',
    en: 'Name',
    se: '',
  },
  viewHeader: {
    fi: 'Luku',
    en: 'Read',
    se: '',
  },
  editHeader: {
    fi: 'Vastaus',
    en: 'Edit',
    se: '',
  },
  owerHeader: {
    fi: 'Omistaja',
    en: 'Owner',
    se: '',
  },
}

const mockUserData = [
  {
    id: 1,
    name: 'Testi Testilä',
    email: 'testi.testila@helsinki.fi',
    canView: true,
    canEdit: false,
    isOwner: false,
  },
  {
    id: 2,
    name: 'Useri Superi',
    email: 'useri.superi@helsinki.fi',
    canView: true,
    canEdit: true,
    isOwner: true,
  },
]

const OwnerAccordionContent = ({ program }) => {
  const languageCode = useSelector((state) => state.language)
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

  return (
    <>
      <tr>
        <td colSpan={18}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              value="http://cs.helsinki.fi/lomake/c0opq"
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              value="http://cs.helsinki.fi/lomake/aK04bg"
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
      <tr>
        <td colSpan={18}>
          <Segment style={{ marginTop: '1em', marginBottom: '1em' }}>
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

export default OwnerAccordionContent
