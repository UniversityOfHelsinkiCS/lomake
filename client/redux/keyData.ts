import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { apiConnection, RTKApi } from '../util/apiConnection'

export const fetchKeyData = createAsyncThunk(
  'keyData/fetchKeyData',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiConnection('/keyData', 'get')
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const uploadKeyData = createAsyncThunk(
  'keyData/uploadKeyData',
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData()
    formData.append('file', file)
    try {
      await apiConnection('/keydata', 'post', formData)
      return true
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const getKeyDataMeta = createAsyncThunk(
  'keyData/getKeyDataMeta',
  async (_, { rejectWithValue }) => {
    try {
      const res = await apiConnection('/keyData/meta', 'get')
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const deleteKeyData = createAsyncThunk(
  'keyData/deleteKeyData',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiConnection(`/keydata/${id}`, 'delete')
      return id // or return nothing if not needed
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

export const setActiveKeyData = createAsyncThunk(
  'keyData/setActiveKeyData',
  async (id: number, { rejectWithValue }) => {
    try {
      await apiConnection(`/keydata/${id}`, 'put')
      return id
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

interface KeyDataState {
  data: any
  meta?: any
  pending: boolean
  error: string | null
}

const initialState: KeyDataState = {
  data: null,
  meta: null,
  pending: false,
  error: null,
}

const keyDataSlice = createSlice({
  name: 'keyData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchKeyData
      .addCase(fetchKeyData.pending, (state) => {
        state.pending = true
        state.error = null
      })
      .addCase(fetchKeyData.fulfilled, (state, action) => {
        state.pending = false
        state.data = action.payload
      })
      .addCase(fetchKeyData.rejected, (state, action) => {
        state.pending = false
        state.error = action.payload as string
        state.data = []
      })

      // uploadKeyData
      .addCase(uploadKeyData.pending, (state) => {
        state.pending = true
        state.error = null
      })
      .addCase(uploadKeyData.fulfilled, (state) => {
        state.pending = false
      })
      .addCase(uploadKeyData.rejected, (state, action) => {
        state.pending = false
        state.error = action.payload as string
      })

      // getKeyDataMeta
      .addCase(getKeyDataMeta.pending, (state) => {
        state.pending = true
        state.error = null
      })
      .addCase(getKeyDataMeta.fulfilled, (state, action) => {
        state.pending = false
        state.meta = action.payload
      })
      .addCase(getKeyDataMeta.rejected, (state, action) => {
        state.pending = false
        state.meta = []
        state.error = action.payload as string
      })

      // deleteKeyData
      .addCase(deleteKeyData.pending, (state) => {
        state.pending = true
        state.error = null
      })
      .addCase(deleteKeyData.fulfilled, (state) => {
        state.pending = false
      })
      .addCase(deleteKeyData.rejected, (state, action) => {
        state.pending = false
        state.error = action.payload as string
      })

      // setActiveKeyData
      .addCase(setActiveKeyData.pending, (state) => {
        state.pending = true
        state.error = null
      })
      .addCase(setActiveKeyData.fulfilled, (state) => {
        state.pending = false
      })
      .addCase(setActiveKeyData.rejected, (state, action) => {
        state.pending = false
        state.error = action.payload as string
      })
  },
})

export default keyDataSlice.reducer

export const keyDataApi = RTKApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchKeyData: builder.query<any, void>({
      query: () => 'keyData',
      providesTags: ['KeyData'],
    }),
    uploadKeyData: builder.mutation<boolean, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: 'keydata',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    getKeyDataMeta: builder.query<any, void>({
      query: () => 'keyData/meta',
      providesTags: ['KeyDataMeta'],
    }),
    deleteKeyData: builder.mutation<void, number>({
      query: (id) => ({
        url: `keydata/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    setActiveKeyData: builder.mutation<void, number>({
      query: (id) => ({
        url: `keydata/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
  }),
})

export const {
  useFetchKeyDataQuery,
  useUploadKeyDataMutation,
  useGetKeyDataMetaQuery,
  useDeleteKeyDataMutation,
  useSetActiveKeyDataMutation,
} = keyDataApi
