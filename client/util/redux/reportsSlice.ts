import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiConnection } from '../apiConnection'
import type { ReportData } from '@/shared/lib/types'

export const updateReportHttp = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/putData',
  async (payload, { rejectWithValue }) => {
    const { room, year, id, content } = payload
    try {
      const response = await apiConnection(
        `/reports/${room}/${year}`,
        'put',
        { [id]: content }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const getReport = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/getReport',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, year } = payload
    try {
      const response = await apiConnection(
        `/reports/${studyprogrammeKey}/${year}`,
        'get'
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const getReports = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/getReports',
  async (payload, { rejectWithValue }) => {
    const { year } = payload
    try {
      const response = await apiConnection(
        `/reports/${year}`,
        'get'
      )
      return response.data
    } catch (err: any) {
      // Sentry already handled in apiConnection
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const initialState = {
  data: {},
  dataForYear: {},
  status: 'idle',
}

const reportsSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(updateReportHttp.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(updateReportHttp.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(updateReportHttp.rejected, state => {
      state.status = 'failed'
    })
    builder.addCase(getReports.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getReports.fulfilled, (state, action) => {
      state.dataForYear = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getReports.rejected, state => {
      state.status = 'failed'
    })
    builder.addCase(getReport.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getReport.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getReport.rejected, state => {
      state.status = 'failed'
    })
  },
})

export default reportsSlice.reducer
