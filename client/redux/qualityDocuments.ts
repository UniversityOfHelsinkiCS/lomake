import { RTKApi } from '../util/apiConnection'
import type { QualityDocumentForm } from '@/shared/lib/types'
import type { QualityDocumentType } from '../lib/types'

interface GetDocumentsArgs {
  studyprogrammeKey: string | undefined
}

interface CreateDocumentArgs {
  studyprogrammeKey: string
  data: QualityDocumentForm | null
  year: number
}

interface GetAllQualityDocumentsArgs {
  selectedYear: number
}

interface UpdateDocumentArgs {
  studyprogrammeKey: string | undefined
  id: string
  data: QualityDocumentForm
}

interface DeleteDocumentArgs {
  studyprogrammeKey: string | undefined
  id: string
}

const qualityDocumentsApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    getQualityDocuments: builder.query<QualityDocumentType[], GetDocumentsArgs>({
      query: ({ studyprogrammeKey }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'get',
      }),
      providesTags: [{ type: 'QualityDocuments', id: 'QDOCS' }],
    }),
    getAllQualityDocuments: builder.query<QualityDocumentType[], GetAllQualityDocumentsArgs>({
      query: ({ selectedYear }) => ({
        url: `/qualitydocuments/all/${selectedYear}`,
        method: 'get',
      }),
    }),
    createQualityDocument: builder.mutation<QualityDocumentType, CreateDocumentArgs>({
      query: ({ studyprogrammeKey, data, year }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}`,
        method: 'post',
        body: { data, year },
      }),
      invalidatesTags: [{ type: 'QualityDocuments', id: 'QDOCS' }],
    }),
    updateQualityDocument: builder.mutation<QualityDocumentType[], UpdateDocumentArgs>({
      query: ({ studyprogrammeKey, id, data }) => ({
        url: `/qualitydocuments/${studyprogrammeKey}/${id}`,
        method: 'put',
        body: { data },
      }),
      async onQueryStarted({ studyprogrammeKey, id, data }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled
          // Update the cache after successful response, don't invalidate to avoid refetch
          dispatch(
            qualityDocumentsApi.util.updateQueryData('getQualityDocuments', { studyprogrammeKey }, draft => {
              const index = draft.findIndex((doc: any) => doc.id === id)
              if (index !== -1) {
                draft[index].data = data
              }
            })
          )
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Failed to update quality document:', error)
        }
      },
    }),
    deleteQualityDocument: builder.mutation<void, DeleteDocumentArgs>({
      query: ({ studyprogrammeKey, id }) => ({
        url: `qualitydocuments/${studyprogrammeKey}/${id}`,
        method: 'delete',
      }),
      invalidatesTags: [{ type: 'QualityDocuments', id: 'QDOCS' }],
    }),
  }),
})

export const {
  useGetQualityDocumentsQuery,
  useGetAllQualityDocumentsQuery,
  useCreateQualityDocumentMutation,
  useUpdateQualityDocumentMutation,
  useDeleteQualityDocumentMutation,
} = qualityDocumentsApi
