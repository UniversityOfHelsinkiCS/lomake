import { RTKApi } from '../util/apiConnection'
import { Lock } from '@/shared/lib/types'

export type SetLockRequest = { room: string; field: string }
export type DeleteLockRequest = { room: string; field: string }
export type FetchLockRequest = { room: string }

const lockApi = RTKApi.injectEndpoints({
  endpoints: builder => ({
    setLock: builder.mutation<Record<string, Lock | undefined>, SetLockRequest>({
      query: ({ room, field }) => ({
        url: `/lock`,
        method: 'post',
        body: { room, field }
      }),
      invalidatesTags: [{ type: 'Lock', id: 'LOCK' }]
    }),
    fetchLock: builder.query<Record<string, Lock | undefined> | undefined, FetchLockRequest>({
      query: ({ room }) => ({
        url: `/lock/${room}`,
        method: 'get',
      }),
      providesTags: [{ type: 'Lock', id: 'LOCK' }]
    }),
    deleteLock: builder.mutation<Record<string, Lock | undefined>, DeleteLockRequest>({
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

