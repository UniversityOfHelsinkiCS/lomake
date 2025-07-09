import callBuilder from '../util/apiConnection'

export const getReformAnswers = () => {
  const route = `/reform/temp`
  const prefix = 'GET_REFORM_ANSWERS'
  return callBuilder(route, prefix)
}

export const getFacultyReformAnswers = faculty => {
  const route = `/reform/faculties/${faculty}`
  const prefix = 'GET_REFORM_ANSWERS'
  return callBuilder(route, prefix)
}

export const getUniversityReformAnswers = dropdownFilter => {
  const route = `/reform/university/${dropdownFilter}`
  const prefix = 'GET_REFORM_ANSWERS'
  return callBuilder(route, prefix)
}

const initialState = {
  data: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'GET_REFORM_ANSWERS_SUCCESS': {
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    }
    default:
      return state
  }
}
