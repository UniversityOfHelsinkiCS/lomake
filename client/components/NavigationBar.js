/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable prettier/prettier */
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu, Popup, MenuItem } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { useTranslation } from 'react-i18next'
import {
  isAdmin,
  isSuperAdmin,
  isEvaluationFacultyUser,
  isKatselmusProjektiOrOhjausryhma,
  isEvaluationUniversityUser,
} from '@root/config/common'

const NavBarItems = {
  yearly: { key: 'yearly', label: 'yearly', path: '/yearly', access: ['programme'] },
  evaluation: {
    key: 'evaluation',
    label: 'evaluation',
    items: [
      { key: 'programme', label: 'programme', path: '/evaluation', access: ['programme'] },
      { key: 'faculty', label: 'faculty', path: '/evaluation-faculty', access: ['programme'] },
      { key: 'university', label: 'university', path: '/evaluation-university', access: ['employee'] },
      { key: 'university-form', label: 'university-form', path: '/evaluation-university/form/6/UNI' },
    ],
  },
  degreeReform: {
    key: 'degreeReform',
    label: 'degreeReform',
    items: [
      { key: 'group', label: 'group', path: '/degree-reform', access: ['programme'] },
      { key: 'individual', label: 'individual', path: '/individual', access: ['project', 'universityForm'] },
      {
        key: 'individual-answers',
        label: 'reform-answers',
        path: '/reform-answers',
        access: ['project', 'universityForm'],
      },
    ],
  },
  metaEvaluation: {
    key: 'meta-evaluation',
    label: 'metaEvaluation',
    path: '/meta-evaluation',
    access: ['programme'],
  },
  admin: { key: 'admin', label: 'OSPA', path: '/admin', access: ['programme'] },
}

const NavBar = () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const location = useLocation()
  const history = useHistory()

  const setLanguageCode = code => {
    dispatch(setLanguage(code))
    i18n.changeLanguage(code)
  }

  const handleLogout = () => dispatch(logoutAction())

  const handleUnhijack = () => {
    window.localStorage.removeItem('adminLoggedInAs')
    window.location.reload()
  }

  const renderHome = () => (
    <Menu.Item as={Link} to="/">
      <Popup
        content={t('toFrontpage')}
        trigger={<img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="homepage" />}
      />
    </Menu.Item>
  )

  const renderContact = () => (
    <Menu.Item>
      <a href="mailto:ospa@helsinki.fi">
        <Icon name="mail outline" />
        ospa@helsinki.fi
      </a>
    </Menu.Item>
  )

  const UnHijackButton = () => (
    <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
      <Label color="green" horizontal>
        Unhijack
      </Label>
    </Menu.Item>
  )

  const renderLogOut = () => (
    <Menu.Menu position="right">
      {window.localStorage.getItem('adminLoggedInAs') && <UnHijackButton handleUnhijack={handleUnhijack} />}
      <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {`${t('logOut')} (${user.uid})`}
          {isSuperAdmin(user) && (
            <Label color="red">Server running since {new Date(user.lastRestart).toLocaleTimeString()}</Label>
          )}
        </div>
      </Menu.Item>
    </Menu.Menu>
  )

  const handleLanguageChange = (e, { value }) => {
    e.preventDefault()
    setLanguageCode(value)
    if (window.location.href.includes('/6/UNI')) {
      const uniFormCodeMap = {
        en: 'UNI_EN',
        se: 'UNI_SE',
      }
      const uniFormCode = uniFormCodeMap[value] || 'UNI'
      history.push(`/evaluation-university/form/6/${uniFormCode}`)
    }
  }

  const LanguageDropdown = () => (
    <Menu.Menu>
      <Dropdown data-cy="navBar-localeDropdown" item text={`${t('chosenLanguage')} (${lang.toUpperCase()}) `}>
        <Dropdown.Menu>
          <Dropdown.Item data-cy="navBar-localeOption-fi" value="fi" onClick={handleLanguageChange}>
            Suomi
          </Dropdown.Item>
          <Dropdown.Item data-cy="navBar-localeOption-se" value="se" onClick={handleLanguageChange}>
            Svenska
          </Dropdown.Item>
          <Dropdown.Item data-cy="navBar-localeOption-en" value="en" onClick={handleLanguageChange}>
            English
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Menu>
  )

  const renderNavRoutes = () =>
    Object.values(NavBarItems).map(({ items, key, label, path }) =>
      items ? (
        <MenuItem
          active={items.some(item => location.pathname.includes(item.path))}
          as={Dropdown}
          data-cy={`navbar-${key}`}
          key={`menu-item-drop-${key}`}
          tabIndex="-1"
          text={t(label)}
        >
          <Dropdown.Menu>
            {items.map(item => (
              <Dropdown.Item
                as={Link}
                data-cy={`navbar-${item.key}`}
                key={`menu-item-${item.path}`}
                tabIndex="-1"
                to={item.path}
              >
                {item.label}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </MenuItem>
      ) : (
        <MenuItem as={Link} data-cy={`navbar-${key}`} key={`menu-item-${path}`} tabIndex="-1" to={path}>
          {t(label)}
        </MenuItem>
      ),
    )

  return (
    <Menu size="huge" fluid stackable>
      {renderHome()}
      {renderNavRoutes()}
      {renderContact()}
      <LanguageDropdown lang={lang} handleLanguageChange={handleLanguageChange} />
      {renderLogOut()}
    </Menu>
  )
}

export default NavBar
