import { RTKApi } from '../util/apiConnection'
import type { ReportData } from '@/shared/lib/types'

const reportsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    updateReportHttp: builder.mutation({
      query: ({ studyprogrammeKey, year, id, content }) => ({
        url: `/reports/${studyprogrammeKey}/${year}`,
        method: 'put',
        body: { [id]: content }
      }),
      invalidatesTags: [{ type: 'Reports', id: 'REPS' }]
    }),
    getReport: builder.query({
      query: ({ studyprogrammeKey, year }) => ({
        url: `/reports/${studyprogrammeKey}/${year}`,
        method: 'get'
      }),
      providesTags: [{ type: 'Reports', id: 'REPS' }]
    }),
    getReports: builder.query({
      query: ({ year }) => ({
        url: `/reports/${year}`,
        method: 'get',
      }),
    })
  })
})

export const { useUpdateReportHttpMutation, useGetReportQuery, useGetReportsQuery } = reportsApi

