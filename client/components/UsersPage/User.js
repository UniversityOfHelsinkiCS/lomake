import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { Table, Icon, Label, Popup } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { colors, getUserRole } from 'Utilities/common'
import './UsersPage.scss'
import { isSuperAdmin, isBasicUser, isAdmin, specialGroups } from '../../../config/common'

const getSpecialGroup = (group, lang, t) => {
  const special = specialGroups.find(s => s.group === group)
  if (!special) return null
  return (
    <Label>
      {special.faculty ? special.translationTag[lang] : t('users:special:access', { context: special.translationTag })}
    </Label>
  )
}

const formatRights = programme => {
  return Object.keys(programme)
    .filter(e => programme[e])
    .join(', ')
}

const getUserType = (user, t) => {
  if (isBasicUser(user)) return t('users:basicUser')
  if (isSuperAdmin(user)) return t('users:superAdmin')
  if (isAdmin(user)) return t('admin')
  return ''
}

export default ({ user, lang, programmeCodesAndNames }) => {
  const { t } = useTranslation()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    window.location.reload()
  }

  const FormattedAccess = () => {
    const programmeKeys = user.access ? Object.keys(user.access) : []
    if (!programmeKeys.length > 0 || programmeKeys.every(key => key === '')) {
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
                +{programmeKeys.length - 1} {t('users:moreProgrammes', { count: programmeKeys.length - 1 })}
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

  return useMemo(
    () => (
      <Table.Row>
        <Table.Cell width={2}>
          {user.firstname} {user.lastname}
        </Table.Cell>
        <Table.Cell width={1}>{user.uid}</Table.Cell>
        <Table.Cell data-cy={`${user.uid}-userAccess`} style={{ display: 'flex' }}>
          <FormattedAccess />
        </Table.Cell>
        <Table.Cell data-cy={`${user.uid}-userGroup`}>{getUserType(user, t)}</Table.Cell>
        <Table.Cell>
          {user.lastLogin ? (
            moment(user.lastLogin).format('DD.MM.YYYY')
          ) : (
            <span style={{ color: colors.gray }}>Ei tallennettu</span>
          )}
        </Table.Cell>
        <Table.Cell data-cy="user-access-groups">
          {user.specialGroup && Object.keys(user.specialGroup).map(group => getSpecialGroup(group, lang, t))}
        </Table.Cell>
        <Table.Cell data-cy={`${user.uid}-userRole`}>{getUserRole(user.iamGroups)}</Table.Cell>
        {isAdmin(currentUser) && (
          <Table.Cell>
            <Icon onClick={logInAs} size="large" name="sign-in" />
          </Table.Cell>
        )}
      </Table.Row>
    ),
    [user]
  )
}
