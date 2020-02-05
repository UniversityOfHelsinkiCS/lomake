import React, { useState } from 'react'
import { Menu, Header } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutAction,
  activateAdminModeAction,
  disableAdminModeAction
} from 'Utilities/redux/currentUserReducer'
import { images } from 'Utilities/common'
import { Link } from 'react-router-dom'

export default () => {
  const [activeItem, setActiveItem] = useState('currentLomake')
  const dispatch = useDispatch()
  const user = useSelector((state) => state.currentUser.data)

  const handleLogout = () => {
    dispatch(logoutAction())
  }
  const handleAdminModeToggle = () => {
    user.adminMode
      ? dispatch(disableAdminModeAction())
      : dispatch(activateAdminModeAction())
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

  if (!user) return null
  return (
    <Menu stackable size="huge" fluid>
      <Menu.Item style={{ fontSize: 'xx-large', padding: '0.5em' }}>
        <img
          src={images.toska_color}
          style={{ marginRight: '1em' }}
          alt="tosca"
        />{' '}
        Lomake
      </Menu.Item>

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

      {user.adminMode ? <UsersButton /> : null}
      {user.admin ? getAdminButton() : null}
      <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
        Log out
      </Menu.Item>
    </Menu>
  )
}
