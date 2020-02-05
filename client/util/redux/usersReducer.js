import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getAllUsersAction = () => {
  const route = '/users'
  const prefix = 'GET_ALL_USERS'
  return callBuilder(route, prefix, 'get')
}

export const editUserAction = (user) => {
  const route = `/users/${user.id}`
  const prefix = 'EDIT_USER'
  return callBuilder(route, prefix, 'put', user)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_ALL_USERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false
      }
    case 'GET_ALL_USERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false
      }
    case 'GET_ALL_USERS_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true
      }
    case 'EDIT_USER_SUCCESS':
      return {
        ...state,
        data: state.data.map((u) =>
          u.id == action.response.id ? action.response : u
        ),
        pending: false,
        error: false
      }
    case 'EDIT_USER_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false
      }
    case 'EDIT_USER_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true
      }
    default:
      return state
  }
}
