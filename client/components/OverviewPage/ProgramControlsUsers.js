import React from 'react'
import { Icon, Header, Grid, Segment, Button, Popup } from 'semantic-ui-react'
import { useSelector, useDispatch } from 'react-redux'
import { editUserAccessAction } from 'Utilities/redux/programmesUsersReducer'

const translations = {
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
  ownerHeader: {
    fi: 'Omistaja',
    en: 'Owner',
    se: '',
  },
  grantAccess: {
    fi: 'Anna oikeus',
    en: 'Grant access right',
    se: '',
  },
  removeAccess: {
    fi: 'Poista oikeus',
    en: 'Remove access right',
    se: '',
  },
  noUsers: {
    fi: 'Ei käyttäjiä, käytä ylläolevia linkkejä kutsumiseen',
    en: 'No users, use the links above to invite',
    se: '',
  },
}

const SwitchableBadge = ({ currentAccess, grant, remove, disabled = false }) => {
  const languageCode = useSelector((state) => state.language)
  if (currentAccess)
    return (
      <Popup
        trigger={<Icon name="check" className="users-green" size="large" />}
        content={
          <Button
            disabled={disabled}
            color="red"
            content={translations.removeAccess[languageCode]}
            onClick={() => remove()}
          />
        }
        on="click"
        position="top center"
      />
    )
  return (
    <Popup
      trigger={<Icon name="close" className="users-red" size="large" />}
      content={
        <Button
          color="green"
          content={translations.grantAccess[languageCode]}
          onClick={() => grant()}
        />
      }
      on="click"
      position="top center"
    />
  )
}

const OwnerAccordionUserRow = ({ currentOwnerCount, user, programme }) => {
  const dispatch = useDispatch()

  const grantOwner = () => dispatch(editUserAccessAction(user.id, programme, { admin: true }))
  const removeOwner = () => dispatch(editUserAccessAction(user.id, programme, { admin: false }))
  const grantEdit = () => dispatch(editUserAccessAction(user.id, programme, { write: true }))
  const removeEdit = () => dispatch(editUserAccessAction(user.id, programme, { write: false }))
  const grantView = () => dispatch(editUserAccessAction(user.id, programme, { read: true }))
  const removeView = () => dispatch(editUserAccessAction(user.id, programme, { read: false }))

  return (
    <>
      <Grid.Row key={user.id}>
        <Grid.Column width={3} style={{ textAlign: 'center' }}>
          {`${user.lastname}, ${user.firstname}`}
        </Grid.Column>
        <Grid.Column width={4} style={{ textAlign: 'center' }}>
          {user.email}
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge
            currentAccess={user.access[programme] ? user.access[programme].read : false}
            grant={() => grantView()}
            remove={() => removeView()}
          />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge
            currentAccess={user.access[programme] ? user.access[programme].write : false}
            grant={() => grantEdit()}
            remove={() => removeEdit()}
          />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge
            currentAccess={user.access[programme] ? user.access[programme].admin : false}
            grant={() => grantOwner()}
            remove={() => removeOwner()}
            disabled={currentOwnerCount <= 1}
          />
        </Grid.Column>
      </Grid.Row>
    </>
  )
}

const OwnerAccordionUsers = ({ programme }) => {
  const languageCode = useSelector((state) => state.language)
  const currentUser = useSelector((state) => state.currentUser)
  const users = useSelector((state) => state.programmesUsers)

  if (!users.data || users.pending) return null

  // Show admins at the top of the list (including self)
  const sortedUsers = users.data.sort((a, b) => {
    const aAdmin = a.access[programme].admin
    const bAdmin = b.access[programme].admin
    return bAdmin - aAdmin
  })

  const currentOwnerCount = users.data.reduce((pre, cur) => {
    if (cur.access[programme].admin) return pre + 1
    return pre
  }, 0)

  return (
    <>
      <Segment style={{ margin: '1em 3em' }}>
        <Grid celled="internally">
          <Grid.Row>
            <Grid.Column width={3} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.nameHeader[languageCode]}</Header>
            </Grid.Column>
            <Grid.Column width={4} style={{ textAlign: 'center' }}>
              <Header as="h4">Email</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.viewHeader[languageCode]}</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.editHeader[languageCode]}</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.ownerHeader[languageCode]}</Header>
            </Grid.Column>
          </Grid.Row>
          {sortedUsers.length === 0 ? (
            <Grid.Row>
              <Grid.Column width={13} style={{ textAlign: 'center' }}>
                {translations.noUsers[languageCode]}
              </Grid.Column>
            </Grid.Row>
          ) : (
            sortedUsers.map((user) => (
              <OwnerAccordionUserRow
                currentOwnerCount={currentOwnerCount}
                user={user}
                programme={programme}
                key={user.id}
              />
            ))
          )}
        </Grid>
      </Segment>
    </>
  )
}

export default OwnerAccordionUsers
