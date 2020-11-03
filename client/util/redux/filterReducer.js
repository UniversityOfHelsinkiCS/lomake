

export const clearDoctorFilters = () => ({
  type: 'CLEAR_DOCTOR_FILTERS'
})

export const setCompanion = (companion) => ({
  type: 'SET_COMPANION',
  companion
})

export const setDoctoralSchool = (doctoralSchool) => ({
  type: 'SET_DOCTORAL_SCHOOL',
  doctoralSchool
})

const initialState = {
  companion: false,
  doctoralSchool: 'allSchools',
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'CLEAR_DOCTOR_FILTERS': {
      return {
        ...state,
        companion: false,
        doctoralSchool: 'allSchools',
      }
    }
    case 'SET_COMPANION': {
      return {
        ...state,
        companion: action.companion,
      }
    }
    case 'SET_DOCTORAL_SCHOOL': {
      return {
        ...state,
        doctoralSchool: action.doctoralSchool,
      }
    }
    default:
      return state
  }
}
