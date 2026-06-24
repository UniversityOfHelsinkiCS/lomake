/**
 * Actions and reducers are in the same file for readability
 */
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
    default:
      return state
  }
}
