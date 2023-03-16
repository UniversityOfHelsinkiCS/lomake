import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Icon, Dropdown, Typography, MenuItem, MenuList } from '@mui/material'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { useTranslation } from 'react-i18next'

export default () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)

  const setLanguageCode = code => {
    dispatch(setLanguage(code))
    i18n.changeLanguage(code)
  }

  const handleLogout = () => {
    dispatch(logoutAction())
  }

  const handleUnhijack = () => {
    window.localStorage.removeItem('adminLoggedInAs')
    window.location.reload()
  }

  const unHijackButton = () => {
    return (
      <MenuItem data-cy="sign-in-as" onClick={handleUnhijack}>
        <Typography color="green" horizontal>
          Unhijack
        </Typography>
      </MenuItem>
    )
  }

  const GoToAdminPageButton = () => {
    return (
      <MenuItem data-cy="nav-admin" as={Link} to="/admin" name="adminControls">
        {t('adminPage')}
      </MenuItem>
    )
  }

  const GoToEvaluationButton = () => {
    return (
      <MenuItem data-cy="nav-evaluation" as={Link} to="/evaluation" name="evaluation">
        {t('evaluation')}
      </MenuItem>
    )
  }

  const GoToDegreeReformGroup = () => {
    return (
      <MenuItem data-cy="nav-degree-reform-group" as={Link} to="/degree-reform" name="degree-form-group">
        {t('degree-reform-group')}
      </MenuItem>
    )
  }

  const GoToDegreeReformIndividual = () => {
    return (
      <MenuItem
        data-cy="nav-degree-reform-individual"
        as={Link}
        to="/degree-reform-individual/"
        name="degree-reform-individual"
      >
        {t('degree-reform-individual')}
      </MenuItem>
    )
  }

  if (!user) return null
  return (
    <Menu id="navBar-wrapper" stackable compact fluid>
      <MenuItem as={Link} to="/">
        <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="tosca" />
      </MenuItem>
      {user.superAdmin ? <GoToEvaluationButton /> : null}
      {user.superAdmin ? <GoToDegreeReformGroup /> : null}
      {user.superAdmin ? <GoToDegreeReformIndividual /> : null}
      {user.admin ? <GoToAdminPageButton /> : null}
      <MenuItem>
        <a href="mailto:ospa@helsinki.fi">
          <Icon name="mail outline" />
          ospa@helsinki.fi
        </a>
      </MenuItem>
      <MenuList>
        <Dropdown data-cy="navBar-localeDropdown" item text={`${t('chosenLanguage')} (${lang.toUpperCase()}) `} simple>
          <Dropdown.Menu>
            <Dropdown.Item data-cy="navBar-localeOption-fi" value="fi" onClick={() => setLanguageCode('fi')}>
              Suomi
            </Dropdown.Item>
            <Dropdown.Item data-cy="navBar-localeOption-se" value="se" onClick={() => setLanguageCode('se')}>
              Svenska
            </Dropdown.Item>
            <Dropdown.Item data-cy="navBar-localeOption-en" value="en" onClick={() => setLanguageCode('en')}>
              English
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </MenuList>
      <MenuList position="right">
        {window.localStorage.getItem('adminLoggedInAs') ? unHijackButton() : null}
        <MenuItem style={{ borderRight: '1px solid rgba(34,36,38,.15)' }} as={Link} to="/about">
          {t('about')}
        </MenuItem>
        <MenuItem data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          {`${t('logOut')} (${user.uid})`}
        </MenuItem>
      </MenuList>
    </Menu>
  )
}
