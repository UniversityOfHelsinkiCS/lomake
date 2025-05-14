import axios from 'axios'
import callBuilder from '../apiConnection'
import { inProduction, basePath } from '../common'
import { getHeaders as mockHeaders } from '../../../config/mockHeaders'

export const getHeaders = () => {
  return !inProduction ? mockHeaders() : {}
}

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
  const route = `/keyData`
  const prefix = 'GET_KEY_DATA'
  return callBuilder(route, prefix)
}

export const uploadKeyData = (file: any) => {
  return async (dispatch: any) => {
    const route = `${basePath}api/keydata`
    const prefix = 'POST_KEY_DATA'
    const formData = new FormData()
    formData.append('file', file)

    dispatch({ type: `${prefix}_ATTEMPT` })

    try {
      await axios.post(route, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getHeaders(),
        },
      })
      dispatch({ type: `${prefix}_SUCCESS` })
    } catch (error) {
      console.error(error);
      dispatch({ type: `${prefix}_FAILURE` })
    }
  }
}

export const getKeyDataMeta = () => {
  const route = `/keyData/meta`
  const prefix = 'GET_META'
  return callBuilder(route, prefix)
}

export const deleteKeyData = (id: number) => {
  return async (dispatch: any) => {
    const route = `${basePath}api/keydata/${id}`
    const prefix = 'DELETE_KEY_DATA'

    dispatch({ type: `${prefix}_ATTEMPT` })

    try {
      await axios.delete(route, {
        ...getHeaders(),
      })
      dispatch({ type: `${prefix}_SUCCESS` })
    } catch (error) {
      console.error(error);
      dispatch({ type: `${prefix}_FAILURE` })
    }
  }
}

export const setActiveKeyData = (id: number) => {
  return async (dispatch: any) => {
    const route = `${basePath}api/keydata/${id}`
    const prefix = 'SET_ACTIVE_KEY_DATA'

    dispatch({ type: `${prefix}_ATTEMPT` })

    try {
      await axios.put(route, null, {
        ...getHeaders(),
      })
      dispatch({ type: `${prefix}_SUCCESS` })
    } catch (error) {
      console.error(error);
      dispatch({ type: `${prefix}_FAILURE` })
    }
  }
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
    case 'POST_KEY_DATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'POST_KEY_DATA_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'POST_KEY_DATA_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    case 'GET_META_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'GET_META_SUCCESS':
      return {
        ...state,
        meta: action.response,
        pending: false,
        error: false,
      }
    case 'GET_META_FAILURE':
      return {
        ...state,
        meta: [],
        pending: false,
        error: true,
      }
    case 'DELETE_KEY_DATA_ATTEMPT':
      return {
        ...state,
        pending: true,
        error: false,
      }
    case 'DELETE_KEY_DATA_SUCCESS':
      return {
        ...state,
        pending: false,
        error: false,
      }
    case 'DELETE_KEY_DATA_FAILURE':
      return {
        ...state,
        pending: false,
        error: true,
      }
    default:
      return state
  }
}
