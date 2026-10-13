import { isAdmin, isSuperAdmin } from '../../config/common'
import { Sentry } from '../util/sentry'
import callBuilder from '../util/apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const loginAction = () => {
  const route = '/login'
  const prefix = 'LOGIN'
  return callBuilder(route, prefix)
}

export const logoutAction = () => {
  const route = '/logout'
  const prefix = 'LOGOUT'
  return callBuilder(route, prefix, 'post')
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
