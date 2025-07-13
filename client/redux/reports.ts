import { RTKApi } from '../util/apiConnection'

const reportsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    updateReport: builder.mutation({
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

export const { useUpdateReportMutation, useGetReportQuery, useGetReportsQuery } = reportsApi

