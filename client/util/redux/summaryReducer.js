import callBuilder from '../apiConnection'

export const getFacultyProgrammeAnswersAction = (faculty, lang) => {
  const route = `/answers/forSummary/${faculty}/${lang}`
  const prefix = 'GET_FACULTY_PROG_ANSWERS'
  return callBuilder(route, prefix)
}

export default (state = { forFaculty: null }, action) => {
  switch (action.type) {
    case 'GET_FACULTY_PROG_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_FACULTY_PROG_ANSWERS_SUCCESS':
      return {
        ...state,
        forFaculty: { ...action.response },
        pending: false,
        error: false,
      }
    case 'GET_FACULTY_PROG_ANSWERS_FAILURE':
      return {
        ...state,
        forFaculty: null,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
