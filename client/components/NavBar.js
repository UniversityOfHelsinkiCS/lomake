import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'

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
    adminPage: {
      en: 'OSPA',
      fi: 'OSPA',
      se: 'OSPA',
    },
    answersReport: {
      en: 'Answers by the year',
      fi: 'Vastaukset vuosittain',
      se: 'Svar',
    },
    comparisonReport: {
      en: 'Compare answers',
      fi: 'Vastausten vertailu ja kehitys',
      se: 'Compare answers',
    },
    language: {
      en: 'English',
      fi: 'Suomi',
      se: 'Svenska',
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

  const handleItemClick = (e, { name }) => setActiveItem(name)

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

  const GoToAdminPageButton = () => {
    return (
      <Menu.Item
        data-cy="nav-admin"
        as={Link}
        to={'/admin'}
        name="adminControls"
        // active={activeItem === 'adminControls'}
        onClick={handleItemClick}
      >
        {translations.adminPage[languageCode]}
      </Menu.Item>
    )
  }

  const moreThanFiveProgrammes = () => {
    if (user.admin) return true
    if (user.access && Object.keys(user.access).length > 5) return true
    return false
  }

  if (!user) return null
  return (
    <Menu id="navBar-wrapper" stackable compact fluid inverted>
      <Menu.Item as={Link} to="/">
        <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="tosca" />
      </Menu.Item>
      <Menu.Item
        data-cy="nav-report"
        as={Link}
        to={'/report'}
        name="reportControls"
        onClick={handleItemClick}
      >
        {translations.answersReport[languageCode]}
      </Menu.Item>
      {moreThanFiveProgrammes() &&
        <Menu.Item
          as={Link}
          to={'/comparison'}
          name="comparisonControls"
          onClick={handleItemClick}
        >
          {translations.comparisonReport[languageCode]}
        </Menu.Item>    
      }
      {user.admin ? <GoToAdminPageButton /> : null}
      <Menu.Item>
        <a href="mailto:ospa@helsinki.fi">
          <Icon name="mail outline" />
          ospa@helsinki.fi
        </a>
      </Menu.Item>
      <Menu.Menu>
        <Dropdown
          data-cy="navBar-localeDropdown"
          item
          text={`${translations.language[languageCode]} (${languageCode.toUpperCase()}) `}
          simple
        >
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
        {window.localStorage.getItem('adminLoggedInAs') ? unHijackButton() : null}
        <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          {`${translations['logOut'][languageCode]} (${user.uid})`}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
