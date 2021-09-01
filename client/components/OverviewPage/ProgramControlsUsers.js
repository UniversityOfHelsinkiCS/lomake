import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Icon, Header, Grid, Segment, Button, Popup } from 'semantic-ui-react'
import { editUserAccessAction } from 'Utilities/redux/programmesUsersReducer'
import { editUserAction } from 'Utilities/redux/usersReducer'
import { overviewPageTranslations as translations } from 'Utilities/translations'


const SwitchableBadge = ({ cyTag, currentAccess, grant, remove, disabled = false }) => {
  const lang = useSelector((state) => state.language)
  if (currentAccess)
    return (
      <Popup
        trigger={<Icon data-cy={cyTag} name="check" className="users-green" size="large" />}
        content={
          <Button
            data-cy="removePermissions-button"
            disabled={disabled}
            color="red"
            content={translations.removeAccess[lang]}
            onClick={() => remove()}
          />
        }
        on="click"
        position="top center"
      />
    )
  return (
    <Popup
      trigger={<Icon data-cy={cyTag} name="close" className="users-red" size="large" />}
      content={
        <Button
          data-cy="grantPermissions-button"
          color="green"
          content={translations.grantAccess[lang]}
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
            cyTag={`read-${user.uid}`}
            disabled={user.access[programme].admin}
            currentAccess={user.access[programme] ? user.access[programme].read : false}
            grant={() => grantView()}
            remove={() => removeView()}
          />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge
            cyTag={`write-${user.uid}`}
            disabled={user.access[programme].admin}
            currentAccess={user.access[programme] ? user.access[programme].write : false}
            grant={() => grantEdit()}
            remove={() => removeEdit()}
          />
        </Grid.Column>
        <Grid.Column textAlign="center" width={2}>
          <SwitchableBadge
            cyTag={`admin-${user.uid}`}
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
  const lang = useSelector((state) => state.language)
  const users = useSelector((state) => state.programmesUsers)

  if (!users.data || users.pending) return null

  const currentOwnerCount = users.data.reduce((pre, cur) => {
    if (!cur.access[programme]) return pre
    if (cur.access[programme].admin) return pre + 1
    return pre
  }, 0)

  return (
    <div style={{ margin: '3em'}}>
      <h2>{translations.userList[lang]}</h2>
      <Segment style={{ margin: '1em 0' }}>
        <Grid celled="internally">
          <Grid.Row>
            <Grid.Column width={3} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.nameHeader[lang]}</Header>
            </Grid.Column>
            <Grid.Column width={4} style={{ textAlign: 'center' }}>
              <Header as="h4">Email</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.viewHeader[lang]}</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.editHeader[lang]}</Header>
            </Grid.Column>
            <Grid.Column width={2} style={{ textAlign: 'center' }}>
              <Header as="h4">{translations.ownerHeader[lang]}</Header>
            </Grid.Column>
          </Grid.Row>
          {users.data.length === 0 ? (
            <Grid.Row>
              <Grid.Column width={13} style={{ textAlign: 'center' }}>
                {translations.noUsers[lang]}
              </Grid.Column>
            </Grid.Row>
          ) : (
            users.data.map((user) => (
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
    </div>
  )
}

export default OwnerAccordionUsers
