import { ARCHIVE_LAST_YEAR, isAdmin, isSuperAdmin } from '../../config/common'
import { Sentry } from '../util/sentry'
import { defaultYears } from '../util/common'
import callBuilder from '../util/apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const loginAction = () => {
  const route = '/login'
  const prefix = 'LOGIN'
  return callBuilder(route, prefix, 'post')
}

export const logoutAction = () => {
  const route = '/logout'
  const prefix = 'LOGOUT'
  return callBuilder(route, prefix, 'post')
}

export const getYearsUserHasAccessToAction = user => {
  const access = Object.values(user.access)
  let usersYears = []

  // Set all the three answered years to be the options by default
  const allYears = defaultYears

  // Add current year as the first one, if it does not exist
  if (!allYears.includes(ARCHIVE_LAST_YEAR)) allYears.unshift(ARCHIVE_LAST_YEAR)

  // eslint disabled as using for-loop is reasonable here
  // eslint-disable-next-line no-restricted-syntax
  for (const p of access) {
    // If user only has access to one year of data, show only that year in the filters and front page
    if (p.year && !usersYears.includes(p.year)) {
      usersYears = [...usersYears, p.year]
    } else if (!p.year) {
      usersYears = allYears
      break
    }
  }
  if (usersYears.length) return usersYears
  return allYears
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: undefined }, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const userData = {
        ...action.response,
        admin: isAdmin(action.response) || isSuperAdmin(action.response),
        superAdmin: isSuperAdmin(action.response),
        yearsUserHasAccessTo: getYearsUserHasAccessToAction(action.response),
      }

      Sentry.setUser({
        id: userData.uid,
        username: userData.username,
        email: userData.email,
      })

      return {
        ...state,
        data: userData,
        pending: false,
        error: false,
      }
    }
    case 'LOGIN_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'LOGOUT_SUCCESS':
      Sentry.setUser(null)
      window.location = action.response.logoutUrl
      return {
        ...state,
        data: null,
        pending: false,
        error: false,
      }
    case 'LOGOUT_ATTEMPT':
      return {
        ...state,
        pending: true,
      }
    case 'LOGOUT_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }

    default:
      return state
  }
}
