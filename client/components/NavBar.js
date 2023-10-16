import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { useTranslation } from 'react-i18next'
import { isAdmin, isSuperAdmin, isEvaluationFacultyUser } from '@root/config/common'

const UnHijackButton = ({ handleUnhijack }) => {
  return (
    <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
      <Label color="green" horizontal>
        Unhijack
      </Label>
    </Menu.Item>
  )
}

const GoToYearlyAssessmentButton = () => {
  const { t } = useTranslation()

  return (
    <Menu.Item data-cy="nav-yearly" as={Link} to="/" name="yearlyAssessment">
      {t('yearlyAssessment')}
    </Menu.Item>
  )
}

const GoToAdminPageButton = () => {
  const { t } = useTranslation()

  return (
    <Menu.Item data-cy="nav-admin" as={Link} to="/admin" name="adminControls">
      {t('adminPage')}
    </Menu.Item>
  )
}

const GoToEvaluationButton = ({ user }) => {
  const { t } = useTranslation()
  return (
    <Menu.Item data-cy="nav-evaluation" style={{ padding: 0 }}>
      <Dropdown item data-cy="nav-evaluation-dropdown" text={t('evaluation')} style={{ height: '100%' }}>
        <Dropdown.Menu>
          <Dropdown.Item data-cy="nav-evaluation-option-programmes" as={Link} to="/evaluation" name="evaluation">
            {t('generic:level:programmes')}
          </Dropdown.Item>
          {isAdmin(user) || isEvaluationFacultyUser(user) ? (
            <Dropdown.Item
              data-cy="nav-evaluation-option-faculties"
              as={Link}
              to="/evaluation-faculty"
              name="faculties"
            >
              {t('generic:level:faculties')}
            </Dropdown.Item>
          ) : null}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )
}

const GoToDegreeReformGroup = () => {
  const { t } = useTranslation()
  return (
    <Menu.Item data-cy="nav-degree-reform-group" as={Link} to="/degree-reform" name="degree-form-group">
      {t('degree-reform-group')}
    </Menu.Item>
  )
}

const GoToDegreeReformIndividual = () => {
  const { t } = useTranslation()
  return (
    <Menu.Item data-cy="nav-evaluation-individual" style={{ padding: 0 }}>
      <Dropdown
        item
        data-cy="nav-evaluation-individual-dropdown"
        text={t('degree-reform-individual')}
        style={{ height: '100%' }}
      >
        <Dropdown.Menu>
          <Dropdown.Item
            data-cy="nav-evaluation-option-reform-individual-answers"
            as={Link}
            to="/reform-answers"
            name="answers"
          >
            {t('generic:degreeReformIndividualAnswers')}
          </Dropdown.Item>
          <Dropdown.Item
            data-cy="nav-evaluation-option-reform-individual-from"
            as={Link}
            to="/individual"
            name="evaluation"
          >
            {t('generic:degreeReformIndividualForm')}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )
}

const MenuNavigation = ({ pathname, user }) => {
  if (pathname.startsWith('/individual')) {
    return (
      <>
        <Menu.Item>
          <img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="toska" />
        </Menu.Item>
        {user.superAdmin ? <GoToDegreeReformIndividual /> : null}
      </>
    )
  }
  return (
    <>
      <Menu.Item as={Link} to="/">
        <img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="toska" />
      </Menu.Item>
      <GoToYearlyAssessmentButton />
      <GoToEvaluationButton user={user} />
      <GoToDegreeReformGroup />
      {user.admin && <GoToDegreeReformIndividual />}
      {user.admin && <GoToAdminPageButton />}
      <Menu.Item>
        <a href="mailto:ospa@helsinki.fi">
          <Icon name="mail outline" />
          ospa@helsinki.fi
        </a>
      </Menu.Item>
    </>
  )
}

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

  if (!user) return null
  return (
    <Menu id="navBar-wrapper" stackable compact fluid>
      <MenuNavigation pathname={location.pathname} user={user} />
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
    </Menu>
  )
}
