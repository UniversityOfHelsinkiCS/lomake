import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getAllTempAnswersAction = () => {
  const route = '/answers/temp'
  const prefix = 'GET_ALL_TEMP_ANSWERS'
  return callBuilder(route, prefix)
}

export const getTempAnswersAfterDeadline = (form, year) => {
  const route = `/answers/temp/${form}/${year}`
  const prefix = 'GET_TEMP_ANSWERS_AFTER_DEADLINE'
  return callBuilder(route, prefix)
}

export const getTempAnswersByForm = form => {
  const route = `/answers/temp/${form}`
  const prefix = 'GET_TEMP_ANSWERS_BY_FORM'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_ALL_TEMP_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ALL_TEMP_ANSWERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_ALL_TEMP_ANSWERS_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true,
      }
    case 'GET_TEMP_ANSWERS_AFTER_DEADLINE_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TEMP_ANSWERS_AFTER_DEADLINE_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_TEMP_ANSWERS_BY_FORM_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_TEMP_ANSWERS_BY_FORM_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    default:
      return state
  }
}
