import callBuilder from '../apiConnection'

export const getAllDeadlines = () => {
  const route = `/deadlines`
  const prefix = 'GET_ALL_DEADLINES'
  return callBuilder(route, prefix)
}

export const createDeadline = (date) => {
  const route = '/deadlines'
  const prefix = 'CREATE_DEADLINE'
  return callBuilder(route, prefix, 'post', { date })
}

export const getNextDeadline = () => {
  const route = '/deadlines/next'
  const prefix = 'GET_NEXT_DEADLINE'
  return callBuilder(route, prefix)
}

export const deleteDeadline = (id) => {
  const route = `/deadlines/${id}`
  const prefix = 'DELETE_DEADLINE'
  return callBuilder(route, prefix, 'delete')
}

const initialState = {
  existingDeadlines: [],
  nextDeadline: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_ALL_DEADLINES_SUCCESS':
      return {
        ...state,
        existingDeadlines: action.response,
      }
    case 'CREATE_DEADLINE_SUCCESS': {
      return {
        ...state,
        existingDeadlines: state.existingDeadlines.concat(action.response),
      }
    }
    case 'GET_NEXT_DEADLINE_SUCCESS': {
      return {
        ...state,
        nextDeadline: action.response,
      }
    }
    case 'DELETE_DEADLINE_SUCCESS':
      return {
        ...state,
        existingDeadlines: state.existingDeadlines.filter(
          (deadline) => deadline.id !== action.response.id
        ),
        nextDeadline:
          state.nextDeadline && state.nextDeadline.id === action.response.id
            ? null
            : state.nextDeadline,
      }
    default:
      return state
  }
}
