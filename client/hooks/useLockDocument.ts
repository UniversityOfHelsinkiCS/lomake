/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchLockQuery, useSetLockMutation, useDeleteLockMutation } from '@/client/redux/lock'

type UseLockDocumentProps = {
  room: string
  field: string
  onRelease?: () => void
}

export function useLockDocument({ room, field, onRelease }: UseLockDocumentProps) {
  const [hasLock, setHasLock] = useState(false)
  const [gettingLock, setGettingLock] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)
  const lockLostRef = useRef(false)

  const currentUser = useAppSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser?.data)
  const { data: lockMap } = useFetchLockQuery(
    { room },
    {
      pollingInterval: 1000,
    }
  )

  const [setLock] = useSetLockMutation()
  const [deleteLock] = useDeleteLockMutation()

  const fieldStr = String(field)
  const isLockedByOther = !!(lockMap?.[fieldStr] && lockMap[fieldStr].uid !== currentUser?.uid && currentUser?.uid)
  const isLockedByCurrentUser = !!(lockMap?.[fieldStr] && lockMap[fieldStr].uid === currentUser?.uid)

  useEffect(() => {
    lockLostRef.current = false
    setHasLock(false)
    setGettingLock(false)
  }, [room, fieldStr])

  useEffect(() => {
    if (!currentUser?.uid) return
    const gotTheLock = !!(lockMap?.[fieldStr] && lockMap[fieldStr].uid === currentUser.uid)

    if (hasLock && !gotTheLock) {
      lockLostRef.current = true
      onRelease?.()
    }

    setHasLock(gotTheLock)
    if (gettingLock && lockMap?.[fieldStr]) setGettingLock(false)
  }, [lockMap, field, currentUser?.uid, gettingLock, hasLock, onRelease, fieldStr])

  const askForLock = useCallback(async () => {
    if (!currentUser?.uid) return
    if (lockLostRef.current) return
    if (!hasLock && !gettingLock && lockMap?.[fieldStr] === undefined) {
      setGettingLock(true)
      await setLock({ room, field: fieldStr })
    }
  }, [hasLock, gettingLock, lockMap, field, setLock, room, currentUser?.uid, fieldStr])

  useEffect(() => {
    void askForLock()
  }, [askForLock])

  useEffect(() => {
    return () => {
      if (hasLock) {
        const fieldStr = String(field)
        void deleteLock({ room, field: fieldStr })
        onRelease?.()
      }
    }
  }, [hasLock, room, field, deleteLock, onRelease])

  const handleReleaseLock = useCallback(async () => {
    lockLostRef.current = true
    setHasLock(false)
    const fieldStr = String(field)
    await deleteLock({ room, field: fieldStr })
    onRelease?.()
  }, [deleteLock, room, field, onRelease])

  return {
    hasLock,
    gettingLock,
    isLockedByOther,
    isLockedByCurrentUser,
    componentRef,
    handleReleaseLock,
  }
}
