import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Box, CircularProgress } from '@mui/material'
import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReports } from '../../../util/redux/reportsSlicer'
import { wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import { setViewOnly } from '../../../util/redux/formReducer'
import { useTranslation } from 'react-i18next'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataCardData } from '@/client/lib/types'
import { RootState } from '@/client/util/store'
import ModalTemplate from '../Generic/ModalTemplateComponent'

// TODO: Move to client types
export type KeyFigureTypes = 'vetovoimaisuus' | 'lapivirtaus' | 'opiskelijapalaute' | 'resurssit'

// TODO: Move to client types
export interface KeyFigureInfo {
  programmeKey: string
  type: KeyFigureTypes
}
interface DataModalProps {
  keyFigureInfo: KeyFigureInfo
  open: boolean
  setOpen: (open: boolean) => void
}

export default function KeyDataModalComponent({ keyFigureInfo, open, setOpen }: DataModalProps) {
  const form = 10
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language)
  const currentRoom = useSelector((state: RootState) => state.room)
  const [keyData, setKeyData] = useState(null)

  useEffect(() => {
    if (!keyFigureInfo) return

    const fetchedKeyData = useFetchSingleKeyData(keyFigureInfo.programmeKey, lang)
    setKeyData(fetchedKeyData)

    // TODO: NOT CURRENTLY WORKING
    // dispatch(getReports(keyFigureInfo.programmeKey))
  }, [lang, keyFigureInfo])

  useEffect(() => {
    // Make sure the modal is always view only
    dispatch(setViewOnly(true))
    if (currentRoom) {
      dispatch(wsLeaveRoom(form))
    }
  }, [keyFigureInfo, form])

  const getLevel = (programmeKey: string) => {
    return programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
  }

  const { programme, metadata } = keyData

  const KeyDataPoints: Record<KeyFigureTypes, KeyDataCardData> = {
    vetovoimaisuus: {
      title: t('keyData:vetovoima'),
      groupKey: GroupKey.VETOVOIMAISUUS,
      description: t('keyData:vetovoimaInfo'),
      color: programme.vetovoimaisuus,
    },
    lapivirtaus: {
      title: t('keyData:lapivirtaus'),
      groupKey: GroupKey.LAPIVIRTAUS,
      description: t('keyData:lapivirtausInfo'),
      color: programme.lapivirtaus,
    },
    opiskelijapalaute: {
      title: t('keyData:palaute'),
      groupKey: GroupKey.OPISKELIJAPALAUTE,
      description: t('keyData:palauteInfo'),
      color: programme.opiskelijapalaute,
    },
    resurssit: {
      title: t('keyData:resurssit'),
      groupKey: GroupKey.RESURSSIT,
      description: t('keyData:resurssitInfo'),
      color: programme.resurssit,
    },
  }

  const content = KeyDataPoints[keyFigureInfo.type]

  if (!keyData) {
    return <CircularProgress />
  }

  return (
    <ModalTemplate open={open} setOpen={setOpen}>
      <KeyDataCard
        level={getLevel(keyFigureInfo.programmeKey)}
        metadata={metadata}
        programme={programme}
        {...content}
      />
      <TextFieldComponent id={content.groupKey} type="Comment" />
    </ModalTemplate>
  )
}
