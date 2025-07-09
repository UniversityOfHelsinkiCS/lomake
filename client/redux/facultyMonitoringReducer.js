import callBuilder from '../util/apiConnection'

export const setQuestions = value => {
  const route = '/faculty/set_questions'
  const prefix = 'POST_SET_QUESTIONS'
  return callBuilder(route, prefix, 'POST', { value })
}

export const getQuestions = (faculty, form) => {
  const route = `/faculty/${form}/${faculty}`
  const prefix = 'GET_QUESTIONS'
  return callBuilder(route, prefix)
}

export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'SET_QUESTIONS':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_SELECTED_QUESTIONS':
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
