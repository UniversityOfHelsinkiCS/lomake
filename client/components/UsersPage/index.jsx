/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tabs, Tab, Box } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { getAllUsersAction } from '../../redux/usersReducer'
import { isSuperAdmin } from '../../../config/common'
import UserTable from './UserTable'
import IamTable from './IamTable'
import DeadlineInfo from './DeadlineInfo'
import DeadlineSetting from './DeadlineSetting'
import UpdateStudyprogrammes from './UpdateStudyprogrammes'
import TempAccess from './TempAccess'
import Debug from './Debug'
// eslint-disable-next-line import-x/no-named-as-default
import KeyData from './KeyData'

export default () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const user = useSelector(({ currentUser }) => currentUser.data)

  useEffect(() => {
    document.title = t('users:adminPage')
  }, [lang])

  useEffect(() => {
    dispatch(getAllUsersAction())
  }, [])

  let panes = [
    { menuItem: t('users:users'), render: () => <UserTable /> },
    { menuItem: t('users:iams'), render: () => <IamTable /> },
    { menuItem: t('users:deadline'), render: () => <DeadlineInfo /> },
    { menuItem: t('users:tempAccess'), render: () => <TempAccess /> },
  ]

  if (isSuperAdmin(user)) {
    panes = [
      ...panes,
      { menuItem: t('users:updateStudyprogrammes'), render: () => <UpdateStudyprogrammes /> },
      { menuItem: t('users:deadlineSettings'), render: () => <DeadlineSetting /> },
      { menuItem: 'Debug', render: () => <Debug /> },
      { menuItem: t('users:uploadKeydata'), render: () => <KeyData /> },
    ]
  }

  const [value, setValue] = useState(0)

  return (
    <Box sx={{ maxWidth: '90%' }}>
      <Tabs
        aria-label={t('users:adminPage')}
        onChange={(e, v) => setValue(v)}
        scrollButtons="auto"
        sx={{ '& .MuiTab-root': { fontSize: '0.8rem', minWidth: 80, px: 3 } }}
        value={value}
        variant="scrollable"
      >
        {panes.map((p, i) => (
          <Tab aria-controls={`users-tabpanel-${i}`} id={`users-tab-${i}`} key={`${p.menuItem}`} label={p.menuItem} />
        ))}
      </Tabs>

      {panes.map((p, i) => (
        <div
          aria-labelledby={`users-tab-${i}`}
          hidden={value !== i}
          id={`users-tabpanel-${i}`}
          key={`${p.menuItem}`}
          role="tabpanel"
        >
          {value === i && <Box sx={{ p: 2 }}>{p.render()}</Box>}
        </div>
      ))}
    </Box>
  )
}
