export const setLevel = level => {
  return { type: 'SET_LEVEL', payload: level }
}

const initialState = {
  isDoctoral: false,
  selectedLevel: 'bachelorMasterToggle',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_LEVEL':
      return {
        ...state,
        selectedLevel: action.payload,
        isDoctoral: action.payload === 'doctoral',
      }
    default:
      return state
  }
}
