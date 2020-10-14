import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Tab } from 'semantic-ui-react'
import UserTable from './UserTable'
import OspaModule from './OspaModule'
import OwnerLinks from './OwnerLinks'
import FacultyLinks from './FacultyLinks'
import DoctorLinks from './DoctorLinks'
import { getAllTokens } from 'Utilities/redux/accessTokenReducer'
import { getAllUsersAction } from 'Utilities/redux/usersReducer'
import { usersPageTranslations as translations } from 'Utilities/translations'


export default () => {
  const dispatch = useDispatch()
  const languageCode = useSelector((state) => state.language)

  useEffect(() => {
    document.title = translations['adminPage'][languageCode]
  }, [languageCode])

  useEffect(() => {
    dispatch(getAllTokens())
    dispatch(getAllUsersAction())
  }, [])

  const panes = [
    {
      menuItem: translations.users[languageCode],
      render: () => (
        <Tab.Pane>
          <UserTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.deadline[languageCode],
      render: () => (
        <Tab.Pane>
          <OspaModule />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.linksForOwners[languageCode],
      render: () => (
        <Tab.Pane>
          <OwnerLinks />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.linksForFaculties[languageCode],
      render: () => (
        <Tab.Pane>
          <FacultyLinks />
        </Tab.Pane>
      ),
    },
    {
      menuItem: translations.linksForDoctoral[languageCode],
      render: () => (
        <Tab.Pane>
          <DoctorLinks />
        </Tab.Pane>
      ),
    },
  ]

  return <Tab style={{ width: '90%' }} panes={panes} />
}
