import { RTKApi } from '../util/apiConnection'

const documentsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getDocuments: builder.query<any, any>({
      query: ({ studyprogrammeKey }) => ({
        url: `/documents/${studyprogrammeKey}`,
        method: 'GET',
      }),
      providesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    getAllDocuments: builder.query({
      query: (activeYear) => ({
        url: `/documents/all/${activeYear}`,
        method: 'GET',
      }),

    }),
    createDocument: builder.mutation({
      query: ({ studyprogrammeKey, data }) => ({
        url: `/documents/${studyprogrammeKey}`,
        method: 'post',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    updateDocument: builder.mutation({
      query: ({ studyprogrammeKey, id, data }) => ({
        url: `/documents/${studyprogrammeKey}/${id}`,
        method: 'put',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    closeInterventionProcedure: builder.mutation({
      query: ({ studyprogrammeKey, data }) => ({
        url: `documents/${studyprogrammeKey}/close/all`,
        method: 'put',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
  })
})

export const { useGetDocumentsQuery, useGetAllDocumentsQuery, useCreateDocumentMutation, useUpdateDocumentMutation, useCloseInterventionProcedureMutation } = documentsApi

