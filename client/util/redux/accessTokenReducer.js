import callBuilder from '../apiConnection'
import { basePath } from '../../../config/common'

/**
 * Actions and reducers are in the same file for readability
 */

export const getTokenAction = (url) => {
  const route = `/access/${url}`
  const prefix = 'GET_TOKEN'
  return callBuilder(route, prefix, 'get')
}

export const claimTokenAction = (url, isFaculty) => {
  const route = isFaculty ? `/access/${url}/faculty` : `/access/${url}`

  const prefix = 'CLAIM_TOKEN'
  return callBuilder(route, prefix, 'post')
}

export const resetTokenAction = (programme, url) => {
  const route = `/programmes/${programme}/tokens/${url}`
  const prefix = 'RESET_TOKEN'
  return callBuilder(route, prefix, 'post')
}

export const resetAdminTokenAction = (programme, url) => {

  console.log(url)
  const route = `/programmes/${programme}/tokens/admin/${url}`
  const prefix = 'RESET_ADMIN_TOKEN'
  return callBuilder(route, prefix, 'post')
}

export const createTokenAction = (programme, type) => {
  const route = `/programmes/${programme}/tokens/create/${type}`
  const prefix = 'CREATE_TOKEN'
  return callBuilder(route, prefix, 'post')
}

export const getAllTokens = () => {
  const route = `/tokens`
  const prefix = 'GET_ALL_TOKENS'
  return callBuilder(route, prefix)
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
      window.location = basePath
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
    case 'RESET_TOKEN_SUCCESS':
      return {
        ...state,
        data: null,
        pending: false,
        error: false,
      }

    case 'RESET_TOKEN_ATTEMPT':
      return {
        ...state,
        data: null,
        pending: true,
        error: false,
      }

    case 'RESET_TOKEN_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    case 'RESET_ADMIN_TOKEN_SUCCESS':
      console.log(action.response)
      return {
        ...state,
        allTokens: state.allTokens.map((t) => {
          if (t.id === action.response.id) return action.response
          return t
        }),
        pending: false,
        error: false,
      }
    case 'RESET_ADMIN_TOKEN_ATTEMPT':
      return {
        ...state,
        data: null,
        pending: true,
        error: false,
      }

    case 'RESET_ADMIN_TOKEN_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    case 'GET_ALL_TOKENS_SUCCESS':
      return {
        ...state,
        allTokens: action.response,
      }

    default:
      return state
  }
}
