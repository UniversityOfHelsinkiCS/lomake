import { RTKApi } from '../util/apiConnection'
import type { DocumentForm } from '@/shared/lib/types'
import type { DocumentType, Reason } from '../lib/types'

interface GetDocumentsArgs {
  studyprogrammeKey: string
}

interface GetAllDocumentsArgs {
  activeYear: string
}

interface CreateDocumentArgs {
  studyprogrammeKey: string
  data: DocumentForm | null
}

interface UpdateDocumentArgs {
  studyprogrammeKey: string
  id: string
  data: DocumentForm
}

interface CloseInterventionProcedureArgs {
  studyprogrammeKey: string
  data: Reason
}

const documentsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getDocuments: builder.query<DocumentType[], GetDocumentsArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/documents/${studyprogrammeKey}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    getAllDocuments: builder.query<DocumentType[], GetAllDocumentsArgs>({
      query: ({ activeYear }) => ({
        url: `/documents/all/${activeYear}`,
        method: 'get',
      }),
    }),
    createDocument: builder.mutation<DocumentType[], CreateDocumentArgs>({
      query: ({ studyprogrammeKey, data }) => ({
        url: `/documents/${studyprogrammeKey}`,
        method: 'post',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    updateDocument: builder.mutation<DocumentType[], UpdateDocumentArgs>({
      query: ({ studyprogrammeKey, id, data }) => ({
        url: `/documents/${studyprogrammeKey}/${id}`,
        method: 'put',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    closeInterventionProcedure: builder.mutation<DocumentType[], CloseInterventionProcedureArgs>({
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

