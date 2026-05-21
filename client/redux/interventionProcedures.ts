import { RTKApi } from '../util/apiConnection'
import type { InterventionProcedureType } from '../lib/types'

interface GetInterventionProceduresArgs {
  studyprogrammeKey: string
}

interface CreateInterventionProcedureArgs {
  studyprogrammeKey: string
  year: number
}

const interventionProceduresApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getProgrammesInterventionProcedures: builder.query<InterventionProcedureType[], GetInterventionProceduresArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/interventionprocedures/${studyprogrammeKey}`,
        method: 'get',
      }),
      providesTags: [{ type: 'InterventionProcedures' }],
    }),
    getInterventionProcedures: builder.query<InterventionProcedureType[], void>({
      query: () => ({
        url: `/interventionprocedures`,
        method: 'get',
      }),
    }),
    createInterventionProcedure: builder.mutation<InterventionProcedureType, CreateInterventionProcedureArgs>({
      query: ({ studyprogrammeKey, year }) => ({
        url: `/interventionprocedures/`,
        method: 'post',
        body: { studyprogrammeKey, year },
      }),
      invalidatesTags: [{ type: 'InterventionProcedures' }],
    }),
    updateInterventionProcedure: builder.mutation<InterventionProcedureType, { id: number; startYear: number }>({
      query: ({ id, startYear }) => ({
        url: `/interventionprocedures/${id}`,
        method: 'put',
        body: { startYear },
      }),
      invalidatesTags: [{ type: 'InterventionProcedures' }],
    }),
  }),
})

export const {
  useGetProgrammesInterventionProceduresQuery,
  useGetInterventionProceduresQuery,
  useCreateInterventionProcedureMutation,
  useUpdateInterventionProcedureMutation,
} = interventionProceduresApi
