import { RTKApi } from '../util/apiConnection'
import { KeyDataProgramme, KeyData } from '@/shared/lib/types'

export const keyDataApi = RTKApi.injectEndpoints({
  endpoints: (builder) => ({
    fetchKeyData: builder.query<KeyData, void>({
      query: () => '/keyData',
      providesTags: ['KeyData'],
    }),
    uploadKeyData: builder.mutation<void, any>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: 'keydata',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    getKeyDataMeta: builder.query({
      query: () => '/keyData/meta',
      providesTags: ['KeyDataMeta'],
    }),
    deleteKeyData: builder.mutation<void, number>({
      query: (id) => ({
        url: `/keydata/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    setActiveKeyData: builder.mutation<void, number>({
      query: (id) => ({
        url: `/keydata/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
  }),
})

export const {
  useFetchKeyDataQuery,
  useUploadKeyDataMutation,
  useGetKeyDataMetaQuery,
  useDeleteKeyDataMutation,
  useSetActiveKeyDataMutation,
} = keyDataApi

export const useFetchSingleKeyDataQuery = ({ studyprogrammeKey }: { studyprogrammeKey: string }) => {
  const { data, isLoading, error } = useFetchKeyDataQuery()
  const { kandiohjelmat = [], maisteriohjelmat = [], metadata = {} } = data ?? {}
  const programmes = [...kandiohjelmat, ...maisteriohjelmat]
  const programme: KeyDataProgramme[] = programmes.filter(p => p.koulutusohjelmakoodi.trim() === studyprogrammeKey.trim())
  return { isLoading, error, programme, metadata }
}
