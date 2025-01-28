import { createSlice } from '@reduxjs/toolkit'
import callBuilder from '../apiConnection'

export const updateFormHttp = (studyprogrammeKey: string, year: number, field: string, content: string) => {
  const route = `/reports/${studyprogrammeKey}/${year}/comments`
  const prefix = 'UPDATE_FORM_FIELD'
  return callBuilder(route, prefix, 'put', { [field]: content })
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
    [updateFormHttp.pending]: (state) => {
      state.pending = true
      state.error = false
    },
    [updateFormHttp.ready]: (state, action) => {
      state.pending = false
      state.data = action.payload
    },
    [updateFormHttp.error]: (state) => {
      state.pending = false
      state.error = true
    }
  }
})

export default reportsReducer.reducer