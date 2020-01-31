export default (state = '', action) => {
  switch (action.type) {
    case 'WS_JOIN_ROOM':
      return action.room
    case 'WS_LEAVE_ROOM':
      return ''
    default:
      return state
  }
}
