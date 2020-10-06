import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const getStudyProgrammes = () => {
  const route = `/programmes`
  const prefix = 'GET_STUDYPROGRAMMES'
  return callBuilder(route, prefix)
}

export const getUsersProgrammes = () => {
  const route = `/programmes/foruser`
  const prefix = 'GET_USERS_PROGRAMMES'
  return callBuilder(route, prefix)
}

export const toggleLock = (programmeKey) => {
  const route = `/programmes/${programmeKey}/toggleLock`
  const prefix = 'TOGGLE_LOCK'
  return callBuilder(route, prefix, 'post')
}

export const getProgramme = (key) => {
  const route = `/programmes/${key}`
  const prefix = 'GET_STUDYPROGRAM'
  return callBuilder(route, prefix)
}

export const getProgrammeOwners = () => {
  const route = `/programmes/getOwners`
  const prefix = 'GET_PROGRAMME_OWNERS'
  return callBuilder(route, prefix)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: null }, action) => {
  switch (action.type) {
    case 'GET_STUDYPROGRAMMES_SUCCESS':
      return {
        ...state,
        data: action.response,
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
    case 'GET_USERS_PROGRAMMES_SUCCESS':
      return {
        ...state,
        usersProgrammes: action.response,
        pending: false,
        error: false,
      }
    case 'GET_USERS_PROGRAMMES_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_USERS_PROGRAMMES_FAILURE':
      return {
        ...state,
        usersProgrammes: null,
        pending: false,
        error: true,
      }
    case 'GET_STUDYPROGRAM_ATTEMPT':
      return {
        ...state,
        singleProgramPending: true,
        singleProgram: undefined,
      }
    case 'GET_STUDYPROGRAM_SUCCESS':
      return {
        ...state,
        singleProgramPending: false,
        singleProgram: action.response,
      }
    case 'GET_STUDYPROGRAM_FAILURE':
      return {
        ...state,
        singleProgram: false,
        error: true,
      }
    case 'RESET_STUDYPROGRAM_SUCCESS': {
      return {
        ...state,
        singleProgramPending: false,
        error: false,
        singleProgram: null,
      }
    }
    case 'TOGGLE_LOCK_SUCCESS':
      return {
        ...state,
        data: state.data.map((programme) => {
          if (programme.id === action.response.id) {
            return { ...programme, locked: action.response.locked }
          }
          return programme
        }),
        singleProgram: action.response,
      }
    case 'GET_PROGRAMME_OWNERS_SUCCESS':
      return {
        ...state,
        programmeOwners: action.response,
      }

    default:
      return state
  }
}
