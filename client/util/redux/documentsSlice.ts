import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiConnection } from '../apiConnection'

export const getDocuments = createAsyncThunk<any, Record<string, any>>(
  'documents/getDocuments',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey } = payload
    try {
      const response = await apiConnection(
        `/documents/${studyprogrammeKey}`,
        'get'
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const getAllDocuments = createAsyncThunk<any, Record<string, any>>(
  'documents/getAllDocuments',
  async (payload, { rejectWithValue }) => {
    const { activeYear } = payload
    try {
      const response = await apiConnection(
        `/documents/all/${activeYear}`,
        'get'
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const createDocument = createAsyncThunk<any, Record<string, any>>(
  'documents/createDocument',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, data } = payload
    try {
      const response = await apiConnection(
        `/documents/${studyprogrammeKey}`,
        'post',
        { data }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const updateDocument = createAsyncThunk<any, Record<string, any>>(
  'documents/updateDocument',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, id, data } = payload
    try {
      const response = await apiConnection(
        `/documents/${studyprogrammeKey}/${id}`,
        'put',
        { data }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const closeInterventionProcedure = createAsyncThunk<any, Record<string, any>>(
  'documents/closeInterventionProcedure',
  async (payload, { rejectWithValue }) => {
    const { studyprogrammeKey, data } = payload
    try {
      const response = await apiConnection(
        `/documents/${studyprogrammeKey}/close/all`,
        'put',
        { data }
      )
      return response.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const initialState = {
  data: [] as Record<string, any>[],
  status: 'idle',
}

const documentsSlice = createSlice({
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
    builder.addCase(getAllDocuments.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getAllDocuments.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getAllDocuments.rejected, state => {
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
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(closeInterventionProcedure.rejected, state => {
      state.status = 'failed'
    })
  },
})

export default documentsSlice.reducer
