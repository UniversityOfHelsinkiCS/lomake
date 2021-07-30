import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import UserTable from './UserTable'
import OspaModule from './OspaModule'
import OwnerLinks from './OwnerLinks'
import FacultyLinks from './FacultyLinks'
import DoctorLinks from './DoctorLinks'
import UpdateStudyprogrammes from './UpdateStudyprogrammes'
import { getAllTokens } from 'Utilities/redux/accessTokenReducer'
import { getAllUsersAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'
import { isSuperAdmin } from '@root/config/common'


export default () => {
  const dispatch = useDispatch()
  const lang = useSelector((state) => state.language)

  useEffect(() => {
    document.title = translations['adminPage'][lang]
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
          <OspaModule />
        </Tab.Pane>
      ),
    },
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
  
  if (isSuperAdmin) {
    panes = 
      [...panes, {
        menuItem: translations.updateStudyprogrammes[lang],
        render: () => (
          <Tab.Pane>
            <UpdateStudyprogrammes />
          </Tab.Pane>
        ),
      }
    ]
  }

  return <Tab style={{ width: '90%' }} panes={panes} />
}
