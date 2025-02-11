import { createSlice } from '@reduxjs/toolkit'
import callBuilder from '../apiConnection'

export const updateReportHttp = (studyprogrammeKey: string, year: number, field: string, content: string) => {
  const route = `/reports/${studyprogrammeKey}/${year}`
  const prefix = 'UPDATE_REPORTS_FIELD'
  return callBuilder(route, prefix, 'put', { [field]: content })
}

export const getReports = (studyprogrammeKey: string) => {
  const route = `/reports/${studyprogrammeKey}`
  const prefix = 'GET_FORM'
  return callBuilder(route, prefix)
}

const initialState = {
  data: {},
  pending: false,
  error: false
}

const reportsReducer = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    [updateReportHttp.pending]: (state) => {
      state.pending = true
      state.error = false
    },
    [updateReportHttp.ready]: (state, action) => {
      state.pending = false
      state.data = action.payload
    },
    [updateReportHttp.error]: (state) => {
      state.pending = false
      state.error = true
    },
  }
})

export default reportsReducer.reducer
