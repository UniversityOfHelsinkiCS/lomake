import callBuilder from '../apiConnection'

export const setDraftYear = draftYear => {
  const route = '/draftyears'
  const prefix = 'SET_DRAFT_YEAR'
  return callBuilder(route, prefix, 'post', { draftYear })
}

export const getDraftYear = () => {
  const route = '/draftyears'
  const prefix = 'GET_DRAFT_YEAR'
  return callBuilder(route, prefix)
}

export const deleteDraftYear = () => {
  const route = `/draftyears`
  const prefix = 'DELETE_DRAFT_YEAR'
  return callBuilder(route, prefix, 'delete')
}

const initialState = {
  data: new Date().getFullYear(),
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DRAFT_YEAR_SUCCESS': {
      return {
        ...state,
        data: action.response,
      }
    }
    case 'GET_DRAFT_YEAR_SUCCESS': {
      return {
        ...state,
        data: action.response,
      }
    }
    case 'DELETE_DRAFT_YEAR_SUCCESS':
      return {
        ...state,
        data: '',
      }
    default:
      return state
  }
}
