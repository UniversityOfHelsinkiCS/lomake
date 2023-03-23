import callBuilder from '../apiConnection'

export const setDeadlineAndDraftYear = ({ deadline, draftYear, form }) => {
  const route = '/deadlines'
  const prefix = 'SET_DEADLINE_AND_DRAFT_YEAR'
  return callBuilder(route, prefix, 'post', { deadline, draftYear, form })
}

export const getDeadlineAndDraftYear = () => {
  const route = '/deadlines'
  const prefix = 'GET_DEADLINE_AND_DRAFT_YEAR'
  return callBuilder(route, prefix)
}

export const deleteDeadlineAndDraftYear = ({ form }) => {
  const route = `/deadlines`
  const prefix = 'DELETE_DEADLINE_AND_DRAFT_YEAR'
  return callBuilder(route, prefix, 'delete', { form })
}

const initialState = {
  nextDeadline: null,
  draftYear: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_DEADLINE_AND_DRAFT_YEAR_SUCCESS': {
      return {
        nextDeadline: action.response.deadline,
        draftYear: action.response.draftYear,
      }
    }
    case 'GET_DEADLINE_AND_DRAFT_YEAR_SUCCESS': {
      return {
        ...state,
        nextDeadline: action.response.deadline,
        draftYear: action.response.draftYear,
      }
    }
    case 'DELETE_DEADLINE_AND_DRAFT_YEAR_SUCCESS':
      return {
        ...state,
        nextDeadline: null,
        draftYear: null,
      }
    default:
      return state
  }
}
