import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { basePath } from '../common'
import { getHeaders } from './keyDataReducer'
import { alertSentry } from '../common'

export const getOrganisationData = createAsyncThunk<any, Record<string, any>>(
  'organisation/getOrganisationData',
  async ({ rejectWithValue }) => {
    try {
      const response = await axios.get(`${basePath}api/organisation-data`, {
        headers: {
          ...getHeaders(),
        },
      })
      return response.data
    } catch (err) {
      alertSentry(err, `${basePath}api/organisation-data`, 'GET', {})
      return rejectWithValue((err as any).response.data)
    }
  },
)

export const getJoryMap = createAsyncThunk(
  'organisation/getJoryMap',
  async () => {
    const response = await axios.get(`${basePath}api/jory-map`, {
      headers: {
        ...getHeaders(),
      }
    })
    return response.data
  }
)

const initialState = {
  data: [] as Record<string, any>[],
  joryMap: {},
  status: 'idle',
}

const organisationSlicer = createSlice({
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

export default organisationSlicer.reducer
