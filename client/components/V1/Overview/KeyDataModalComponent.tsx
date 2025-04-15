import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

import { RootState } from '@/client/util/store'
import { getReport } from '@/client/util/redux/reportsSlicer'
import { wsLeaveRoom } from '@/client/util/redux/websocketReducer.js'
import { setViewOnly } from '@/client/util/redux/formReducer'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataProgramme, KeyDataMetadata } from '@/shared/lib/types'
import type { KeyDataCardData } from '@/client/lib/types'

import { Box, CircularProgress, Typography } from '@mui/material'
import TextFieldCard from '../Generic/TextFieldComponent'
import ModalTemplate from '../Generic/ModalTemplateComponent'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import { getKeyDataPoints } from '@/client/components/V1/Utils/util'

export interface selectedKeyFigureData {
  programme: KeyDataProgramme
  metadata: KeyDataMetadata[]
  type: GroupKey
}

interface DataModalProps {
  data: selectedKeyFigureData
  open: boolean
  setOpen: (open: boolean) => void
}

export default function KeyDataModalComponent({ data, open, setOpen }: DataModalProps) {
  const form = 10
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'se' | 'en'

  // TODO: When the year is coded into the key data itself, remove this and implement the year from that data
  const year = useSelector((state: RootState) => state.filters.keyDataYear)
  const currentRoom = useSelector((state: RootState) => state.room)

  const [programme, setProgramme] = useState<KeyDataProgramme | null>(null)
  const [metadata, setMetadata] = useState<KeyDataMetadata[] | null>(null)
  const [content, setContent] = useState<KeyDataCardData | null>(null)

  useEffect(() => {
    if (!data) {
      setProgramme(null)
      setMetadata(null)
      setContent(null)
      return
    }

    // Make sure the modal is always view only
    dispatch(setViewOnly(true))
    if (currentRoom) {
      dispatch(wsLeaveRoom(form))
    }

    const { programme, metadata } = data

    const KeyDataPoints = getKeyDataPoints(t, programme)

    dispatch(getReport({ studyprogrammeKey: programme.koulutusohjelmakoodi, year: year }))
    setProgramme(programme)
    setMetadata(metadata)
    setContent(KeyDataPoints[data.type])
  }, [lang, data])

  const getLevel = (programmeKey: string) => {
    return programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
  }

  return (
    <ModalTemplate open={open} setOpen={setOpen} data-cy="keydata-modal">
      {!programme || !metadata || !content ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h5" color="textSecondary">
            {programme.koulutusohjelma[lang]} {year}
          </Typography>
          <KeyDataCard
            level={getLevel(programme.koulutusohjelmakoodi)}
            metadata={metadata}
            programme={programme}
            {...content}
          />
          <TextFieldCard id={content.groupKey} type="Comment" />
        </>
      )}
    </ModalTemplate>
  )
}
