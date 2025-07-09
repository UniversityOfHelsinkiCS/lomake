export const setFaculty = faculty => ({
  type: 'SET_FACULTY',
  faculty,
})

export const clearLevelSpecificFilters = () => ({
  type: 'CLEAR_LEVEL_SPECIFIC_FILTERS',
})

export const setCompanion = companion => ({
  type: 'SET_COMPANION',
  companion,
})

export const setDoctoralSchool = doctoralSchool => ({
  type: 'SET_DOCTORAL_SCHOOL',
  doctoralSchool,
})

export const setLevel = level => ({
  type: 'SET_LEVEL',
  level,
})

export const setYear = year => ({
  type: 'SET_YEAR',
  year,
})

export const setMultipleYears = multipleYears => ({
  type: 'SET_MULTIPLE_YEARS',
  multipleYears,
})

export const setKeyDataYear = keyDataYear => ({
  type: 'SET_KEY_DATA_YEAR',
  keyDataYear,
})

export const setQuestions = questions => ({
  type: 'SET_QUESTIONS',
  questions,
})

export const setForm = form => ({
  type: 'SET_FORM',
  form,
})

export const setColorBlindMode = () => ({
  type: 'SET_COLOR_BLIND_MODE',
})

const initialState = {
  companion: false,
  doctoralSchool: 'allSchools',
  faculty: ['allFaculties'],
  level: 'allProgrammes',
  year: '',
  multipleYears: [],
  keyDataYear: '',
  questions: { selected: [], open: [] },
  form: 1,
  colorBlindMode: false,
  isDoctoral: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_FACULTY': {
      return {
        ...state,
        faculty: action.faculty,
      }
    }
    case 'SET_LEVEL': {
      return {
        ...state,
        level: action.level,
        isDoctoral: action.level === 'doctoral',
      }
    }
    case 'CLEAR_LEVEL_SPECIFIC_FILTERS': {
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
    case 'SET_YEAR': {
      return {
        ...state,
        year: action.year,
      }
    }
    case 'SET_MULTIPLE_YEARS': {
      return {
        ...state,
        multipleYears: action.multipleYears,
      }
    }
    case 'SET_KEY_DATA_YEAR': {
      return {
        ...state,
        keyDataYear: action.keyDataYear,
      }
    }
    case 'SET_QUESTIONS': {
      return {
        ...state,
        questions: action.questions,
      }
    }
    case 'SET_FORM': {
      return {
        ...state,
        form: action.form,
      }
    }
    case 'SET_COLOR_BLIND_MODE': {
      return {
        ...state,
        colorBlindMode: !state.colorBlindMode,
      }
    }
    default:
      return state
  }
}
