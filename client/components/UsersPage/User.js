import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Button, Table, Icon, Popup } from 'semantic-ui-react'

import { isSuperAdmin, isBasicUser, isWideReadAccessUser, isAdmin } from '../../../config/common'
import { colors } from 'Utilities/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'

const formatRights = programme => {
  return Object.keys(programme)
    .filter(e => programme[e])
    .join(', ')
}

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
        <a onClick={() => setModalData({ id: user.id })} className="user-access-links">
          None
        </a>
      )
    }
    return (
      <Popup
        position="bottom center"
        trigger={
          <div>
            <a onClick={() => setModalData({ id: user.id })}>
              <div className="user-access-links">{programmeCodesAndNames.get(programmeKeys[0])}</div>
            </a>
            {programmeKeys.length > 1 && (
              <a>
                <div>
                  +{programmeKeys.length - 1} {translations.moreProgrammes[lang]}
                </div>
              </a>
            )}
          </div>
        }
        content={
          <div className="user-programme-list-popup">
            {programmeKeys.map(p => (
              <p>
                {programmeCodesAndNames.get(p)}: {formatRights(user.access[p])}
              </p>
            ))}
          </div>
        }
      />
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
          color: colors.black,
        }}
      >
        <Icon size="large" name="edit" />
      </Button>
    )
  }

  return useMemo(
    () => (
      <Table.Row>
        <Table.Cell width={2}>
          {user.firstname} {user.lastname}
        </Table.Cell>
        <Table.Cell width={1}>{user.uid}</Table.Cell>
        <Table.Cell data-cy="userAccess" style={{ display: 'flex' }}>
          <FormattedAccess />
        </Table.Cell>
        <Table.Cell data-cy="userGroup">
          {isBasicUser(user) && translations.accessBasic[lang]}
          {isWideReadAccessUser(user) && translations.accessWideRead[lang]}
          {isAdmin(user) && translations.accessAdmin[lang]}
        </Table.Cell>
        <Table.Cell>
          {user.lastLogin ? (
            moment(user.lastLogin).format('DD.MM.YYYY')
          ) : (
            <span style={{ color: colors.gray }}>Ei tallennettu</span>
          )}
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
