import React, { useState } from 'react'
import { Menu, Header, Dropdown } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutAction,
  activateAdminModeAction,
  disableAdminModeAction
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
      <Menu.Item
        data-cy="adminmode-disable"
        onClick={handleAdminModeToggle}
        style={{ color: 'red' }}
      >
        <Header as="h4">AdminMode</Header>
        <p>ENGAGED!</p>
      </Menu.Item>
    ) : (
      <Menu.Item data-cy="adminmode-enable" onClick={handleAdminModeToggle}>
        AdminMode: off
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

  const AnalyticsButton = () => {
    return (
      <Menu.Item
        data-cy="nav-analytics"
        as={Link}
        to={'/analytics'}
        name="analytics"
        active={activeItem === 'analytics'}
        onClick={handleItemClick}
      >
        Analytics
      </Menu.Item>
    )
  }

  if (!user) return null
  return (
    <Menu stackable size="huge" fluid>
      <Menu.Item style={{ fontSize: 'xx-large', padding: '0.5em' }}>
        <img src={images.toska_color} style={{ marginRight: '1em' }} alt="tosca" /> Lomake
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

      <Menu.Item
        position="right"
        as={Link}
        to={'/'}
        name="currentLomake"
        active={activeItem === 'currentLomake'}
        onClick={handleItemClick}
      >
        Current Lomake
      </Menu.Item>

      {user.adminMode ? <AnalyticsButton /> : null}
      {user.adminMode ? <UsersButton /> : null}
      {user.admin ? getAdminButton() : null}
      <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  )
}
