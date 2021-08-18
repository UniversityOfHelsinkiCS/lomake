import callBuilder from '../apiConnection'
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

export const getYearsUserHasAccessToAction = (user) => {
  const access = Object.values(user.access)
  let usersYears = []

  // Set all the three answered years to be the options by default
  let allYears = [2021, 2020, 2019]
  const currentYear = new Date().getFullYear()

  // Add current year as the first one, if it does not exist
  if (!allYears.includes(currentYear)) allYears.unshift(currentYear)  

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
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        data: {
          ...action.response,
          yearsUserHasAccessTo: getYearsUserHasAccessToAction(action.response),
        },
        pending: false,
        error: false,
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

    case 'CLAIM_TOKEN_SUCCESS':
      return {
        ...state,
        data: {
          ...action.response,
        },
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
