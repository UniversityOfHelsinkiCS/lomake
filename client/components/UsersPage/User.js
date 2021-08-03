import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Icon, Popup, Form, Radio } from 'semantic-ui-react'
import { editUserAction, deleteUserAction } from 'Utilities/redux/usersReducer'
import { isSuperAdmin } from '../../../config/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'

export default ({ user, lang }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)

  const grantAdmin = () => {
    // Removed wideReadAccess, because we dont want users to have two usergroups. (admin and wideReadAccess)
    dispatch(editUserAction({ id: user.id, admin: true, wideReadAccess: false }))
  }

  const removeAdmin = () => {
    dispatch(editUserAction({ id: user.id, admin: false }))
  }

  const deleteUser = () => {
    dispatch(deleteUserAction(user.id))
  }

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    window.location.reload()
  }

  const CustomRadioWithConfirmTrigger = ({
    checked,
    label,
    disabled,
    confirmPrompt,
    onConfirm,
    dataCy,
  }) => {
    return (
      <Popup
        trigger={
          <Radio
            data-cy={dataCy}
            disabled={disabled}
            label={label}
            name="radioGroup"
            checked={checked}
          />
        }
        content={
          <Button
            data-cy={`${dataCy}-confirm`}
            disabled={disabled || checked}
            color="red"
            content={
              disabled ? 'Please use the IAM group for managing  wide read access' : confirmPrompt
            }
            onClick={onConfirm}
          />
        }
        on="click"
        position="top left"
      />
    )
  }

  const UserGroupSelector = () => {
    return (
      <Form style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
        <CustomRadioWithConfirmTrigger
          label={translations.accessBasic[lang]}
          checked={!user.wideReadAccess && !user.admin}
          onConfirm={removeAdmin}
          disabled={user.wideReadAccess}
          confirmPrompt={translations.makeBasicPrompt[lang]}
          dataCy="accessBasic"
        />

        <CustomRadioWithConfirmTrigger
          label={translations.accessWideRead[lang]}
          checked={user.wideReadAccess}
          disabled={true}
          dataCy="accessWideRead"
        />

        <CustomRadioWithConfirmTrigger
          label={translations.accessAdmin[lang]}
          checked={user.admin}
          onConfirm={grantAdmin}
          confirmPrompt={translations.makeAdminPrompt[lang]}
          dataCy="accessAdmin"
        />
      </Form>
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

  const DeleteButton = () => {
    return (
      <Popup
        content={
          <Button
            color="red"
            onClick={deleteUser}
          >
            {translations.deleteConfirmation[lang]}
          </Button>
        }
        trigger={
          <Button 
            color={isSuperAdmin(user.uid) ? "gray" : "red"}
            disabled={isSuperAdmin(user.uid)}
          >
            {translations.deleteUser[lang]}
          </Button>
        }
        on="click"
      />
    )
  }

  return useMemo(
    () => (
      <Table.Row>
        <Table.Cell>{user.firstname} {user.lastname}</Table.Cell>
        <Table.Cell>{user.uid}</Table.Cell>
        <Table.Cell>
          <FormattedAccess />
        </Table.Cell>
        <Table.Cell>
          <UserGroupSelector />
        </Table.Cell>
        <Table.Cell>
          <DeleteButton />
        </Table.Cell>
        {isSuperAdmin(currentUser.uid) && (
          <Table.Cell>
            <Icon onClick={logInAs} size="large" name="sign-in" />
          </Table.Cell>
        )}
      </Table.Row>
    ),
    [user]
  )
}
