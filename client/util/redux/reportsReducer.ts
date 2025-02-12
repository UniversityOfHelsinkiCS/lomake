import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath, inProduction } from '../common'
import { getHeaders as mockHeaders } from '../../../config/mockHeaders'

const getHeaders = () => {
  return !inProduction ? mockHeaders() : {}
}


export const updateReportHttp = createAsyncThunk('reports/putData', async (payload: any) => {
  const { room, year, id, content } = payload
  const response = await axios.put(`${basePath}api/reports/${room}/${year}`, 
    { 
      [id]: content 
    },
    {
    headers: {
      ...getHeaders()
    },
  })
  return response.data
})

export const getReports = createAsyncThunk('reports/fetchData', async (studyprogrammeKey: string) => {
  const response = await axios.get(`${basePath}api/reports/${studyprogrammeKey}`, {
    headers: {
      ...getHeaders()
    }
  })
  return response.data
})

const initialState = {
  data: {},
  status: "idle",
}

const reportsReducer = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateReportHttp.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(updateReportHttp.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(updateReportHttp.rejected, (state) => {
      state.status = 'failed'
    })
    builder.addCase(getReports.pending, (state) => {
      state.status = 'loading'
    })
    builder.addCase(getReports.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getReports.rejected, (state) => {
      state.status = 'failed'
    })
  }
})

export default reportsReducer.reducer
