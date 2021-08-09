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

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    window.location.reload()
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
            key={`${user.uid}-${programme}`}
          >
            <div className="user-access-links">{programmeCodesAndNames.get(programme)}</div>
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
        <Table.Cell width={2}>{user.firstname} {user.lastname}</Table.Cell>
        <Table.Cell width={1}>{user.uid}</Table.Cell>
        <Table.Cell style={{ display: "flex" }}>
          <FormattedAccess />
        </Table.Cell>
        <Table.Cell>
          {!user.wideReadAccess && !user.admin && 'Basic user'}
          {user.wideReadAccess && !user.admin && 'Wide read access'}
          {user.admin && 'Admin'}
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
