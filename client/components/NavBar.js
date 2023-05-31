import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { useTranslation } from 'react-i18next'

export default () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const location = useLocation()

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
      <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
        <Label color="green" horizontal>
          Unhijack
        </Label>
      </Menu.Item>
    )
  }

  const GoToYearlyAssessmentButton = () => {
    return (
      <Menu.Item data-cy="nav-yearly" as={Link} to="/" name="yearlyAssessment">
        {t('yearlyAssessment')}
      </Menu.Item>
    )
  }

  const GoToAdminPageButton = () => {
    return (
      <Menu.Item data-cy="nav-admin" as={Link} to="/admin" name="adminControls">
        {t('adminPage')}
      </Menu.Item>
    )
  }

  const GoToEvaluationButton = () => {
    return (
      <Menu.Item data-cy="nav-evaluation">
        <Dropdown item data-cy="nav-evaluation-dropdown" text={t('evaluation')}>
          <Dropdown.Menu>
            <Dropdown.Item data-cy="nav-evaluation-option-programmes" as={Link} to="/evaluation" name="evaluation">
              {t('generic:level:programmes')}
            </Dropdown.Item>
            <Dropdown.Item
              data-cy="nav-evaluation-option-faculties"
              as={Link}
              to="/evaluation-faculty"
              name="faculties"
            >
              {t('generic:level:faculties')}
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu.Item>
    )
  }

  const GoToDegreeReformGroup = () => {
    return (
      <Menu.Item data-cy="nav-degree-reform-group" as={Link} to="/degree-reform" name="degree-form-group">
        {t('degree-reform-group')}
      </Menu.Item>
    )
  }

  const GoToDegreeReformIndividual = () => {
    return (
      <Menu.Item
        data-cy="nav-degree-reform-individual-form"
        as={Link}
        to="/degree-reform-individual/form"
        name="degree-reform-individual-form"
      >
        {t('degree-reform-individual')}
      </Menu.Item>
    )
  }

  const MenuNavigation = ({ pathname }) => {
    if (pathname.startsWith('/degree-reform-individual/')) {
      return (
        <>
          <Menu.Item>
            <img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="tosca" />
          </Menu.Item>
          {user.superAdmin ? <GoToDegreeReformIndividual /> : null}
        </>
      )
    }
    return (
      <>
        <Menu.Item as={Link} to="/">
          <img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="tosca" />
        </Menu.Item>
        <GoToYearlyAssessmentButton />
        {user.admin ? <GoToEvaluationButton /> : null} {/* FIX Remove admin */}
        {user.admin ? <GoToDegreeReformGroup /> : null} {/* FIX Remove admin */}
        {user.admin ? <GoToDegreeReformIndividual /> : null}
        {user.admin ? <GoToAdminPageButton /> : null}
        <Menu.Item>
          <a href="mailto:ospa@helsinki.fi">
            <Icon name="mail outline" />
            ospa@helsinki.fi
          </a>
        </Menu.Item>
      </>
    )
  }

  if (!user) return null
  return (
    <Menu id="navBar-wrapper" stackable compact fluid>
      <MenuNavigation pathname={location.pathname} />
      <Menu.Menu>
        <Dropdown data-cy="navBar-localeDropdown" item text={`${t('chosenLanguage')} (${lang.toUpperCase()}) `}>
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
      </Menu.Menu>
      <Menu.Menu position="right">
        {window.localStorage.getItem('adminLoggedInAs') ? unHijackButton() : null}
        <Menu.Item style={{ borderRight: '1px solid rgba(34,36,38,.15)' }} as={Link} to="/about">
          {t('about')}
        </Menu.Item>
        <Menu.Item data-cy="nav-logout" name="log-out" onClick={handleLogout}>
          {`${t('logOut')} (${user.uid})`}
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}
