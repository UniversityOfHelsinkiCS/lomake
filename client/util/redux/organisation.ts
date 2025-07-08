import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { RTKApi } from '../apiConnection'

const organisationApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getOrganisationData: builder.query<any, any>({
      query: () => '/organisation-data',
    }),
    getJoryMap: builder.query<any, any>({
      query: () => '/jory-map',

    })
  })
})

export const { useGetOrganisationDataQuery, useGetJoryMapQuery } = organisationApi
