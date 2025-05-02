import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath, inProduction } from '../common'
import { getHeaders as mockHeaders } from '../../../config/mockHeaders'
import { Sentry } from '../sentry'

const getHeaders = () => {
  return !inProduction ? mockHeaders() : {}
}

const alertSentry = (err: any, route: string, method: string, data: any) => {
  Sentry.captureException(err, {
    tags: {
      route,
      method,
      data,
    },
  })
}

export const getDocuments = createAsyncThunk<any, Record<string, any>>(
  'documents/getDocuments',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey } = payload
    try {
      const response = await axios.get(`${basePath}api/documents/${studyprogrammeKey}`, {
        headers: {
          ...getHeaders(),
        },
      })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/documents/${studyprogrammeKey}`, 'GET', {})
      return rejectWithValue((err as any).response.data)
    }
  },
)

export const createDocument = createAsyncThunk<any, Record<string, any>>(
  'documents/createDocument',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey } = payload
    try {
      const response = await axios.post(`${basePath}api/documents/${studyprogrammeKey}`, { payload },
        {
          headers: {
            ...getHeaders(),
          },
        })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/documents/${studyprogrammeKey}`, 'POST', {})
      return rejectWithValue((err as any).response.data)
    }
  }
)

const initialState = {
  data: {},
  dataForYear: {},
  status: 'idle',
}

const documentsSlicer = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getDocuments.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getDocuments.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getDocuments.rejected, state => {
      state.status = 'failed'
    })
    builder.addCase(createDocument.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(createDocument.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(createDocument.rejected, state => {
      state.status = 'failed'
    })
  },
})

export default documentsSlicer.reducer
