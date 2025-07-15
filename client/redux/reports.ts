import { RTKApi } from '../util/apiConnection'
import type { ReportData } from '@/shared/lib/types'

export interface UpdateReportRequest {
  studyprogrammeKey: string
  year: string
  id: string
  content: string
}
export interface GetReportRequest {
  studyprogrammeKey: string
  year: string
}
export interface GetReportsRequest {
  year: string
}

const reportsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    updateReport: builder.mutation<ReportData, UpdateReportRequest>({
      query: ({ studyprogrammeKey, year, id, content }) => ({
        url: `/reports/${studyprogrammeKey}/${year}`,
        method: 'put',
        body: { [id]: content }
      }),
      invalidatesTags: [{ type: 'Reports', id: 'REPS' }]
    }),
    getReport: builder.query<ReportData, GetReportRequest>({
      query: ({ studyprogrammeKey, year }) => ({
        url: `/reports/${studyprogrammeKey}/${year}`,
        method: 'get'
      }),
      providesTags: [{ type: 'Reports', id: 'REPS' }]
    }),
    getReports: builder.query<Record<string, ReportData | never>, GetReportsRequest>({
      query: ({ year }) => ({
        url: `/reports/${year}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Reports', id: 'REPS' }]
    })
  })
})

export const { useUpdateReportMutation, useGetReportQuery, useGetReportsQuery } = reportsApi

