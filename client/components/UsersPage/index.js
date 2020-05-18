import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersAction } from 'Utilities/redux/usersReducer'
import UserTable from 'Components/UsersPage/UserTable'
import OwnerLinks from './OwnerLinks'
import { Tab } from 'semantic-ui-react'
import FacultyLinks from './FacultyLinks'
import { getAllTokens } from 'Utilities/redux/accessTokenReducer'

export default () => {
  const dispatch = useDispatch()
  const languageCode = useSelector((state) => state.language)

  const translations = {
    usersPage: {
      en: 'Form - User-page',
      fi: 'Lomake - Käyttäjä-sivu',
      se: '',
    },
  }

  useEffect(() => {
    document.title = translations['usersPage'][languageCode]
  }, [languageCode])

  useEffect(() => {
    dispatch(getAllTokens())
    dispatch(getAllUsersAction())
  }, [])

  const panes = [
    {
      menuItem: 'Users',
      render: () => (
        <Tab.Pane>
          <UserTable />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Links for owners',
      render: () => (
        <Tab.Pane>
          <OwnerLinks />
        </Tab.Pane>
      ),
    },
    {
      menuItem: 'Faculty wide links',
      render: () => (
        <Tab.Pane>
          <FacultyLinks />
        </Tab.Pane>
      ),
    },
  ]

  return <Tab style={{ width: '90%' }} panes={panes} />
}
