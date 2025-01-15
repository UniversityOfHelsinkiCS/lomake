import callBuilder from '../apiConnection'

export const getCommitteeFacultyAnswersAction = (committee, lang) => {
  const route = `/answers/committeeSummary/${committee}/${lang}`
  const prefix = 'GET_COMMITTEE_FACULTY_ANSWERS'
  return callBuilder(route, prefix)
}

export const getFacultyProgrammeAnswersAction = (faculty, lang) => {
  const route = `/answers/forSummary/${faculty}/${lang}`
  const prefix = 'GET_FACULTY_PROG_ANSWERS'
  return callBuilder(route, prefix)
}

export const getProgrammeOldAnswersAction = programme => {
  const route = `/answers/forSummary/${programme}`
  const prefix = 'GET_ALL_OLD_PROG_ANSWERS'
  return callBuilder(route, prefix)
}

export const getOldYearlyFacultyAnswersAction = (faculty, lang) => {
  const route = `/answers/oldSummaryYearly/faculty/${faculty}/${lang}`
  const prefix = 'GET_ALL_OLD_YEARLY_FACULTY_ANSWERS'
  return callBuilder(route, prefix)
}

export const getCurrentEvaluationFacultySummary = (faculty, lang) => {
  const route = `/answers/currentSummaryEvaluation/faculty/${faculty}/${lang}`
  const prefix = 'GET_ALL_CURRENT_EVALUATION_FACULTY_ANSWERS'
  return callBuilder(route, prefix)
}

export default (state = { forFaculty: null, forProgramme: null }, action) => {
  switch (action.type) {
    case 'GET_COMMITTEE_FACULTY_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_COMMITTEE_FACULTY_ANSWERS_SUCCESS':
      return {
        ...state,
        forCommittee: { ...action.response },
        pending: false,
        error: false,
      }
    case 'GET_COMMITTEE_FACULTY_ANSWERS_FAILURE':
      return {
        ...state,
        forCommittee: null,
        pending: false,
        error: true,
      }
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
    case 'GET_ALL_OLD_PROG_ANSWERS_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_ALL_OLD_PROG_ANSWERS_SUCCESS':
      return {
        ...state,
        forProgramme: action.response.answers,
        pending: false,
        error: false,
      }
    case 'GET_ALL_OLD_PROG_ANSWERS_FAILURE':
      return {
        ...state,
        forProgramme: null,
        pending: false,
        error: true,
      }
    case 'GET_ALL_OLD_YEARLY_FACULTY_ANSWERS_SUCCESS':
      return {
        ...state,
        forProgramme: action.response.answers,
        pending: false,
        error: false,
      }
    case 'GET_ALL_OLD_YEARLY_FACULTY_ANSWERS_FAILURE':
      return {
        ...state,
        forProgramme: null,
        pending: false,
        error: true,
      }
    case 'GET_ALL_CURRENT_EVALUATION_FACULTY_ANSWERS_SUCCESS':
      return {
        ...state,
        forProgramme: action.response.answers,
        pending: false,
        error: false,
      }
    case 'GET_ALL_CURRENT_EVALUATION_FACULTY_ANSWERS_FAILURE':
      return {
        ...state,
        forProgramme: null,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
