import callBuilder from '../apiConnection'

export const hasTheDeadlinePassed = () => {
  const route = '/deadlines'
  const prefix = 'HAS_THE_DEADLINE_PASSED'
  return callBuilder(route, prefix)
}

export const createOrUpdateDeadline = (date) => {
  const route = '/deadlines'
  const prefix = 'CREATE_OR_UPDATE_DEADLINE'
  return callBuilder(route, prefix, 'post', { date })
}

export const getDeadline = () => {
  const route = '/deadlines'
  const prefix = 'GET_DEADLINE'
  return callBuilder(route, prefix)
}

export const deleteDeadline = () => {
  const route = `/deadlines`
  const prefix = 'DELETE_DEADLINE'
  return callBuilder(route, prefix, 'delete')
}

const initialState = {
  hasTheDeadlinePassed: undefined,
  nextDeadline: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'HAS_THE_DEADLINE_PASSED': {
      const deadline = action.response
      return {
        ...state,
        hasTheDeadlinePassed: deadline ? false : true,
      }
    }
    case 'CREATE_OR_UPDATE_DEADLINE_SUCCESS': {
      return {
        ...state,
        nextDeadline: action.response,
        hasTheDeadlinePassed: false,
      }
    }
    case 'GET_DEADLINE_SUCCESS': {
      return {
        ...state,
        nextDeadline: action.response,
      }
    }
    case 'DELETE_DEADLINE_SUCCESS':
      return {
        ...state,
        nextDeadline: null,
        hasTheDeadlinePassed: true,
      }
    default:
      return state
  }
}
