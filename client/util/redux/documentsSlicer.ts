import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { basePath } from '../common'
import { getHeaders } from './keyDataReducer'
import { Sentry } from '../sentry'

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
    const { studyprogrammeKey, data } = payload
    try {
      const response = await axios.post(`${basePath}api/documents/${studyprogrammeKey}`, { data },
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

export const updateDocument = createAsyncThunk<any, Record<string, any>>(
  'documents/updateDocument',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, id, data } = payload
    try {
      const response = await axios.put(`${basePath}api/documents/${studyprogrammeKey}/${id}`, { data },
        {
          headers: {
            ...getHeaders(),
          },
        })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/documents/${studyprogrammeKey}/${id}`, 'PUT', {})
      return rejectWithValue((err as any).response.data)
    }
  }
)

export const closeInterventionProcedure = createAsyncThunk<any, Record<string, any>>(
  'documents/closeInterventionProcedure',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, data } = payload
    try {
      const response = await axios.put(`${basePath}api/documents/${studyprogrammeKey}/close/all`, { data },
        {
          headers: {
            ...getHeaders(),
          },
        })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/documents/${studyprogrammeKey}/close/all`, 'PUT', {})
      return rejectWithValue((err as any).response.data)
    }
  }
)

const initialState = {
  data: [] as Record<string, any>[],
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
    builder.addCase(updateDocument.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(updateDocument.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.data = action.payload
    })
    builder.addCase(updateDocument.rejected, state => {
      state.status = 'failed'
    })
    builder.addCase(closeInterventionProcedure.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(closeInterventionProcedure.fulfilled, (state, action) => {
      console.log('action payload', action.payload)
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(closeInterventionProcedure.rejected, state => {
      state.status = 'failed'
    })
  },
})

export default documentsSlicer.reducer
