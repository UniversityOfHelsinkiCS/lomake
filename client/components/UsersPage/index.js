import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import { getAllTokens } from 'Utilities/redux/accessTokenReducer'
import { getAllUsersAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isSuperAdmin, iamsInUse } from '@root/config/common'
import UserTable from './UserTable'
import DeadlineInfo from './DeadlineInfo'
import DeadlineSetting from './DeadlineSetting'
import OwnerLinks from './OwnerLinks'
import FacultyLinks from './FacultyLinks'
import DoctorLinks from './DoctorLinks'
import UpdateStudyprogrammes from './UpdateStudyprogrammes'

export default () => {
  const dispatch = useDispatch()
  const lang = useSelector(state => state.language)
  const user = useSelector(({ currentUser }) => currentUser.data)

  useEffect(() => {
    document.title = translations.adminPage[lang]
  }, [lang])

  useEffect(() => {
    dispatch(getAllTokens())
    dispatch(getAllUsersAction())
  }, [])

  let panes = [
    {
      menuItem: translations.users[lang],
      render: () => (
        <Tab.Pane>
          <UserTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.deadline[lang],
      render: () => (
        <Tab.Pane>
          <DeadlineInfo />
        </Tab.Pane>
      ),
    },
  ]

  if (!iamsInUse) {
    panes = [
      ...panes,
      {
        menuItem: translations.linksForOwners[lang],
        render: () => (
          <Tab.Pane>
            <OwnerLinks />
          </Tab.Pane>
        ),
      },
      {
        menuItem: translations.linksForFaculties[lang],
        render: () => (
          <Tab.Pane>
            <FacultyLinks />
          </Tab.Pane>
        ),
      },
      {
        menuItem: translations.linksForDoctoral[lang],
        render: () => (
          <Tab.Pane>
            <DoctorLinks />
          </Tab.Pane>
        ),
      },
    ]
  }

  if (isSuperAdmin(user)) {
    panes = [
      ...panes,
      {
        menuItem: translations.updateStudyprogrammes[lang],
        render: () => (
          <Tab.Pane>
            <UpdateStudyprogrammes />
          </Tab.Pane>
        ),
      },
      {
        menuItem: translations.deadlineSettings[lang],
        render: () => (
          <Tab.Pane>
            <DeadlineSetting />
          </Tab.Pane>
        ),
      },
    ]
  }

  return <Tab style={{ width: '90%' }} panes={panes} />
}
