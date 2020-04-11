import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getTokenAction = (url) => {
  const route = `/access/${url}`
  const prefix = 'GET_TOKEN'
  return callBuilder(route, prefix, 'get')
}

export const claimTokenAction = (url) => {
  const route = `/access/${url}`
  const prefix = 'CLAIM_TOKEN'
  return callBuilder(route, prefix, 'post')
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_TOKEN_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_TOKEN_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TOKEN_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    case 'CLAIM_TOKEN_SUCCESS':
      window.location = '/'
      return {
        ...state,
        data: null,
        pending: false,
        error: false,
      }
    case 'CLAIM_TOKEN_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'CLAIM_TOKEN_FAILURE':
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
