import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getProgrammesTokensAction = programme => {
  const route = `/programmes/${programme}/tokens`
  const prefix = 'GET_PROGRAMMES_TOKENS'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_PROGRAMMES_TOKENS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_PROGRAMMES_TOKENS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_PROGRAMMES_TOKENS_FAILURE':
      return {
        ...state,
        data: null,
        pending: false,
        error: true,
      }
    case 'RESET_TOKEN_SUCCESS': // Update existing token
      return {
        ...state,
        data: state.data.map(element => {
          if (element.id === action.response.id) return action.response
          return element
        }),
      }
    case 'CREATE_TOKEN_SUCCESS': // Append newly created token
      return {
        ...state,
        data: state.data.concat(action.response),
      }
    default:
      return state
  }
}
