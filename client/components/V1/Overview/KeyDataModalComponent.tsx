import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { RootState } from '@/client/util/store'
import { getReports } from '@/client/util/redux/reportsSlicer'
import { wsLeaveRoom } from '@/client/util/redux/websocketReducer.js'
import { setViewOnly } from '@/client/util/redux/formReducer'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataCardData, KeyDataProgramme, KeyDataMetadata } from '@/client/lib/types'

import { Box, CircularProgress, Typography } from '@mui/material'
import TextFieldComponent from '../Generic/TextFieldComponent'
import ModalTemplate from '../Generic/ModalTemplateComponent'
import KeyDataCard from '../Generic/KeyDataCardComponent'

// TODO: Move to client types
export type KeyFigureTypes = 'vetovoimaisuus' | 'lapivirtaus' | 'opiskelijapalaute' | 'resurssit'

// TODO: Move to somewhere global
interface selectedKeyFigureData {
  programme: KeyDataProgramme
  metadata: KeyDataMetadata[]
  type: KeyFigureTypes
}
interface DataModalProps {
  data: selectedKeyFigureData
  open: boolean
  setOpen: (open: boolean) => void
}

export default function KeyDataModalComponent({ data, open, setOpen }: DataModalProps) {
  const form = 10 // TODO: Add an explenation for the magic number
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language)

  // TODO: When the year is coded into the key data itself, remove this
  const year = useSelector((state: RootState) => state.filters.year)
  const currentRoom = useSelector((state: RootState) => state.room)

  const [programme, setProgramme] = useState<KeyDataProgramme | null>(null)
  const [metadata, setMetadata] = useState<KeyDataMetadata[] | null>(null)
  const [content, setContent] = useState<KeyDataCardData | null>(null)

  useEffect(() => {
    if (!data) return

    // Make sure the modal is always view only
    dispatch(setViewOnly(true))
    if (currentRoom) {
      dispatch(wsLeaveRoom(form))
    }
  }, [data, form])

  useEffect(() => {
    if (!data) return

    // TODO: DISPATCHING GET REPORTS NOT CURRENTLY WORKING
    // dispatch(getReports(data.programmeKey))

    const { programme, metadata } = data

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

    setProgramme(programme)
    setMetadata(metadata)
    setContent(KeyDataPoints[data.type])
  }, [lang, data])

  const getLevel = (programmeKey: string) => {
    return programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
  }

  return (
    <ModalTemplate open={open} setOpen={setOpen}>
      {!programme || !metadata || !content ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="body1" color="textSecondary">
            {programme.koulutusohjelma} - {year}
          </Typography>
          <KeyDataCard
            level={getLevel(programme.koulutusohjelmakoodi)}
            metadata={metadata}
            programme={programme}
            {...content}
          />
          <TextFieldComponent id={content.groupKey} type="Comment" />
        </>
      )}
    </ModalTemplate>
  )
}
