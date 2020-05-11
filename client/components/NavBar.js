import React, { useState, useEffect } from 'react'
import { Menu, Label, Dropdown } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutAction,
  activateAdminModeAction,
  disableAdminModeAction,
} from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { images } from 'Utilities/common'
import { Link } from 'react-router-dom'

export default () => {
  const [activeItem, setActiveItem] = useState('currentLomake')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser.data)
  const languageCode = useSelector((state) => state.language)

  const translations = {
    logOut: {
      en: 'Log out',
      fi: 'Kirjaudu ulos',
      se: 'Logga ut',
    },
  }

  const warning =
    'The Swedish localization is a work in progress. Some of the content ' +
    'may not be displayed correctly and some of the features may not work at all.\n\n' +
    'In order to get the best experience, for the time being, please consider using the English or Finnish versions instead.\n\n ' +
    'We apologize for the inconvenience!'

  const setLanguageCode = (code) => dispatch(setLanguage(code))

  useEffect(() => {
    if (languageCode === 'se') {
      alert(warning)
    }
  }, [languageCode])

  const handleLogout = () => {
    dispatch(logoutAction())
  }
  const handleAdminModeToggle = () => {
    user.adminMode ? dispatch(disableAdminModeAction()) : dispatch(activateAdminModeAction())
  }

  const handleItemClick = (e, { name }) => setActiveItem(name)

  const getAdminButton = () => {
    return user.adminMode ? (
      <Menu.Item data-cy="adminmode-disable" onClick={handleAdminModeToggle}>
        AdminMode{' '}
        <Label color="red" horizontal>
          Engaged
        </Label>
      </Menu.Item>
    ) : (
      <Menu.Item data-cy="adminmode-enable" onClick={handleAdminModeToggle}>
        AdminMode off
      </Menu.Item>
    )
  }

  const handleUnhijack = () => {
    window.localStorage.removeItem('adminLoggedInAs')
    window.location.reload()
  }

  const unHijackButton = () => {
    return (
      <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
        <Label color="green" horizontal>
          Unhijack
        </Label>
      </Menu.Item>
    )
  }

  const UsersButton = () => {
    return (
      <Menu.Item
        data-cy="nav-users"
        as={Link}
        to={'/users'}
        name="editUsers"
        active={activeItem === 'editUsers'}
        onClick={handleItemClick}
      >
        Edit users
      </Menu.Item>
    )
  }

  if (!user) return null
  return (
    <Menu id="navBar-wrapper" stackable compact fluid inverted>
      <Menu.Item as={Link} to="/">
        <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="tosca" />
      </Menu.Item>
      <Menu.Menu>
        <Dropdown data-cy="navBar-localeDropdown" item icon="globe" simple>
          <Dropdown.Menu>
            <Dropdown.Item
              data-cy="navBar-localeOption-fi"
              value="fi"
              onClick={() => setLanguageCode('fi')}
            >
              Suomi
            </Dropdown.Item>
            <Dropdown.Item
              data-cy="navBar-localeOption-se"
              value="se"
              onClick={() => setLanguageCode('se')}
            >
              Svenska
            </Dropdown.Item>
            <Dropdown.Item
              data-cy="navBar-localeOption-en"
              value="en"
              onClick={() => setLanguageCode('en')}
            >
              English
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
      <Menu.Menu position="right">
        {user.adminMode && user.admin ? <UsersButton /> : null}
        {user.admin ? getAdminButton() : null}
        {window.localStorage.getItem('adminLoggedInAs') ? unHijackButton() : null}
        <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          {`${translations['logOut'][languageCode]} (${user.uid})`}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
