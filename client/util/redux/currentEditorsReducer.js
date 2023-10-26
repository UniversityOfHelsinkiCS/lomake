/**
 * Actions and reducers are in the same file for readability
 */

export const updateCurrentEditors = value => ({
  type: 'UPDATE_CURRENT_EDITORS',
  value,
})

// Reducer
// You can include more app wide actions such as "selected: []" into the state
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
      // eslint-disable-next-line no-case-declarations
      const byWhom = action.value.donotusethiskeyforanythingbut_uid
      if (state.currentUser === byWhom) {
        return state
      }
      return {
        ...state,
        data: { ...action.value, donotusethiskeyforanythingbut_uid: undefined },
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
