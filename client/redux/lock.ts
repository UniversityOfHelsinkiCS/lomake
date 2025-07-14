import { RTKApi } from '../util/apiConnection'

const lockApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    setLock: builder.mutation({
      query: ({ room, field }) => ({
        url: `/lock`,
        method: 'post',
        body: { room, field }
      }),
      invalidatesTags: [{ type: 'Lock', id: 'LOCK' }]
    }),
    fetchLock: builder.query({
      query: ({ room }) => ({
        url: `/lock/${room}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Lock', id: 'LOCK' }]
    }),
    deleteLock: builder.mutation({
      query: ({ room, field }) => ({
        url: `/lock`,
        method: 'delete',
        body: { room, field }
      }),
      invalidatesTags: [{ type: 'Lock', id: 'LOCK' }]
    })
  })
})

export const { useSetLockMutation, useFetchLockQuery, useDeleteLockMutation } = lockApi

