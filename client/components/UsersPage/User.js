import React, { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Table, Icon, Popup, Form, Radio } from 'semantic-ui-react'

import { editUserAction } from 'Utilities/redux/usersReducer'
import { isSuperAdmin } from '../../../config/common'
import { colors } from 'Utilities/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'

export default ({ user, lang, setModalData, programmeCodesAndNames }) => {
  const dispatch = useDispatch()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)

  const grantAdmin = () => {
    // Removed wideReadAccess, because we dont want users to have two usergroups. (admin and wideReadAccess)
    dispatch(editUserAction({ id: user.id, admin: true, wideReadAccess: false }))
  }

  const removeAdmin = () => {
    dispatch(editUserAction({ id: user.id, admin: false }))
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

  const FormattedAccess = () => {
    if (!user.access || Object.keys(user.access).length === 0) {
      return (
      <a
        onClick={() => setModalData({ id: user.id })}
        className="user-access-links"
      >
        None
      </a>
      )
    }
    return (
      <div>
        {Object.keys(user.access).map((programme) => (
          <a
            onClick={() => setModalData({ id: user.id })}
            className="user-access-links"
            key={`${user.uid}-${programme}`}
          >
            <div>{programmeCodesAndNames.get(programme)}</div>
          </a>
        ))}
      </div>
    )
  }

  const EditIcon = () => {
    return (
      <Button 
        icon
        onClick={() => setModalData({ id: user.id })} 
        style={{
          marginLeft: 'auto',
          backgroundColor: 'transparent',
          color: colors.black
        }}
      >
        <Icon size="large" name="edit" />
      </Button>
    )
  }

  return useMemo(
    () => (
      <Table.Row>
        <Table.Cell>{user.firstname} {user.lastname}</Table.Cell>
        <Table.Cell>{user.uid}</Table.Cell>
        <Table.Cell style={{ display: "flex" }}>
          <FormattedAccess />
        </Table.Cell>
        <Table.Cell>
          <UserGroupSelector />
        </Table.Cell>
        <Table.Cell>
          <EditIcon />
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
