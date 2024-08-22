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
  yearly: { key: 'yearly', label: 'yearlyAssessment', path: '/yearly', access: ['programme', 'special'] },
  evaluation: {
    key: 'evaluation',
    label: 'evaluation',
    items: [
      {
        key: 'programme',
        label: 'generic:level:programmes',
        path: '/evaluation',
        access: ['programme', 'admin', 'evaluationFaculty'],
      },
      {
        key: 'faculty',
        label: 'generic:level:faculties',
        path: '/evaluation-faculty',
        access: ['programme', 'admin', 'evaluationFaculty'],
      },
      {
        key: 'university',
        label: 'generic:level:university',
        path: '/evaluation-university/form/6/UNI',
        access: ['admin', 'evaluationUniversity'],
      },
      {
        key: 'university-overview',
        label: 'overview:universityOverview',
        path: '/evaluation-university',
        access: [],
      },
      {
        key: 'meta-evaluation',
        label: 'metaevaluation',
        path: '/meta-evaluation',
        access: ['programme', 'special'],
      },
      {
        key: 'faculty-monitoring',
        label: 'facultymonitoring',
        path: '',
        access: [],
        disabled: true,
      },
    ],
  },
  degreeReform: {
    key: 'degreeReform',
    label: 'degree-reform',
    items: [
      { key: 'group', label: 'degree-reform-group', path: '/degree-reform', access: ['programme', 'special'] },
      {
        key: 'individual',
        label: 'degree-reform-individual',
        path: '/individual',
        access: ['admin', 'katselmusProjektiOrOhjausryhma', 'universityForm'],
      },
      {
        key: 'individual-answers',
        label: 'generic:degreeReformIndividualAnswers',
        path: '/reform-answers',
        access: ['admin', 'katselmusProjektiOrOhjausryhma', 'universityForm'],
      },
    ],
    access: ['programme'],
  },
  admin: { key: 'admin', label: 'adminPage', path: '/admin', access: ['admin'] },
}

const LanguageDropdown = ({ t, lang, handleLanguageChange }) => (
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

const UnHijackButton = ({ handleUnhijack }) => (
  <Menu.Item data-cy="sign-in-as" onClick={handleUnhijack}>
    <Label color="green" horizontal>
      Unhijack
    </Label>
  </Menu.Item>
)

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

  const renderHome = route => (
    <Menu.Item as={Link} to={route}>
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
  const hasAccess = accessRights => {
    if (!accessRights || accessRights.length === 0) return true // If no access rights specified, allow access
    return accessRights.some(right => {
      switch (right) {
        case 'programme':
          return programmes && programmes.length > 0
        case 'special':
          return user.specialGroup && Object.keys(user.specialGroup).length > 0
        case 'admin':
          return isAdmin(user)
        case 'evaluationFaculty':
          return isEvaluationFacultyUser(user)
        case 'evaluationUniversity':
          return isEvaluationUniversityUser(user)
        case 'employee':
          return user.iamGroups && user.iamGroups.includes('hy-employees')
        case 'katselmusProjektiOrOhjausryhma':
          return isKatselmusProjektiOrOhjausryhma(user)
        case 'universityForm':
          return user.specialGroup && user.specialGroup.universityForm
        default:
          return false
      }
    })
  }

  const renderNavRoutes = () =>
    Object.values(NavBarItems).map(({ items, key, label, path, access }) => {
      if (!hasAccess(access)) return null

      return items ? (
        <MenuItem as={Dropdown} data-cy={`nav-${key}`} key={`menu-item-drop-${key}`} tabIndex="-1" text={t(label)}>
          <Dropdown.Menu>
            {items.map(item => {
              if (!hasAccess(item.access)) return null
              return (
                <Dropdown.Item
                  as={Link}
                  data-cy={`nav-${item.key}`}
                  key={`menu-item-${item.path}`}
                  tabIndex="-1"
                  to={item.path}
                  disabled={item.disabled}
                >
                  {t(item.label)}
                </Dropdown.Item>
              )
            })}
          </Dropdown.Menu>
        </MenuItem>
      ) : (
        <MenuItem as={Link} data-cy={`nav-${key}`} key={`menu-item-${path}`} tabIndex="-1" to={path}>
          {t(label)}
        </MenuItem>
      )
    })

  if (location.pathname.startsWith('/evaluation-faculty/previous-years') || !user) return null

  return (
    <Menu size="huge" fluid stackable>
      {renderHome('/')}
      {renderNavRoutes()}
      {renderContact()}
      <LanguageDropdown t={t} lang={lang} handleLanguageChange={handleLanguageChange} />
      {renderLogOut()}
    </Menu>
  )
}

export default NavBar
