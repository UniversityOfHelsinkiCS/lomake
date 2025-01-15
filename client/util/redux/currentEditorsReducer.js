/**
 * Actions and reducers are in the same file for readability
 */

export const updateCurrentEditors = value => ({
  type: 'UPDATE_CURRENT_EDITORS',
  value,
})

export const releaseFieldLocally = field => ({
  type: 'RELEASE_LOCALLY_EDITOR',
  field,
})

export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS': {
      const userData = {
        ...action.response,
      }
      return {
        ...state,
        currentUser: userData.uid,
      }
    }
    case 'UPDATE_CURRENT_EDITORS':
      if (state.currentUser === action.value.uid) {
        return state
      }
      // eslint-disable-next-line no-console
      return {
        ...state,
        data: action.value.data,
      }
    case 'RELEASE_LOCALLY_EDITOR': {
      const newData = { ...state.data }
      delete newData[action.field] // Remove the field
      return {
        ...state,
        data: newData,
      }
    }
    case 'WS_LEAVE_ROOM':
      return {
        ...state,
        data: {},
      }
    case 'POST_GET_LOCK_SUCCESS':
      return {
        ...state,
        data: action.response,
      }
    case 'POST_GET_LOCK_FAILURE':
      return {
        ...state,
        error: 'ERROR',
      }
    default:
      return state
  }
}
