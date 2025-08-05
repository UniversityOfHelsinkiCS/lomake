import { useState, useEffect, useCallback } from "react";
import { useDeleteLockMutation, useFetchLockQuery, useSetLockMutation } from "../redux/lock";
import { useUpdateReportMutation } from "../redux/reports";
import { ReportDataKey } from "../lib/types";
import { useGetAuthUserQuery } from "../redux/auth";

type UseLockSyncProps = {
  id: ReportDataKey
  content: string
  studyprogrammeKey: string
  year: string
}

export function useLockSync({
  id,
  content,
  studyprogrammeKey,
  year
}: UseLockSyncProps) {
  const [hasLock, setHasLock] = useState(false)
  const [gettingLock, setGettingLock] = useState(false)
  const { uid, isLoading } = useGetAuthUserQuery()
  const { data: lockMap } = useFetchLockQuery({ room: studyprogrammeKey }, {
    pollingInterval: 1000
  })

  const [setLock] = useSetLockMutation()
  const [deleteLock] = useDeleteLockMutation()
  const [updateReport] = useUpdateReportMutation()

  useEffect(() => {
    const gotTheLock = lockMap && lockMap[id] && !isLoading && lockMap[id].uid === uid
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
