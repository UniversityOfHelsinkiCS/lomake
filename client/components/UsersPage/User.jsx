import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Table, Icon, Label, Popup, Loader } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'

import { colors, getUserRole } from '../../util/common'
import './UsersPage.scss'
import { isSuperAdmin, isBasicUser, isAdmin } from '../../../config/common'
import { useGetOrganisationDataQuery } from '@/client/redux/organisation'

const getSpecialGroup = (user, group, lang, t, data) => {
  const specialGroups = [
    { group: 'allProgrammes', translationTag: 'accessAllProgrammes' },
    { group: 'international2020', translationTag: 'accessInternational2020' },
    { group: 'international', translationTag: 'accessInternational' },
    { group: 'doctoral', translationTag: 'accessDoctoral' },
    { group: 'evaluationFaculty', translationTag: 'accessEvaluationFaculty' },
    { group: 'universityForm', translationTag: 'accessEvaluationUniversity' },
    ...data.map(f => ({ group: f.code, translationTag: f.name, faculty: true })),
  ]

  const special = specialGroups.find(s => s.group === group)
  if (!special) return null
  return (
    <Label key={`${user}-${special.translationTag}`}>
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

const mayHijack = (current, toMock) => {
  if (isSuperAdmin(current)) return true
  if (!isSuperAdmin(toMock)) return true
  return false
}

export default ({ user, lang, programmeCodesAndNames }) => {
  const { t } = useTranslation()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const history = useHistory()
  const { data, isFetching } = useGetOrganisationDataQuery()

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    history.push('/')
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
              <p key={p}>
                {programmeCodesAndNames.get(p)}: {formatRights(user.access[p])}
              </p>
            ))}
          </div>
        }
      />
    )
  }

  if (isFetching) return <Loader active />

  return (
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
        {user.specialGroup && Object.keys(user.specialGroup).map(group => getSpecialGroup(user, group, lang, t, data))}
      </Table.Cell>
      <Table.Cell data-cy={`${user.uid}-userRole`}>{getUserRole(user.iamGroups)}</Table.Cell>
      {isAdmin(currentUser) && (
        <Table.Cell>
          {mayHijack(currentUser, user) && <Icon onClick={logInAs} size="large" name="sign-in" />}
        </Table.Cell>
      )}
    </Table.Row>
  )
}
