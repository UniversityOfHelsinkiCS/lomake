import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getAnswersAction = () => {
  const route = '/answers/foruser'
  const prefix = 'GET_ANSWERS'
  return callBuilder(route, prefix)
}

export const getAnswersActionAll = () => {
  const route = '/answers/foruser/all'
  const prefix = 'GET_ANSWERS_ALL'
  return callBuilder(route, prefix)
}

const initialState = {
  data: null,
  years: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ANSWERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        years: action.response.reduce((pre, cur) => {
          if (!pre.includes(cur.year)) pre.push(cur.year)
          return pre
        }, []),
        pending: false,
        error: false,
      }
    case 'GET_ANSWERS_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true,
      }
    case 'GET_ANSWERS_ALL_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ANSWERS_ALL_SUCCESS':
      return {
        ...state,
        data: action.response,
        years: action.response.reduce((pre, cur) => {
          if (!pre.includes(cur.year)) pre.push(cur.year)
          return pre
        }, []),
        pending: false,
        error: false,
      }
    case 'GET_ANSWERS_ALL_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true,
      }

    default:
      return state
  }
}
