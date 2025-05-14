import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath } from '../common'
import { getHeaders } from './keyDataReducer'
import { Sentry } from '../sentry'
import type { ReportData } from '@/shared/lib/types'

const alertSentry = (err: any, route: string, method: string, data: any) => {
  Sentry.captureException(err, {
    tags: {
      route,
      method,
      data,
    },
  })
}

export const updateReportHttp = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/putData',
  async (payload, { rejectWithValue }) => {
    const { room, year, id, content } = payload
    try {
      const response = await axios.put(
        `${basePath}api/reports/${room}/${year}`,
        {
          [id]: content,
        },
        {
          headers: {
            ...getHeaders(),
          },
        },
      )
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/reports/${room}/${year}`, 'PUT', { [id]: content })
      return rejectWithValue((err as any).response.data)
    }
  },
)

export const getReport = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/getReport',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, year } = payload
    try {
      const response = await axios.get(`${basePath}api/reports/${studyprogrammeKey}/${year}`, {
        headers: {
          ...getHeaders(),
        },
      })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/reports/${studyprogrammeKey}/${year}`, 'GET', {})
      return rejectWithValue((err as any).response.data)
    }
  },
)

export const getReports = createAsyncThunk<ReportData, Record<string, any>>(
  'reports/getReports',
  async (payload, { rejectWithValue }) => {
    const { year } = payload
    try {
      const response = await axios.get(`${basePath}api/reports/${year}`, {
        headers: {
          ...getHeaders(),
        },
      })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/reports/${year}`, 'GET', {})
      return rejectWithValue((err as any).response.data)
    }
  },
)

const initialState = {
  data: {},
  dataForYear: {},
  status: 'idle',
}

const reportsReducer = createSlice({
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

export default reportsReducer.reducer
