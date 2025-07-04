import axios from 'axios'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

export const getOrganisationData = createAsyncThunk<any, Record<string, any>>(
  'organisation/getOrganisationData',
  async () => {
    const response = await axios.get(`${process.env.JAMI_URL}/organisation-data`, {
    })
    return response.data
  }
)

const initialState = {
  data: [] as Record<string, any>[],
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
  }
})

export default organisationSlicer.reducer
