import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Button, Table, Icon } from 'semantic-ui-react'

import {
  isSuperAdmin,
  isBasicUser,
  isWideReadAccessUser,
  isAdmin,
} from '../../../config/common'
import { colors } from 'Utilities/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'

export default ({ user, lang, setModalData, programmeCodesAndNames }) => {
  const currentUser = useSelector(({ currentUser }) => currentUser.data)

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    window.location.reload()
  }

  const FormattedAccess = () => {
    const programmeKeys = user.access ? Object.keys(user.access) : []
    if (!programmeKeys.length > 0) {
      return (
      <a
        onClick={() => setModalData({ id: user.id })}
        className="user-access-links"
      >
        None
      </a>
      )
    }
    if (programmeKeys.length > 1) {
      return (
        <div>
          <a onClick={() => setModalData({ id: user.id })}>
            <div className="user-access-links">{programmeCodesAndNames.get(programmeKeys[0])}</div>
          </a>
          <a>
            <div>+{programmeKeys.length - 1} {translations.moreProgrammes[lang]}</div>
          </a>
        </div>
      )  
    }
    return (
      <div>
        {programmeKeys.map((p) => (
          <a onClick={() => setModalData({ id: user.id })} key={`${user.uid}-${p}`}>
            <div className="user-access-links">{programmeCodesAndNames.get(p)}</div>
          </a>
        ))}
      </div>
    )
  }

  const EditIcon = () => {
    return (
      <Button 
        icon
        data-cy="editUser"
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
        <Table.Cell data-cy="userGroup">
          {isBasicUser(user) && translations.accessBasic[lang]}
          {isWideReadAccessUser(user) && translations.accessWideRead[lang]}
          {isAdmin(user) && translations.accessAdmin[lang]}
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
