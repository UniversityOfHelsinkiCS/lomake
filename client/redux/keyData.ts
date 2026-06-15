import { RTKApi } from '../util/apiConnection'
import { KeyDataProgramme, KeyData, KeyDataRow, KeyDataByCodeWithYearAndActive } from '../../shared/lib/types'

const normalizeProgrammeCode = (value: unknown) => (typeof value === 'string' ? value.trim() : '')

export const keyDataApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    fetchKeyData: builder.query<KeyData, void>({
      query: () => '/keyData',
      providesTags: ['KeyData'],
    }),
    fetchAllKeyData: builder.query<KeyDataRow[], void>({
      query: () => '/keydata/all',
      providesTags: ['KeyData'],
    }),
    uploadKeyData: builder.mutation<void, any>({
      query: file => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          url: 'keydata',
          method: 'POST',
          body: formData,
        }
      },
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    getKeyDataMeta: builder.query({
      query: () => '/keydata/meta',
      providesTags: ['KeyDataMeta'],
    }),
    deleteKeyData: builder.mutation<void, number>({
      query: id => ({
        url: `/keydata/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    setActiveKeyData: builder.mutation<void, number>({
      query: id => ({
        url: `/keydata/${id}`,
        method: 'PUT',
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
    lockKeyData: builder.mutation<void, { id: number; year: number }>({
      query: ({ id, year }) => ({
        url: `/keydata/${id}/lock`,
        method: 'PUT',
        body: { year },
      }),
      invalidatesTags: ['KeyData', 'KeyDataMeta'],
    }),
  }),
})

export const {
  useFetchKeyDataQuery,
  useFetchAllKeyDataQuery,
  useUploadKeyDataMutation,
  useGetKeyDataMetaQuery,
  useDeleteKeyDataMutation,
  useSetActiveKeyDataMutation,
  useLockKeyDataMutation,
} = keyDataApi

export const useFetchSingleKeyDataQuery = ({ studyprogrammeKey }: { studyprogrammeKey: string }) => {
  const { data, isLoading, error } = useFetchKeyDataQuery()
  const { kandiohjelmat = [], maisteriohjelmat = [], metadata = [] } = data ?? {}
  const programmes = [...kandiohjelmat, ...maisteriohjelmat]
  const normalizedStudyProgrammeKey = normalizeProgrammeCode(studyprogrammeKey)
  const programme: KeyDataProgramme[] = programmes.filter(
    p => normalizeProgrammeCode(p.koulutusohjelmakoodi) === normalizedStudyProgrammeKey
  )
  return { isLoading, error, programme, metadata }
}

export const useFetchAllKeyData = ({ studyprogrammeKey }: { studyprogrammeKey: string }) => {
  const { data, isLoading, error } = useFetchAllKeyDataQuery()
  const normalizedStudyProgrammeKey = normalizeProgrammeCode(studyprogrammeKey)

  const keyData =
    data?.map(({ data: keyDataRow, active, year }) => {
      const { kandiohjelmat = [], maisteriohjelmat = [], metadata = [] } = keyDataRow ?? {}
      const programmes = [...kandiohjelmat, ...maisteriohjelmat]
      const programme: KeyDataProgramme[] = programmes.filter(
        p => normalizeProgrammeCode(p.koulutusohjelmakoodi) === normalizedStudyProgrammeKey
      )

      return {
        programme,
        metadata,
        active,
        year,
      }
    }) ?? []

  const filteredKeyData: KeyDataByCodeWithYearAndActive[] = keyData.filter(({ programme }) => programme.length > 0)

  return { isLoading, error, keyData: filteredKeyData }
}
