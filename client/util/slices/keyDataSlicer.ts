import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import callBuilder from '../apiConnection'

export const fetchKeyData = createAsyncThunk('keyData/fetchKeyData', async () => {
  const response = await callBuilder('/keydata', 'GET_KEYDATA')
  return response.data
})

interface KeyDataState {
  data: null | {}
  pending: boolean
  error: boolean
}

const initialState: KeyDataState = {
  data: null,
  pending: false,
  error: false,
}

const keyDataSlice = createSlice({
  name: 'keyData',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchKeyData.pending, (state, action) => {
      state.pending = true
      state.error = false
      state.data = null
    })
    builder.addCase(fetchKeyData.fulfilled, (state, action) => {
      state.pending = false
      state.data = action.payload
    })
    builder.addCase(fetchKeyData.rejected, (state, action) => {
      state.pending = false
      state.error = true
    })
  }
})

export default keyDataSlice.reducer