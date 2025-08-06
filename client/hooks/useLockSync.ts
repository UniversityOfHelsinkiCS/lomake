import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../util/hooks";
import { useDeleteLockMutation, useFetchLockQuery, useSetLockMutation } from "../redux/lock";
import { useUpdateReportMutation } from "../redux/reports";
import { ReportDataKey } from "../lib/types";

type UseLockSyncProps = {
  id: ReportDataKey
  content: string
  dataFromRedux: string
  studyprogrammeKey: string
  year: string
}

export function useLockSync({
  id,
  content,
  dataFromRedux,
  studyprogrammeKey,
  year
}: UseLockSyncProps) {
  const [hasLock, setHasLock] = useState(false)
  const [gettingLock, setGettingLock] = useState(false)
  const currentUser = useAppSelector(({ currentUser }: { currentUser: Record<string, any> }) => currentUser.data)
  const { data: lockMap } = useFetchLockQuery({ room: studyprogrammeKey }, {
    pollingInterval: 1000
  })

  const [setLock] = useSetLockMutation()
  const [deleteLock] = useDeleteLockMutation()
  const [updateReport] = useUpdateReportMutation()

  useEffect(() => {
    const gotTheLock = lockMap && lockMap[id] && lockMap[id].uid === currentUser.uid
    setHasLock(gotTheLock)
    if (gettingLock && lockMap?.[id]) setGettingLock(false)
  }, [lockMap])

  const askForLock = useCallback(() => {
    if (!hasLock && !gettingLock && lockMap?.[id] === undefined) {
      setGettingLock(true);
      setLock({ room: studyprogrammeKey, field: id });
    }
  }, [hasLock, gettingLock, lockMap, id, setLock, studyprogrammeKey]);

  const handleStopEditing = useCallback(() => {
    setHasLock(false);
    deleteLock({ room: studyprogrammeKey, field: id });
    updateReport({ studyprogrammeKey, year, id, content });
  }, [deleteLock, updateReport, studyprogrammeKey, year, id, content]);

  return {
    hasLock,
    gettingLock,
    askForLock,
    handleStopEditing,
  }
}
