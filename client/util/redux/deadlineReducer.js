import callBuilder from '../apiConnection'

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
  nextDeadline: undefined,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_OR_UPDATE_DEADLINE_SUCCESS': {
      return {
        ...state,
        nextDeadline: action.response,
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
      }
    default:
      return state
  }
}
