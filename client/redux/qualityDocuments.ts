import { RTKApi } from '../util/apiConnection'
import type { QualityDocumentForm } from '@/shared/lib/types'
import type { DocumentType } from '../lib/types'

interface GetDocumentsArgs {
  studyprogrammeKey: string
}

interface CreateDocumentArgs {
  studyprogrammeKey: string
  data: QualityDocumentForm | null
}

interface UpdateDocumentArgs {
  studyprogrammeKey: string
  id: string
  data: QualityDocumentForm
}

const qualityDocumentsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getQualityDocuments: builder.query<DocumentType[], GetDocumentsArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    createQualityDocument: builder.mutation<DocumentType[], CreateDocumentArgs>({
      query: ({ studyprogrammeKey, data }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'post',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
    updateQualityDocument: builder.mutation<DocumentType[], UpdateDocumentArgs>({
      query: ({ studyprogrammeKey, id, data }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}/${id}`,
        method: 'put',
        body: { data },
      }),
      invalidatesTags: [{ type: 'Documents', id: 'DOCS' }]
    }),
  })
})

export const { 
  useGetQualityDocumentsQuery, 
  useCreateQualityDocumentMutation,
  useUpdateQualityDocumentMutation,
} 
= qualityDocumentsApi
