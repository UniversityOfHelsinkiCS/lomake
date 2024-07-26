import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { Dropdown, Icon, Label, Menu, Popup } from 'semantic-ui-react'
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

const UnHijackButton = ({ handleUnhijack }) => (
  <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
    <Label color="green" horizontal>
      Unhijack
    </Label>
  </Menu.Item>
)

const MenuItemLink = ({ dataCy, to, name, children }) => (
  <Menu.Item data-cy={dataCy} as={Link} to={to} name={name}>
    {children}
  </Menu.Item>
)

const GoToYearlyAssessmentButton = () => {
  const { t } = useTranslation()
  return (
    <MenuItemLink dataCy="nav-yearly" to="/yearly" name="yearlyAssessment">
      {t('yearlyAssessment')}
    </MenuItemLink>
  )
}

const GoToAdminPageButton = () => {
  const { t } = useTranslation()
  return (
    <MenuItemLink dataCy="nav-admin" to="/admin" name="adminControls">
      {t('adminPage')}
    </MenuItemLink>
  )
}

const EvaluationDropdownItem = ({ dataCy, to, name, children }) => (
  <Dropdown.Item data-cy={dataCy} as={Link} to={to} name={name}>
    {children}
  </Dropdown.Item>
)

const GoToEvaluationButton = ({ user }) => {
  const { t, i18n } = useTranslation()
  const uniFormCodeMap = {
    en: 'UNI_EN',
    se: 'UNI_SE',
  }
  const uniFormCode = uniFormCodeMap[i18n.language] || 'UNI'
  const isEmployee = user.iamGroups.includes('hy-employees')
  const hasAccess = isAdmin(user) || isEvaluationFacultyUser(user) || Object.keys(user.access).length > 0

  return (
    <Menu.Item style={{ padding: 0 }}>
      <Dropdown item data-cy="nav-evaluation" text={t('evaluation')} style={{ height: '100%' }}>
        <Dropdown.Menu>
          {hasAccess && (
            <>
              <EvaluationDropdownItem dataCy="nav-evaluation-option-programmes" to="/evaluation" name="evaluation">
                {t('generic:level:programmes')}
              </EvaluationDropdownItem>
              <EvaluationDropdownItem
                dataCy="nav-evaluation-option-faculties"
                to="/evaluation-faculty"
                name="faculties"
              >
                {t('generic:level:faculties')}
              </EvaluationDropdownItem>
            </>
          )}
          {(isAdmin(user) || isEvaluationUniversityUser(user)) && (
            <EvaluationDropdownItem
              dataCy="nav-evaluation-option-committee"
              to={`/evaluation-university/form/6/${uniFormCode}`}
              name="committees"
            >
              {t('generic:level:university')}
            </EvaluationDropdownItem>
          )}
          {(isAdmin(user) || isEvaluationUniversityUser(user) || isEmployee) && (
            <EvaluationDropdownItem
              dataCy="nav-evaluation-option-university-overview"
              to="/evaluation-university/"
              name="big-boss"
            >
              {t('overview:universityOverview')}
            </EvaluationDropdownItem>
          )}
        </Dropdown.Menu>
      </Dropdown>
    </Menu.Item>
  )
}

const GoToDegreeReformGroup = () => {
  const { t } = useTranslation()
  return (
    <EvaluationDropdownItem dataCy="nav-degree-reform-group" to="/degree-reform" name="degree-form-group">
      {t('degree-reform-group')}
    </EvaluationDropdownItem>
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
          <EvaluationDropdownItem
            dataCy="nav-evaluation-option-reform-individual-answers"
            to="/reform-answers"
            name="answers"
          >
            {t('generic:degreeReformIndividualAnswers')}
          </EvaluationDropdownItem>
          <EvaluationDropdownItem
            dataCy="nav-evaluation-option-reform-individual-from"
            to="/individual"
            name="evaluation"
          >
            {t('generic:degreeReformIndividualForm')}
          </EvaluationDropdownItem>
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

const GoToMetaEvaluation = () => {
  const { t } = useTranslation()
  return (
    <MenuItemLink dataCy="nav-meta-evaluation" to="/meta-evaluation">
      {t('metaevaluation')}
    </MenuItemLink>
  )
}

const MenuNavigation = ({ pathname, user, hasProgrammeOrSpecial, t }) => {
  const location = useLocation()

  if (location.pathname === '/degree-reform' && location.search.startsWith('?faculty=')) return null

  const isIndividualPath = pathname.startsWith('/individual')
  if (isIndividualPath) {
    return (
      <>
        <Menu.Item>
          <img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="toska" />
        </Menu.Item>
        {user.superAdmin && <GoToDegreeReformIndividual />}
      </>
    )
  }

  return (
    <>
      <Menu.Item as={Link} to="/">
        <Popup
          content={t('toFrontpage')}
          trigger={<img style={{ width: '70px', height: 'auto' }} src={images.hy} alt="homepage" />}
        />
      </Menu.Item>
      {hasProgrammeOrSpecial && <GoToYearlyAssessmentButton />}
      <GoToEvaluationButton user={user} />
      {hasProgrammeOrSpecial && <GoToDegreeReform user={user} />}
      {hasProgrammeOrSpecial && <GoToMetaEvaluation />}
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

const LanguageDropdown = ({ lang, handleLanguageChange }) => {
  const { t } = useTranslation()
  return (
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

  if (location.pathname.startsWith('/evaluation-faculty/previous-years') || !user) return null

  const hasProgrammeOrSpecial = (programmes && programmes.length > 0) || Object.keys(user.specialGroup).length > 0

  return (
    <Menu id="navBar-wrapper" stackable compact fluid>
      <MenuNavigation pathname={location.pathname} user={user} hasProgrammeOrSpecial={hasProgrammeOrSpecial} t={t} />
      <LanguageDropdown lang={lang} handleLanguageChange={handleLanguageChange} />
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

export default NavBar
