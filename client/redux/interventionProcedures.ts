import { RTKApi } from '../util/apiConnection'
import type { InterventionProcedureType } from '../lib/types'

interface GetInterventionProceduresArgs {
  studyprogrammeKey: string
}

const interventionProceduresApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getProgrammesInterventionProcedures: builder.query<InterventionProcedureType[], GetInterventionProceduresArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/interventionprocedures/${studyprogrammeKey}`,
        method: 'get',
      }),
    }),
    getActiveInterventionProcedures: builder.query<InterventionProcedureType[], void>({
      query: () => ({
        url: `/interventionprocedures`,
        method: 'get',
      }),
    }),
  }),
})

export const { useGetProgrammesInterventionProceduresQuery, useGetActiveInterventionProceduresQuery } =
  interventionProceduresApi
