export const setDoctoral = value => {
  return { type: 'SET_DOCTORAL', payload: value }
}

const initialState = false

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DOCTORAL':
      return action.payload
    default:
      return state
  }
}
