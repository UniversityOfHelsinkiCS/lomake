/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/client/util/hooks'
import { useFetchLockQuery, useSetLockMutation, useDeleteLockMutation } from '@/client/redux/lock'

type UseLockDocumentProps = {
  room: string
  field: string
  onRelease?: () => void
}

export function useLockDocument({ room, field, onRelease }: UseLockDocumentProps) {
  const { t } = useTranslation()
  const [hasLock, setHasLock] = useState(false)
  const [gettingLock, setGettingLock] = useState(false)
  const componentRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!currentUser?.uid) return
    const gotTheLock = !!(lockMap?.[fieldStr] && lockMap[fieldStr].uid === currentUser.uid)
    setHasLock(gotTheLock)
    if (gettingLock && lockMap?.[fieldStr]) setGettingLock(false)
  }, [lockMap, field, currentUser?.uid, gettingLock])

  const askForLock = useCallback(async () => {
    if (!currentUser?.uid) return
    if (!hasLock && !gettingLock && lockMap?.[fieldStr] === undefined) {
      setGettingLock(true)
      await setLock({ room, field: fieldStr })
    }
  }, [hasLock, gettingLock, lockMap, field, setLock, room, currentUser?.uid, fieldStr])

  useEffect(() => {
    void askForLock()
  }, [])

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
    setHasLock(false)
    const fieldStr = String(field)
    await deleteLock({ room, field: fieldStr })
    onRelease?.()
  }, [deleteLock, room, field, onRelease])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasLock) {
        e.preventDefault()
        e.returnValue = ''
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        hasLock &&
        componentRef.current &&
        !componentRef.current.contains(e.target as Node) &&
        document.body.contains(e.target as Node)
      ) {
        // eslint-disable-next-line no-alert
        window.alert(t('qualitydocument:unsavedChangesWarning2'))
        return
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [hasLock, t, handleReleaseLock])

  return {
    hasLock,
    gettingLock,
    isLockedByOther,
    componentRef,
    handleReleaseLock,
  }
}
