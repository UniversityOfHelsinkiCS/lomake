import { RTKApi } from '../util/apiConnection'
import type { QualityDocumentForm } from '@/shared/lib/types'
import type { QualityDocumentType } from '../lib/types'

interface GetDocumentsArgs {
  studyprogrammeKey: string
}

interface CreateDocumentArgs {
  studyprogrammeKey: string
  data: QualityDocumentForm | null
  year: number
}

interface GetAllQualityDocumentsArgs {
  activeYear: string
}

interface UpdateDocumentArgs {
  studyprogrammeKey: string
  id: string
  data: QualityDocumentForm
}

interface DeleteDocumentArgs {
  studyprogrammeKey: string
  id: string
}

const qualityDocumentsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getQualityDocuments: builder.query<QualityDocumentType[], GetDocumentsArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    getAllQualityDocuments: builder.query<QualityDocumentType[], GetAllQualityDocumentsArgs>({
          query: ({ activeYear }) => ({
            url: `/qualitydocuments/all/${activeYear}`,
            method: 'get',
          }),
        }),
    createQualityDocument: builder.mutation<QualityDocumentType[], CreateDocumentArgs>({
      query: ({ studyprogrammeKey, data, year }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'post',
        body: { data, year },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    updateQualityDocument: builder.mutation<QualityDocumentType[], UpdateDocumentArgs>({
      query: ({ studyprogrammeKey, id, data }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}/${id}`,
        method: 'put',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    deleteQualityDocument: builder.mutation<void, DeleteDocumentArgs>({
      query: ({ studyprogrammeKey, id }) => ({
        url: `qualitydocuments/${studyprogrammeKey}/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
  })
})

export const { 
  useGetQualityDocumentsQuery, 
  useGetAllQualityDocumentsQuery,
  useCreateQualityDocumentMutation,
  useUpdateQualityDocumentMutation,
  useDeleteQualityDocumentMutation
} 
= qualityDocumentsApi
