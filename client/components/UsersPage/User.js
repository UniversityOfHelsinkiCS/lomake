import React from 'react'
import { useDispatch } from 'react-redux'
import { Button, Grid, Icon, Popup } from 'semantic-ui-react'
import { editUserAction } from 'Utilities/redux/usersReducer'
import './UsersPage.scss'

export default ({ user }) => {
  const dispatch = useDispatch()

  const grantAdmin = () => {
    dispatch(editUserAction({ ...user, admin: true }))
  }

  const removeAdmin = () => {
    dispatch(editUserAction({ ...user, admin: false }))
  }

  const markIrrelevant = () => {
    dispatch(editUserAction({ ...user, irrelevant: true }))
  }

  const removeIrrelevant = () => {
    dispatch(editUserAction({ ...user, irrelevant: false }))
  }

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    window.location.reload()
  }

  const IrrelevantBadge = () => {
    return user.irrelevant ? (
      <Popup
        trigger={
          <Icon
            data-cy={`${user.name}-is-irrelevant`}
            name="check"
            color="users-green"
            size="large"
          />
        }
        content={
          <Button
            data-cy="remove-irrelevant-confirm"
            color="red"
            content="Mark as relevant"
            onClick={() => removeIrrelevant()}
          />
        }
        on="click"
        position="top center"
      />
    ) : (
      <Popup
        trigger={
          <Icon
            data-cy={`${user.name}-not-irrelevant`}
            name="close"
            color="users-red"
            size="large"
          />
        }
        content={
          <Button
            data-cy="mark-irrelevant-confirm"
            color="green"
            content="Mark as irrelevant"
            onClick={() => markIrrelevant()}
          />
        }
        on="click"
        position="top center"
      />
    )
  }

  const AdminBadge = () => {
    return user.admin ? (
      <Popup
        trigger={
          <Icon data-cy={`${user.name}-is-admin`} name="check" color="users-green" size="large" />
        }
        content={
          <Button
            data-cy="remove-admin-confirm"
            color="red"
            content="Remove admin role"
            onClick={() => removeAdmin()}
          />
        }
        on="click"
        position="top center"
      />
    ) : (
      <Popup
        trigger={
          <Icon data-cy={`${user.name}-not-admin`} name="close" color="users-red" size="large" />
        }
        content={
          <Button
            data-cy="grant-admin-confirm"
            color="green"
            content="Grant admin role"
            onClick={() => grantAdmin()}
          />
        }
        on="click"
        position="top center"
      />
    )
  }

  const formatRights = (programme) => {
    return Object.keys(programme)
      .filter((e) => programme[e])
      .join(', ')
  }

  const FormattedAccess = () => {
    if (!user.access || Object.keys(user.access).length === 0) return <>None</>
    return (
      <>
        {Object.keys(user.access).map((programme) => (
          <div key={`${user.uid}-${programme}`}>{`${programme}: ${formatRights(
            user.access[programme]
          )}`}</div>
        ))}
      </>
    )
  }
  return (
    <Grid.Row>
      <Grid.Column width={2}>{user.name}</Grid.Column>
      <Grid.Column>{user.uid}</Grid.Column>
      <Grid.Column width={3}>{user.email}</Grid.Column>
      <Grid.Column width={4}>
        <FormattedAccess />
      </Grid.Column>
      <Grid.Column textAlign="center">
        <AdminBadge />
      </Grid.Column>
      <Grid.Column textAlign="center">
        <IrrelevantBadge />
      </Grid.Column>
      <Grid.Column>
        <Icon onClick={logInAs} size="large" name="sign-in" />
      </Grid.Column>
      <Grid.Column />
    </Grid.Row>
  )
}
