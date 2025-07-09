import { sortedItems } from '../util/common'
import callBuilder from '../util/apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getAllUsersAction = () => {
  const route = '/users'
  const prefix = 'GET_ALL_USERS'
  return callBuilder(route, prefix, 'get')
}

export const saveTempAccessAction = data => {
  const route = `/users/tempAccess`
  const prefix = 'SAVE_TEMP_ACCESS'
  return callBuilder(route, prefix, 'post', data)
}

export const deleteTempAccessAction = (uid, programme) => {
  const route = `/users/tempAccess/${uid}/${programme}`
  const prefix = 'DELETE_TEMP_ACCESS'
  return callBuilder(route, prefix, 'delete')
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: [] }, action) => {
  switch (action.type) {
    case 'GET_ALL_USERS_SUCCESS':
      return {
        ...state,
        data: sortedItems(action.response, 'lastname'),
        pending: false,
        error: false,
      }
    case 'GET_ALL_USERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ALL_USERS_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true,
      }

    case 'SAVE_TEMP_ACCESS_SUCCESS':
      return {
        ...state,
        data: state.data.map(u => (u.id === action.response.id ? { ...u, tempAccess: action.response.tempAccess } : u)),
        pending: false,
        error: false,
      }
    case 'SAVE_TEMP_ACCESS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'SAVE_TEMP_ACCESS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'DELETE_TEMP_ACCESS_SUCCESS':
      return {
        ...state,
        data: state.data.map(u => (u.id === action.response.id ? { ...u, tempAccess: action.response.tempAccess } : u)),
        pending: false,
        error: false,
      }
    case 'DELETE_TEMP_ACCESS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'DELETE_TEMP_ACCESS_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
