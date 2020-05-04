import callBuilder from '../apiConnection'
/**
 * Actions and reducers are in the same file for readability
 */

export const updateFormField = (field, value, host) => ({
  type: 'UPDATE_FORM_FIELD',
  field,
  value,
  host,
})

export const setViewOnly = (value) => ({
  type: 'SET_VIEW_ONLY',
  value,
})

export const getFormAction = () => {
  const route = '/form'
  const prefix = 'GET_FORM'
  return callBuilder(route, prefix)
}

export const postFormAction = (message) => {
  const route = '/form'
  const prefix = 'SAVE_FORM'
  return callBuilder(route, prefix, 'post', message)
}

// Reducer
// You can include more app wide actions such as "selected: []" into the state
export default (state = { data: {}, viewOnly: false, lastSaved: new Date() }, action) => {
  switch (action.type) {
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        lastSaved: new Date(),
        data: {
          ...state.data,
          [action.field]: action.value,
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
    case 'SET_VIEW_ONLY':
      return {
        ...state,
        viewOnly: action.value,
      }
    default:
      return state
  }
}
