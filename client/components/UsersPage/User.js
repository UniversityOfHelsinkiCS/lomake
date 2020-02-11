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

  const grantAccess = () => {
    dispatch(editUserAction({ ...user, access: true }))
  }

  const removeAccess = () => {
    dispatch(editUserAction({ ...user, access: false }))
  }

  const markIrrelevant = () => {
    dispatch(editUserAction({ ...user, irrelevant: true }))
  }

  const removeIrrelevant = () => {
    dispatch(editUserAction({ ...user, irrelevant: false }))
  }

  const AccessBadge = () => {
    return user.access ? (
      <Popup
        trigger={
          <Icon
            data-cy={`${user.name}-has-access`}
            name="check"
            color="users-green"
            size="large"
          />
        }
        content={
          <Button
            data-cy="remove-access-confirm"
            color="red"
            content="Remove access"
            onClick={() => removeAccess()}
          />
        }
        on="click"
        position="top center"
      />
    ) : (
      <Popup
        trigger={
          <Icon
            data-cy={`${user.name}-no-access`}
            name="close"
            color="users-red"
            size="large"
          />
        }
        content={
          <Button
            data-cy="grant-access-confirm"
            color="green"
            content="Grant access"
            onClick={() => grantAccess()}
          />
        }
        on="click"
        position="top center"
      />
    )
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
          <Icon
            data-cy={`${user.name}-is-admin`}
            name="check"
            color="users-green"
            size="large"
          />
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
          <Icon
            data-cy={`${user.name}-not-admin`}
            name="close"
            color="users-red"
            size="large"
          />
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
  return (
    <Grid.Row>
      <Grid.Column width={2}>{user.name}</Grid.Column>
      <Grid.Column>{user.uid}</Grid.Column>
      <Grid.Column width={3}>{user.email}</Grid.Column>
      <Grid.Column textAlign="center">
        <AccessBadge />
      </Grid.Column>
      <Grid.Column textAlign="center">
        <AdminBadge />
      </Grid.Column>
      <Grid.Column textAlign="center">
        <IrrelevantBadge />
      </Grid.Column>
      <Grid.Column />
    </Grid.Row>
  )
}
