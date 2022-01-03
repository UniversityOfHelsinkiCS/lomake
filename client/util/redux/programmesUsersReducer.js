import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getProgrammesUsersAction = programme => {
  const route = `/programmes/${programme}/users`
  const prefix = 'GET_PROGRAMMES_USERS'
  return callBuilder(route, prefix)
}

export const editUserAccessAction = (id, programme, access) => {
  const route = `/programmes/${programme}/users/${id}/access`
  const prefix = 'EDIT_PROGRAMMES_USER'
  return callBuilder(route, prefix, 'put', access)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_PROGRAMMES_USERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_PROGRAMMES_USERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PROGRAMMES_USERS_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    case 'EDIT_PROGRAMMES_USER_SUCCESS':
      return {
        ...state,
        data: state.data
          .filter(
            u => u.id !== action.response.user.id || (u.id === action.response.user.id && action.response.stillAccess)
          )
          .map(u => (u.id === action.response.user.id ? action.response.user : u)),
        pending: false,
        error: false,
      }
    case 'EDIT_PROGRAMMES_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'EDIT_PROGRAMMES_USER_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
