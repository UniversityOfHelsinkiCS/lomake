/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/function-component-definition */
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { wsLeaveRoom } from '@/client/redux/websocketReducer.js'
import { setViewOnly } from '@/client/redux/formReducer'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import type { KeyDataProgramme, KeyDataMetadata } from '@/shared/lib/types'
import type { KeyDataCardData } from '@/client/lib/types'

import { Box, Button, CircularProgress, Link, Typography } from '@mui/material'
import { TextFieldCard } from '../Generic/TextFieldCard'
import ModalTemplate from '../Generic/ModalTemplateComponent'
import KeyDataCard from '../Generic/KeyDataCardComponent'
import { getKeyDataPoints, formatURLFragment } from '@/client/util/v1'
import { ArrowForward } from '@mui/icons-material'
import { basePath } from '@/config/common'
import { useAppDispatch, useAppSelector } from '@/client/util/hooks'

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
  const dispatch = useAppDispatch()
  const lang = useAppSelector(state => state.language) as 'fi' | 'se' | 'en'

  const year = `${data?.programme.year + 1}`
  const currentRoom = useAppSelector(state => state.room)

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

    const KeyDataPoints = getKeyDataPoints(t)

    setProgramme(programme)
    setMetadata(metadata)
    setContent(KeyDataPoints[data.type])
  }, [lang, data])

  const getLevel = (programmeKey: string) => {
    return programmeKey.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master
  }

  return (
    <ModalTemplate data-cy="keydata-modal" open={open} setOpen={setOpen}>
      {!programme || !metadata || !content ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography color="textSecondary" variant="h5">
            {programme.koulutusohjelma[lang]} {year}
          </Typography>
          <KeyDataCard
            level={getLevel(programme.koulutusohjelmakoodi)}
            metadata={metadata}
            programme={programme}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...content}
          />

          <TextFieldCard
            id={content.groupKey}
            studyprogrammeKey={programme.koulutusohjelmakoodi}
            t={t}
            type="Comment"
            year={year}
          />
          <Link
            href={`${basePath}v1/programmes/10/${programme.koulutusohjelmakoodi}/${year}/#${formatURLFragment(content.groupKey)}`}
          >
            <Button startIcon={<ArrowForward />} sx={{ marginTop: 2, float: 'right' }} variant="outlined">
              {t('keyData:moveToOpinion')}
            </Button>
          </Link>
        </>
      )}
    </ModalTemplate>
  )
}
