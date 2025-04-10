import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { AppBar, Toolbar, Box, Container, Chip, Menu, MenuItem, Tooltip, Typography } from '@mui/material'
import { LanguageSharp, Logout, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import { images } from '../util/common'
import { logoutAction } from '../util/redux/currentUserReducer'
import { setLanguage } from '../util/redux/languageReducer'
import { useTranslation } from 'react-i18next'
import {
  isAdmin,
  isSuperAdmin,
  isEvaluationFacultyUser,
  isKatselmusProjektiOrOhjausryhma,
  isEvaluationUniversityUser,
} from '../../config/common'

const NavBarItems = {
  yearly: { key: 'yearly', label: 'landingPage:yearlyAssessmentTitle', path: '/v1/overview', access: ['admin'] },
  archive: {
    key: 'archive',
    label: 'archive',
    path: [
      '/yearly',
      '/evaluation',
      '/evaluation-faculty',
      '/evaluation-university',
      '/meta-evaluation',
      '/faculty-monitoring',
      '/degree-reform',
      '/individual',
      '/reform-answers',
      '/report',
      '/comparison',
    ],
    items: [
      { key: 'yearly', label: 'yearlyAssessment', path: '/yearly', access: ['programme', 'special'] },
      {
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
            path: '/faculty-monitoring',
            access: ['admin', 'evaluationFaculty'],
          },
        ],
      },
      {
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
    ],
  },
  admin: { key: 'admin', label: 'adminPage', path: '/admin', access: ['admin'] },
}

const LanguageDropdown = ({ t, lang, handleLanguageChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMenuItemClick = value => event => {
    handleLanguageChange(event, { value })
    handleClose()
  }

  return (
    <Box>
      <MenuItem
        data-cy="navBar-localeDropdown"
        onClick={handleClick}
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        sx={{ gap: 1 }}
      >
        <LanguageSharp />
        <Typography variant="light" alignContent="center" sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
          {`${t('chosenLanguage')} (${lang.toUpperCase()}) `}
          {open ? <ArrowDropUp /> : <ArrowDropDown />}
        </Typography>
      </MenuItem>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'language-button',
          },
        }}
      >
        <MenuItem data-cy="navBar-localeOption-fi" onClick={handleMenuItemClick('fi')}>
          <Typography variant="light" alignContent="center" sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
            Suomi
          </Typography>
        </MenuItem>
        <MenuItem data-cy="navBar-localeOption-se" onClick={handleMenuItemClick('se')}>
          <Typography variant="light" alignContent="center" sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
            Svenska
          </Typography>
        </MenuItem>
        <MenuItem data-cy="navBar-localeOption-en" onClick={handleMenuItemClick('en')}>
          <Typography variant="light" alignContent="center" sx={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
            English
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  )
}

const UnHijackButton = ({ handleUnhijack }) => (
  <MenuItem data-cy="sign-in-as" onClick={handleUnhijack}>
    <Chip color="error" label="Unhijack" />
  </MenuItem>
)

const NavBar = () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)
  const programmes = useSelector(state => state.studyProgrammes.usersProgrammes)
  const location = useLocation()
  const history = useHistory()
  const [openMenus, setOpenMenus] = React.useState({})

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
    <MenuItem component={Link} to={route} data-cy="nav-home">
      <Tooltip title={t('toFrontpage')} arrow>
        <Box display="flex" alignItems="center" sx={{ gap: 2 }}>
          <img style={{ width: '64px', height: 'auto', margin: '6px 0px' }} src={images.hy} alt="homepage" />
          <Typography variant="light">Tilannekuvalomake</Typography>
        </Box>
      </Tooltip>
    </MenuItem>
  )

  const renderLogOut = () => (
    <Box sx={{ marginLeft: 'auto', alignItems: 'center', display: 'flex' }}>
      <LanguageDropdown t={t} lang={lang} handleLanguageChange={handleLanguageChange} />
      {window.localStorage.getItem('adminLoggedInAs') && <UnHijackButton handleUnhijack={handleUnhijack} />}
      <MenuItem data-cy="nav-logout" onClick={handleLogout} sx={{ gap: 1 }}>
        <Logout />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <Typography variant="light">{`${t('logOut')} (${user.uid})`}</Typography>
          {isSuperAdmin(user) && (
            <Chip color="error" label={`Server running since ${new Date(user.lastRestart).toLocaleTimeString()}`} />
          )}
        </Box>
      </MenuItem>
    </Box>
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
          return isAdmin(user) || user.uid === 'kotkajim'
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

  const [anchorEl, setAnchorEl] = useState({})

  const renderNavRoutes = () => {
    const renderItems = (items, parentKey = null) => {
      return items.map(({ key, label, path, access, items: subItems }) => {
        if (!hasAccess(access)) return null

        const fullKey = parentKey ? `${parentKey}-${key}` : key

        if (subItems) {
          const isOpen = openMenus[fullKey] || false

          const handleMenuClick = event => {
            setAnchorEl({ ...anchorEl, [fullKey]: event.currentTarget })
            setOpenMenus({ ...openMenus, [fullKey]: !isOpen })
          }

          const handleClose = () => {
            setOpenMenus({ ...openMenus, [fullKey]: false })
          }

          return (
            <React.Fragment key={fullKey}>
              <MenuItem
                data-cy={`nav-${key}`}
                onClick={handleMenuClick}
                aria-haspopup="true"
                aria-expanded={isOpen ? 'true' : 'false'}
                sx={{
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    bottom: -2,
                    width: (
                      Array.isArray(path)
                        ? path.some(p => location.pathname.startsWith(p))
                        : location.pathname.startsWith(path)
                    )
                      ? '100%'
                      : '0%',
                    height: '1.5px',
                    backgroundColor: '#007bff',
                    borderRadius: '60px',
                  },
                }}
              >
                <Typography sx={{ display: 'flex', flexDirection: 'row' }}>
                  {t(label)}
                  {isOpen ? <ArrowDropUp /> : <ArrowDropDown />}
                </Typography>
              </MenuItem>
              <Menu
                anchorEl={anchorEl[fullKey]}
                open={isOpen}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
              >
                {renderItems(subItems, fullKey)}
              </Menu>
            </React.Fragment>
          )
        }

        return (
          <MenuItem
            key={fullKey}
            component={Link}
            to={path}
            data-cy={`nav-${key}`}
            onClick={() => setOpenMenus({})}
            sx={{
              position: 'relative',
              '&::after': (() => {
                const pathMatch = path.match(/^\/[^/]+/)
                const currentPathMatch = location.pathname.match(/^\/[^/]+/)
                return {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  bottom: -2,
                  width: pathMatch && currentPathMatch && pathMatch[0] === currentPathMatch[0] ? '100%' : '0%',
                  height: '1.5px',
                  backgroundColor: '#007bff',
                  borderRadius: '3px',
                }
              })(),
            }}
          >
            <Typography variant="regularSmall">{t(label)}</Typography>
          </MenuItem>
        )
      })
    }

    const navItems = Object.values(NavBarItems).filter(item => hasAccess(item.access))

    return (
      <Box display="flex" flexDirection="row" gap={5}>
        {renderItems(navItems)}
      </Box>
    )
  }

  if (location.pathname.startsWith('/evaluation-faculty/previous-years') || !user) return null

  return (
    <AppBar
      elevation={0}
      position="relative"
      sx={{ backgroundColor: 'white', color: 'black', borderBottom: '1px solid #e0e0e0' }}
    >
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          {renderHome('/')}
          <Box marginLeft="auto">{renderNavRoutes()}</Box>
          {renderLogOut()}
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavBar
