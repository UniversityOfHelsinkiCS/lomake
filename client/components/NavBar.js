import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Icon, Typography, MenuItem, Button, Box, AppBar, Container, Divider, Toolbar } from '@mui/material'
import { images } from 'Utilities/common'
import { logoutAction } from 'Utilities/redux/currentUserReducer'
import { setLanguage } from 'Utilities/redux/languageReducer'
import { useTranslation } from 'react-i18next'

export default () => {
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const user = useSelector(state => state.currentUser.data)
  const lang = useSelector(state => state.language)

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const languageLinks = [
    { code: 'fi', text: 'Suomi' },
    { code: 'se', text: 'Svenska' },
    { code: 'en', text: 'English' },
  ]

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
      <MenuItem data-cy="nav-admin" component={Link} to="/admin" name="adminControls">
        {t('adminPage')}
      </MenuItem>
    )
  }

  const GoToEvaluationButton = () => {
    return (
      <MenuItem data-cy="nav-evaluation" component={Link} to="/evaluation" name="evaluation">
        {t('evaluation')}
      </MenuItem>
    )
  }

  const GoToDegreeReformGroup = () => {
    return (
      <MenuItem data-cy="nav-degree-reform-group" component={Link} to="/degree-reform" name="degree-form-group">
        {t('degree-reform-group')}
      </MenuItem>
    )
  }

  const GoToDegreeReformIndividual = () => {
    return (
      <MenuItem
        data-cy="nav-degree-reform-individual-form"
        component={Link}
        to="/degree-reform-individual/form"
        name="degree-reform-individual-form"
      >
        {t('degree-reform-individual')}
      </MenuItem>
    )
  }

  if (!user) return null
  return (
    <>
      <AppBar position="static" style={{ background: 'white', color: 'black' }} disableGutters>
        <Container maxWidth="xl" className="navBar-wrapper" disableGutters>
          <Toolbar disableGutters>
            <MenuItem component={Link} to="/">
              <img style={{ width: '75px', height: 'auto' }} src={images.toska_color} alt="tosca" />
            </MenuItem>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {user.superAdmin ? <GoToEvaluationButton /> : null}
              {user.superAdmin ? <GoToDegreeReformGroup /> : null}
              {user.superAdmin ? <GoToDegreeReformIndividual /> : null}
              {user.admin ? <GoToAdminPageButton /> : null}
            </Box>
            <Box>
              <MenuItem>
                <a href="mailto:ospa@helsinki.fi">
                  <Icon name="mail outline" />
                  ospa@helsinki.fi
                </a>
              </MenuItem>
            </Box>
            <Button
              id="basic-button"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              onClick={handleClick}
            >
              {`${t('chosenLanguage')} (${lang.toUpperCase()}) `}
            </Button>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {languageLinks.map(language => {
                return (
                  <div key={language.code}>
                    <Divider orientation="vertical" flexItem />
                    <MenuItem
                      data-cy={`navBar-localeOption-${language.code}`}
                      value={language.code}
                      onClick={() => setLanguageCode(language.code)}
                    >
                      {language.text}
                    </MenuItem>
                  </div>
                )
              })}
            </Menu>
            {window.localStorage.getItem('adminLoggedInAs') ? unHijackButton() : null}
            <MenuItem style={{ borderRight: '1px solid rgba(34,36,38,.15)' }} component={Link} to="/about">
              {t('about')}
            </MenuItem>
            <MenuItem data-cy="nav-logout" name="log-out" onClick={handleLogout}>
              {`${t('logOut')} (${user.uid})`}
            </MenuItem>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  )
}
