import callBuilder from '../apiConnection'

export const getFaculties = () => {
  const route = `/faculties`
  const prefix = 'GET_FACULTIES'
  return callBuilder(route, prefix)
}

export const setSelectedFaculty = (selectedFaculty) => ({
  type: 'SET_SELECTED_FACULTY',
  selectedFaculty,
})

const initialState = {
  data: null,
  selectedFaculty: 'allFaculties',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_FACULTIES_SUCCESS': {
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    }
    case 'SET_SELECTED_FACULTY': {
      return {
        ...state,
        selectedFaculty: action.selectedFaculty
      }
    }
    default:
      return state
  }
}
