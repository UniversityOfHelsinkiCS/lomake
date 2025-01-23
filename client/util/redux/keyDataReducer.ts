import callBuilder from '../apiConnection'
interface State {
  data: any;
  pending?: boolean;
  error?: boolean;
}

interface Action {
  type: string;
  response?: any;
}

export const fetchKeyData = () => {
  const route = '/keyData'
  const prefix = 'GET_KEY_DATA'
  return callBuilder(route, prefix)
}

export default (state: State = { data: null }, action: Action) => {
  switch (action.type) {
    case 'GET_KEY_DATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_KEY_DATA_SUCCESS':
      return {
        ...state,
        data: action.response,
        pending: false,
        error: false,
      }
    case 'GET_KEY_DATA_FAILURE':
      return {
        ...state,
        data: [],
        pending: false,
        error: true,
      }
    default:
      return state
  }
}