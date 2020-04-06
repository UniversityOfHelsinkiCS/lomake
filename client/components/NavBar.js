import React, { useState } from 'react'
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

  const setLanguageCode = (code) => dispatch(setLanguage(code))

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

  const handleLoginAsDisable = () => {
    window.localStorage.removeItem('adminLoggedInAs')
    window.location.reload()
  }

  const logInAsButton = () => {
    return (
      <Menu.Item data-cy="sign-in-as" onClick={handleLoginAsDisable}>
        <Label color="green" horizontal>
          Stop "sign in as"
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
    <Menu stackable compact fluid inverted>
      <Menu.Item as={Link} to="/">
        <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="tosca" />
      </Menu.Item>
      <Menu.Menu>
        <Dropdown item icon="globe" simple>
          <Dropdown.Menu>
            <Dropdown.Item value="fi" onClick={() => setLanguageCode('fi')}>
              Suomi
            </Dropdown.Item>
            <Dropdown.Item value="se" onClick={() => setLanguageCode('se')}>
              Svenska
            </Dropdown.Item>
            <Dropdown.Item value="en" onClick={() => setLanguageCode('en')}>
              English
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Menu>
      <Menu.Menu position="right">
        {user.adminMode && user.admin ? <UsersButton /> : null}
        {user.admin ? getAdminButton() : null}
        {window.localStorage.getItem('adminLoggedInAs') ? logInAsButton() : null}
        <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          {`Log out (${user.uid})`}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
