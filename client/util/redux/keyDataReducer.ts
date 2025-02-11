import axios from 'axios'
import callBuilder from '../apiConnection'
import { inProduction, basePath } from '../common'
import { getHeaders } from '../../../config/mockHeaders'
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

export const uploadKeyData = (file: any) => {
  return async (dispatch: any) => {
    const route = `${basePath}api/keydata`
    const defaultHeaders = !inProduction ? getHeaders() : {}
    const prefix = 'POST_KEY_DATA'
    const formData = new FormData()
    formData.append('file', file)

    dispatch({ type: `${prefix}_ATTEMPT` })

    try {
      await axios.post(route, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...defaultHeaders,
        },
      })
      dispatch({ type: `${prefix}_SUCCESS` })
    } catch (error) {
      console.error(error);
      dispatch({ type: `${prefix}_FAILURE` })
    }
  };
};
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