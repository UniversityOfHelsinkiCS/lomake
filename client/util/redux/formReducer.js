import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const updateFormField = (field, value, form) => ({
  type: 'UPDATE_FORM_FIELD',
  field,
  value,
  form,
})

export const getLock = field => ({
  type: 'GET_LOCK',
  field,
})

export const setViewOnly = value => ({
  type: 'SET_VIEW_ONLY',
  value,
})

export const setViewingOldAnswers = value => ({
  type: 'SET_VIEWING_OLD_ANSWERS',
  value,
})

export const getSingleProgrammesAnswers = ({ room, year, form }) => {
  const route = `/answers/single/${form}/${room}/${year}`
  const prefix = 'GET_TEMP_ANSWERS'
  return callBuilder(route, prefix)
}

export const getSingleUsersAnswers = () => {
  const route = `/answers/degreeReform/currentAnswer`
  const prefix = 'GET_USER_ANSWERS'
  return callBuilder(route, prefix)
}

export const postIndividualFormAnswer = data => {
  const route = '/answers/degreeReform/individualAnswer'
  const prefix = 'POST_USER_ANSWER'
  return callBuilder(route, prefix, 'POST', { data })
}

export const getAllIndividualAnswersForUser = () => {
  const route = '/answers/degreeReform/getAllAnswersForUser'
  const prefix = 'GET_ALL_INDIVIDUAL_ANSWERS_FOR_USER'
  return callBuilder(route, prefix, 'GET')
}

export const setAnswerLevels = answerLevels => ({
  type: 'SET_ANSWER_LEVELS',
  answerLevels,
})

export const clearFormState = () => ({
  type: 'CLEAR_FORM_STATE',
})
export const updateAnswersReady = ({ room, year, form, ready }) => {
  const route = `/answers/${form}/${room}/${year}/updateAnswersReady`
  const prefix = 'UPDATE_ANSWERS_READY'
  return callBuilder(route, prefix, 'put', { ready })
}

const initialState = {
  data: {},
  viewOnly: false,
  viewingOldAnswers: false,
  lastSaveAttempt: new Date(),
  lastSaveSuccess: new Date(),
  oldIndividualAnswers: [],
  answerLevels: [4, 5, 6, 7],
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        lastSaveAttempt: new Date(),
        data: {
          ...state.data,
          [action.field]: action.value,
          form: action.form,
        },
      }
    case 'SAVE_FORM_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_FORM_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_TEMP_ANSWERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        ready: Boolean(action.response.ready),
        pending: false,
        error: false,
      }
    case 'GET_USER_ANSWERS_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'SET_VIEW_ONLY':
      return {
        ...state,
        viewOnly: action.value,
      }
    case 'SET_VIEWING_OLD_ANSWERS':
      return {
        ...state,
        viewingOldAnswers: action.value,
      }
    case 'UPDATE_CURRENT_EDITORS': {
      return {
        ...state,
        lastSaveSuccess: new Date(),
      }
    }
    case 'SET_ANSWER_LEVELS': {
      return {
        ...state,
        answerLevels: action.answerLevels,
      }
    }
    case 'GET_ALL_INDIVIDUAL_ANSWERS_FOR_USER_SUCCESS': {
      return {
        ...state,
        oldIndividualAnswers: action.response,
      }
    }
    case 'CLEAR_FORM_STATE': {
      return {
        ...initialState,
        pending: state.pending,
        error: state.error,
      }
    }
    case 'POST_USER_ANSWER_ATTEMPT': {
      return {
        ...state,
        pending: true,
      }
    }
    case 'POST_USER_ANSWER_SUCCESS': {
      return {
        ...state,
        pending: false,
        error: false,
    case 'UPDATE_ANSWERS_READY_SUCCESS': {
      return {
        ...state,
        ready: Boolean(action.response.ready),
      }
    }

    default:
      return state
  }
}
