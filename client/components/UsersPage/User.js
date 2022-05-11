import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Button, Table, Icon, Popup } from 'semantic-ui-react'

import { colors } from 'Utilities/common'
import './UsersPage.scss'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isSuperAdmin, isBasicUser, isAdmin, iamsInUse } from '../../../config/common'

const formatRights = programme => {
  return Object.keys(programme)
    .filter(e => programme[e])
    .join(', ')
}

const getUserType = (user, lang) => {
  if (isBasicUser(user)) return translations.accessBasic[lang]
  if (isSuperAdmin(user)) return translations.accessSuperAdmin[lang]
  if (isAdmin(user)) return translations.accessAdmin[lang]
  return ''
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

  const IAMFormattedAccess = () => {
    const programmeKeys = user.access ? Object.keys(user.access) : []
    if (!programmeKeys.length > 0) {
      return <div>None</div>
    }
    return (
      <Popup
        position="bottom center"
        trigger={
          <div>
            <div className="user-access-list">{programmeCodesAndNames.get(programmeKeys[0])}</div>
            {programmeKeys.length > 1 && (
              <div>
                +{programmeKeys.length - 1} {translations.moreProgrammes[lang]}
              </div>
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
        <Table.Cell data-cy={`${user.uid}-userAccess`} style={{ display: 'flex' }}>
          {iamsInUse ? <IAMFormattedAccess /> : <FormattedAccess />}
        </Table.Cell>
        <Table.Cell data-cy={`${user.uid}-userGroup`}>{getUserType(user, lang)}</Table.Cell>
        <Table.Cell>
          {user.lastLogin ? (
            moment(user.lastLogin).format('DD.MM.YYYY')
          ) : (
            <span style={{ color: colors.gray }}>Ei tallennettu</span>
          )}
        </Table.Cell>
        {iamsInUse ? null : (
          <Table.Cell>
            <EditIcon />
          </Table.Cell>
        )}
        {isSuperAdmin(currentUser) && (
          <Table.Cell>
            <Icon onClick={logInAs} size="large" name="sign-in" />
          </Table.Cell>
        )}
      </Table.Row>
    ),
    [user]
  )
}
