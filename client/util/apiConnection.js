import axios from 'axios'
import { getHeaders } from '../../config/mockHeaders'
import { basePath, inProduction } from '../../config/common'
import { Sentry } from './sentry'

/**
 * ApiConnection simplifies redux usage
 */

const getAxios = axios.create({ baseURL: `${basePath}api` })

export const callApi = async (url, method = 'get', data) => {
  const defaultHeaders = !inProduction ? getHeaders() : {}
  const headers = { ...defaultHeaders }

  const adminLoggedInAs = localStorage.getItem('adminLoggedInAs') // uid
  if (adminLoggedInAs) headers['x-admin-logged-in-as'] = adminLoggedInAs

  return getAxios({
    method,
    url,
    data,
    headers,
  })
}

export default (route, prefix, method = 'get', data, query) => ({
  type: `${prefix}_ATTEMPT`,
  requestSettings: {
    route,
    method,
    data,
    prefix,
    query,
  },
})

/**
 * This is a redux middleware used for tracking api calls
 */

export const handleRequest = store => next => async action => {
  next(action)
  const { requestSettings } = action
  if (requestSettings) {
    const { route, method, data, prefix, query } = requestSettings
    try {
      const res = await callApi(route, method, data)
      store.dispatch({ type: `${prefix}_SUCCESS`, response: res.data, query })
    } catch (err) {
      Sentry.captureException(err, {
        tags: {
          route,
          method,
          data,
          prefix,
          query,
        },
      })
      store.dispatch({ type: `${prefix}_FAILURE`, response: err, query })
    }
  }
}
