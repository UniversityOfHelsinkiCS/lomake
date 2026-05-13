/* eslint-disable @typescript-eslint/no-floating-promises */
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router'
import moment from 'moment'
import { TableCell, TableRow, Box, Chip, Tooltip, IconButton } from '@mui/material'
import LoginIcon from '@mui/icons-material/Login'
import { useTranslation } from 'react-i18next'

import { colors, getUserRole } from '../../util/common'
import './UsersPage.scss'
import { isSuperAdmin, isBasicUser, isAdmin } from '../../../config/common'
import { IAMsToTable } from '../../../config/IAMConfig'

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
    <Chip
      key={`${user}-${special.translationTag}`}
      label={
        special.faculty ? special.translationTag[lang] : t('users:special:access', { context: special.translationTag })
      }
      size="small"
      sx={{ marginRight: 0.5, marginBottom: 0.5 }}
    />
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
const FormattedAccess = ({ user, programmeCodesAndNames }) => {
  const { t } = useTranslation()
  const programmeKeys = user.access ? Object.keys(user.access) : []
  if (!programmeKeys.length > 0 || programmeKeys.every(key => key === '')) return <div>None</div>
  return (
    <Tooltip
      placement="bottom"
      slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { maxWidth: '700px' } } } }}
      title={
        <div className="user-programme-list-popup">
          {programmeKeys.map(p => (
            <p key={p}>
              {programmeCodesAndNames.get(p)}: {formatRights(user.access[p])}
            </p>
          ))}
        </div>
      }
    >
      <span style={{ display: 'block', width: '100%' }}>
        <div className="user-access-list">{programmeCodesAndNames.get(programmeKeys[0])}</div>
        {programmeKeys.length > 1 && (
          <div>
            +{programmeKeys.length - 1} {t('users:moreProgrammes', { count: programmeKeys.length - 1 })}
          </div>
        )}
      </span>
    </Tooltip>
  )
}

export default ({ user, lang, programmeCodesAndNames, data }) => {
  const { t } = useTranslation()
  const currentUser = useSelector(({ currentUser }) => currentUser.data)
  const navigate = useNavigate()

  const logInAs = () => {
    localStorage.setItem('adminLoggedInAs', user.uid)
    navigate('/')
    window.location.reload()
  }

  return (
    <TableRow>
      <TableCell sx={{ width: '16%' }}>
        {user.firstname} {user.lastname}
      </TableCell>
      <TableCell sx={{ width: '8%' }}>{user.uid}</TableCell>
      <TableCell data-cy={`${user.uid}-userAccess`} sx={{ width: '45%', verticalAlign: 'top' }}>
        <Box sx={{ width: '100%' }}>
          <FormattedAccess programmeCodesAndNames={programmeCodesAndNames} user={user} />
        </Box>
      </TableCell>
      <TableCell data-cy={`${user.uid}-userGroup`}>{getUserType(user, t)}</TableCell>
      <TableCell>
        {user.lastLogin ? (
          moment(user.lastLogin).format('DD.MM.YYYY')
        ) : (
          <span style={{ color: colors.gray }}>Ei tallennettu</span>
        )}
      </TableCell>
      <TableCell data-cy="user-access-groups">
        {user.specialGroup
          ? Object.keys(user.specialGroup).map(group => getSpecialGroup(user, group, lang, t, data))
          : null}
      </TableCell>
      <TableCell data-cy={`${user.uid}-userRole`}>{getUserRole(user.iamGroups)}</TableCell>
      <TableCell data-cy="user-iam_groups">
        {user.iamGroups
          ? user.iamGroups
              .filter(group => IAMsToTable.includes(group) || group.includes('student') || group.includes('jory'))
              .join('; ')
          : null}
      </TableCell>
      {isAdmin(currentUser) && (
        <TableCell>
          {mayHijack(currentUser, user) && (
            <IconButton data-cy={`hijack-${user.uid}`} onClick={logInAs} size="large">
              <LoginIcon />
            </IconButton>
          )}
        </TableCell>
      )}
    </TableRow>
  )
}
