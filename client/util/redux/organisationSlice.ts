import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiConnection } from '../apiConnection'

export const getOrganisationData = createAsyncThunk<any, Record<string, any>>(
  'organisation/getOrganisationData',
  async ({ rejectWithValue }) => {
    try {
      const res = await apiConnection('/organisation-data', 'get')
      return res.data
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message)
    }
  },
)

export const getJoryMap = createAsyncThunk(
  'organisation/getJoryMap',
  async () => {
    const res = await apiConnection(`/jory-map`, 'get')
    return res.data
  }
)

const initialState = {
  data: [] as Record<string, any>[],
  joryMap: {},
  status: 'idle',
}

const organisationSlice = createSlice({
  name: 'organisation',
  initialState,
  reducers: {
    updateData: (state, action) => {
      state.data = action.payload
    },
  },
  extraReducers: builder => {
    builder.addCase(getOrganisationData.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getOrganisationData.fulfilled, (state, action) => {
      state.data = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getOrganisationData.rejected, state => {
      state.status = 'failed'
    })
    builder.addCase(getJoryMap.pending, state => {
      state.status = 'loading'
    })
    builder.addCase(getJoryMap.fulfilled, (state, action) => {
      state.joryMap = action.payload
      state.status = 'succeeded'
    })
    builder.addCase(getJoryMap.rejected, state => {
      state.status = 'failed'
    })
  }
})

export default organisationSlice.reducer
