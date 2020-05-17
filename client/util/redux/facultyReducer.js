import callBuilder from '../apiConnection'

export const getFaculties = () => {
  const route = `/faculties`
  const prefix = 'GET_FACULTIES'
  return callBuilder(route, prefix)
}

export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_FACULTIES_SUCCESS':
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
