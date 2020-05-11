/**
 * Actions and reducers are in the same file for readability
 */

export const updateCurrentEditors = (value) => ({
  type: 'UPDATE_CURRENT_EDITORS',
  value,
})

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = {}, action) => {
  switch (action.type) {
    case 'UPDATE_CURRENT_EDITORS':
      return {
        ...state,
        data: action.value,
      }
    case 'WS_LEAVE_ROOM':
      return {
        ...state,
        data: {},
      }
    default:
      return state
  }
}
