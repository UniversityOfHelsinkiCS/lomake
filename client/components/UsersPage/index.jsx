import React, { useEffect } from 'react'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { useTranslation } from 'react-i18next'
import { getAllUsersAction } from '../../redux/usersReducer'
import { basePath, isSuperAdmin } from '../../../config/common'
import UserTable from './UserTable'
import IamTable from './IamTable'
import DeadlineInfo from './DeadlineInfo'
import DeadlineSetting from './DeadlineSetting'
import UpdateStudyprogrammes from './UpdateStudyprogrammes'
import TempAccess from './TempAccess'
import Debug from './Debug'
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
    {
      menuItem: t('users:users'),
      render: () => (
        <Tab.Pane>
          <UserTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('users:iams'),
      render: () => (
        <Tab.Pane>
          <IamTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('users:deadline'),
      render: () => (
        <Tab.Pane>
          <DeadlineInfo />
        </Tab.Pane>
      ),
    },
    {
      menuItem: t('users:tempAccess'),
      render: () => (
        <Tab.Pane>
          <TempAccess />
        </Tab.Pane>
      ),
    },
  ]

  if (isSuperAdmin(user)) {
    panes = [
      ...panes,
      {
      menuItem: t('users:updateStudyprogrammes'),
      render: () => (
        <Tab.Pane>
        <UpdateStudyprogrammes />
        </Tab.Pane>
      ),
      },
      {
      menuItem: t('users:deadlineSettings'),
      render: () => (
        <Tab.Pane>
        <DeadlineSetting />
        </Tab.Pane>
      ),
      },
      {
      menuItem: 'Debug',
      render: () => (
        <Tab.Pane>
        <Debug />
        </Tab.Pane>
      ),
      },
      {
      menuItem: t('users:uploadKeydata'),
      render: () => (
        <Tab.Pane>
        <KeyData />
        </Tab.Pane>
      ),
      },
    ]
  }

  return (
    <Tab
      style={{ maxWidth: '90%' }}
      menu={{
        className: 'attached',
        tabular: true,
        style: { display: 'flex', flexWrap: 'wrap', flexDirection: 'row' },
      }}
      panes={panes}
    />
  )
}
