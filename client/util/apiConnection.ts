import axios from 'axios'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { getHeaders } from '../../config/mockHeaders'
import { basePath, inProduction } from '../../config/common'
import { Sentry } from './sentry'

/**
 * ApiConnection simplifies redux usage
 */

const getAxios = axios.create({ baseURL: `${basePath}api` })


const api = axios.create({ baseURL: `${basePath}api` })

// @ts-expect-error
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

// @ts-expect-error
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

// @ts-expect-error
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

export const apiConnection = async (
  url: string,
  method: 'get' | 'post' | 'put' | 'delete' = 'get',
  data?: any,
  customHeaders?: any
) => {
  const headers = !inProduction ? { ...getHeaders(), ...customHeaders } : { ...customHeaders }
  const isFormData = data instanceof FormData
  try {
    return await api({
      method,
      url,
      data,
      headers: isFormData ? headers : { 'Content-Type': 'application/json', ...headers },
    })
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        url,
        method,
        isFormData,
      },
      extra: {
        data,
        customHeaders,
      },
    })
    throw error
  }
}

export const formatToArray = <T>(param: T | T[]): T[] => {
  return Array.isArray(param) ? param : [param]
}

export const RTKApi = createApi({
  reducerPath: 'api',
  tagTypes: [
    'Organisation',
    'Documents',
    'Reports',
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: `${basePath}api`,
    prepareHeaders: headers => {
      //@ts-expect-error
      Object.entries(getHeaders()).forEach(([key, value]) => headers.set(key, value))
      return headers
    },
    paramsSerializer: params => {
      const searchParams = new URLSearchParams()

      Object.entries(params).map(([key, val]) => {
        const subfix = Array.isArray(val) ? '[]' : ''
        formatToArray(val).forEach(item => searchParams.append(key + subfix, item))
      })
      return searchParams.toString()
    },
  }),

  endpoints: () => ({}),
})
