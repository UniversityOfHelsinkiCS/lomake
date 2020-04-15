import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getStudyProgrammes = () => {
  const route = `/programmes`
  const prefix = 'GET_STUDYPROGRAMMES'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_STUDYPROGRAMMES_SUCCESS':
      return {
        ...state,
        data: action.response.sort((a, b) => a.name['en'].localeCompare(b.name['en'])),
        pending: false,
        error: false,
      }
    case 'GET_STUDYPROGRAMMES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_STUDYPROGRAMMES_FAILURE':
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
