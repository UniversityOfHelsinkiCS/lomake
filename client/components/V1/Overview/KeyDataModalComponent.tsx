import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, CircularProgress, IconButton, Link, Tabs, Tab, Typography } from '@mui/material'
import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReports } from '../../../util/redux/reportsSlicer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import { setViewOnly } from '../../../util/redux/formReducer'
import { useTranslation } from 'react-i18next'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataCardData } from '@/client/lib/types'
import { basePath, isAdmin } from '@/config/common'
import { RootState } from '@/client/util/store'
import ModalTemplate from '../Generic/ModalTemplateComponent'

interface DataModalProps {
  programmeKey: string
  open: boolean
  setOpen: (open: boolean) => void
}

export default function DataModalComponent({ programmeKey, open, setOpen }: DataModalProps) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language)

  const keyData = useFetchSingleKeyData(programmeKey, lang)
  const form = 10

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  const currentRoom = useSelector((state: RootState) => state.room)

  useEffect(() => {
    dispatch(getReports(programmeKey))
  }, [lang, programmeKey])

  useEffect(() => {
    // Make sure the modal is always view only

    dispatch(setViewOnly(true))
    if (currentRoom) {
      dispatch(wsLeaveRoom(form))
    }
  }, [programmeKey, form])

  if (!keyData) {
    return <CircularProgress />
  }

  const { programme, metadata } = keyData

  const KeyDataPoints: KeyDataCardData[] = [
    {
      title: t('keyData:vetovoima'),
      groupKey: GroupKey.VETOVOIMAISUUS,
      description: t('keyData:vetovoimaInfo'),
      color: programme.vetovoimaisuus,
    },
    // {
    //   title: t('keyData:lapivirtaus'),
    //   groupKey: GroupKey.LAPIVIRTAUS,
    //   description: t('keyData:lapivirtausInfo'),
    //   color: programme.lapivirtaus,
    // },
    // {
    //   title: t('keyData:palaute'),
    //   groupKey: GroupKey.OPISKELIJAPALAUTE,
    //   description: t('keyData:palauteInfo'),
    //   color: programme.opiskelijapalaute,
    // },
    // {
    //   title: t('keyData:resurssit'),
    //   groupKey: GroupKey.RESURSSIT,
    //   description: t('keyData:resurssitInfo'),
    //   color: programme.resurssit,
    // },
  ]

  return (
    <ModalTemplate open={open} setOpen={setOpen}>
      <Box sx={{ mt: 4 }}>
        {KeyDataPoints.map(data => (
          <React.Fragment key={data.title}>
            <KeyDataCard level={level} metadata={metadata} programme={programme} {...data} />
            <TextFieldComponent id={data.groupKey} type="Comment" />
          </React.Fragment>
        ))}
      </Box>
    </ModalTemplate>
  )
}
