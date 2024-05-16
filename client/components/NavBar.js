import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu } from 'semantic-ui-react'
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
  const { t, i18n } = useTranslation()
  let uniFormCode = `UNI`
  if (i18n.language === 'en') {
    uniFormCode = `UNI_EN`
  } else if (i18n.language === 'se') {
    uniFormCode = `UNI_SE`
  }

  const isEmployee = user.iamGroups.includes('hy-employees')

  return (
    <Menu.Item style={{ padding: 0 }}>
      <Dropdown item data-cy="nav-evaluation" text={t('evaluation')} style={{ height: '100%' }}>
        <Dropdown.Menu>
          {isAdmin(user) || isEvaluationFacultyUser(user) || Object.keys(user.access).length > 0 ? (    
            <Dropdown.Item data-cy="nav-evaluation-option-programmes" as={Link} to="/evaluation" name="evaluation">
              {t('generic:level:programmes')}
            </Dropdown.Item>
          ) : null}
          {isAdmin(user) || isEvaluationFacultyUser(user) || Object.keys(user.access).length > 0 ? (
            <Dropdown.Item
              data-cy="nav-evaluation-option-faculties"
              as={Link}
              to="/evaluation-faculty"
              name="faculties"
            >
              {t('generic:level:faculties')}
            </Dropdown.Item>
          ) : null}
          {isAdmin(user) || isEvaluationUniversityUser(user) ? (
            <Dropdown.Item
              data-cy="nav-evaluation-option-committee"
              as={Link}
              to={`/evaluation-university/form/6/${uniFormCode}`}
              name="committees"
            >
              {t('generic:level:university')}
            </Dropdown.Item>
          ) : null}
          {isAdmin(user) || isEvaluationUniversityUser(user) || isEmployee ? (
            <Dropdown.Item
              data-cy="nav-evaluation-option-university-overview"
              as={Link}
              to="/evaluation-university/"
              name="big-boss"
            >
              {t('overview:universityOverview')}
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
    <Dropdown.Item data-cy="nav-degree-reform-group" as={Link} to="/degree-reform" name="degree-form-group">
      {t('degree-reform-group')}
    </Dropdown.Item>
  )
}

const GoToDegreeReformIndividual = () => {
  const { t } = useTranslation()
  return (
    <Dropdown.Item data-cy="nav-evaluation-individual">
      <Dropdown
        item
        data-cy="nav-evaluation-individual-dropdown"
        text={t('degree-reform-individual')}
        style={{ padding: 0 }}
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
    </Dropdown.Item>
  )
}

const GoToDegreeReform = ({ user }) => {
  const { t } = useTranslation()
  return (
    <Menu.Item data-cy="nav-degree-reform" style={{ padding: 0 }}>
      <Dropdown item text={t('degree-reform')} style={{ height: '100%' }}>
        <Dropdown.Menu>
          <GoToDegreeReformGroup />
          {(user.admin || isKatselmusProjektiOrOhjausryhma(user) || user?.specialGroup.universityForm) && (
            <GoToDegreeReformIndividual />
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )
}

const MenuNavigation = ({ pathname, user, hasProgrammeOrSpecial }) => {
  const location = useLocation()

  if (location.pathname === '/degree-reform' && location.search.startsWith('?faculty=')) {
    return null
  }
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
      {hasProgrammeOrSpecial && <GoToYearlyAssessmentButton />}
      <GoToEvaluationButton user={user} />
      {hasProgrammeOrSpecial && <GoToDegreeReform user={user} />}
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
  const programmes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const location = useLocation()
  const history = useHistory()

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

  if (location.pathname.startsWith('/evaluation-faculty/previous-years')) return null

  if (!user) return null

  const handleLanguageChange = (e, { value }) => {
    e.preventDefault()
    setLanguageCode(value)
    if (window.location.href.includes('/6/UNI')) {
      let uniFormCode = `UNI`
      if (value === 'en') {
        uniFormCode = `UNI_EN`
      } else if (value === 'se') {
        uniFormCode = `UNI_SE`
      }
      history.push(`/evaluation-university/form/6/${uniFormCode}`)
    }
  }

  const hasProgrammeOrSpecial = (programmes && programmes.length > 0) || Object.keys(user.specialGroup).length > 0

  return (
    <Menu id="navBar-wrapper" stackable compact fluid>
      <MenuNavigation pathname={location.pathname} user={user} hasProgrammeOrSpecial={hasProgrammeOrSpecial} />
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
