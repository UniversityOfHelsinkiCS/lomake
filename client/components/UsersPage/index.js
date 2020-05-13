import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersAction } from 'Utilities/redux/usersReducer'
import UserTable from 'Components/UsersPage/UserTable'
import OwnerLinks from './OwnerLinks'

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
    dispatch(getAllUsersAction())
  }, [])

  return (
    <>
      <OwnerLinks />
      <UserTable />
    </>
  )
}
