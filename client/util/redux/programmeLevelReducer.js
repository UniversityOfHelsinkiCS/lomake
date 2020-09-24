
export const setProgrammeLevel = (programmeLevel) => ({
  type: 'SET_PROGRAMME_LEVEL',
  programmeLevel,
})


export default (state = 'allProgrammes', action) => {
  switch (action.type) {
    case 'SET_PROGRAMME_LEVEL': {
      return action.programmeLevel
    }
    default:
      return state
  }
}