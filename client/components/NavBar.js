import React, { useState } from 'react'
import { Menu, Label, Dropdown } from 'semantic-ui-react'
import { useDispatch, useSelector } from 'react-redux'
import {
  logoutAction,
  activateAdminModeAction,
  disableAdminModeAction
} from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { images } from 'Utilities/common'
import { Link } from 'react-router-dom'

const isProgrammeOwner = (user) => {
  return Object.keys(user.access).find((programme) => user.access[programme].admin)
}

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

  const OwnerButton = () => {
    return (
      <Menu.Item
        data-cy="nav-owner"
        as={Link}
        to={'/owner'}
        name="owner"
        active={activeItem === 'owner'}
        onClick={handleItemClick}
      >
        Programme owner
      </Menu.Item>
    )
  }

  if (!user) return null
  return (
    <Menu stackable fluid inverted>
      <Menu.Item style={{ fontSize: 'xx-large', padding: '0.5em' }} as={Link} to="/">
        <img src={images.toska_color} alt="tosca" />
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
        {isProgrammeOwner(user) ? <OwnerButton /> : null}
        {user.adminMode ? <UsersButton /> : null}
        {user.admin ? getAdminButton() : null}
        <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          Log out
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
