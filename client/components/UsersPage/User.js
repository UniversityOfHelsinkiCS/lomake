import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Grid, Icon, Popup } from 'semantic-ui-react'
import { editUserAction } from 'Utilities/redux/usersReducer'
import { isSuperAdmin } from '../../../config/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'

export default ({ user, lang }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)

  const grantAdmin = () => {
    dispatch(editUserAction({ ...user, admin: true }))
  }

  const removeAdmin = () => {
    dispatch(editUserAction({ ...user, admin: false }))
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
            data-cy={`${user.uid}-is-irrelevant`}
            name="check"
            className="users-green"
            size="large"
          />
        }
        content={
          <Button
            data-cy="remove-irrelevant-confirm"
            color="red"
            content={translations.markRelevant[lang]}
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
            data-cy={`${user.uid}-not-irrelevant`}
            name="close"
            className="users-red"
            size="large"
          />
        }
        content={
          <Button
            data-cy="mark-irrelevant-confirm"
            color="green"
            content={translations.markIrrelevant[lang]}
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
            data-cy={`${user.uid}-is-admin`}
            name="check"
            className="users-green"
            size="large"
          />
        }
        content={
          <Button
            data-cy="remove-admin-confirm"
            color="red"
            content={translations.removeAdmin[lang]}
            onClick={() => removeAdmin()}
          />
        }
        on="click"
        position="top center"
      />
    ) : (
      <Popup
        trigger={
          <Icon data-cy={`${user.uid}-not-admin`} name="close" className="users-red" size="large" />
        }
        content={
          <Button
            data-cy="grant-admin-confirm"
            color="green"
            content={translations.grantAdmin[lang]}
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
      <Grid.Column width={3}>{`${user.lastname}, ${user.firstname}`}</Grid.Column>
      <Grid.Column width={3}>{user.uid}</Grid.Column>
      <Grid.Column width={3}>{user.email}</Grid.Column>
      <Grid.Column width={4}>
        <FormattedAccess />
      </Grid.Column>
      <Grid.Column width={2} textAlign="center">
        <AdminBadge />
      </Grid.Column>

      {isSuperAdmin(currentUser.uid) && (
        <Grid.Column>
          <Icon onClick={logInAs} size="large" name="sign-in" />
        </Grid.Column>
      )}
    </Grid.Row>
  )
}
