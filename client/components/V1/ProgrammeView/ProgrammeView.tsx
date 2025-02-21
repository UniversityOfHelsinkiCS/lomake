import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, CircularProgress, IconButton, Link, Tabs, Tab, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReport } from '../../../util/redux/reportsSlicer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import { setViewOnly } from '../../../util/redux/formReducer'

import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import NoPermissions from '../../Generic/NoPermissions'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataCardData } from '@/client/lib/types'
import { basePath, isAdmin, hasSomeReadAccess } from '@/config/common'
import { RootState } from '@/client/util/store'

const ProgrammeView = () => {
  const lang = useSelector((state: { language: string }) => state.language)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const [activeTab, setActiveTab] = useState(0)

  const keyData = useFetchSingleKeyData(programmeKey, lang)
  const form = 10

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  const { nextDeadline } = useSelector((state: RootState) => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find((d: Record<string, any>) => d.form === form) : null
  const currentRoom = useSelector((state: RootState) => state.room)
  const user = useSelector((state: RootState) => state.currentUser.data)

  const writeAccess = (user.access[programmeKey] && user.access[programmeKey].write) || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)

  useEffect(() => {
    document.title = `${t('form')} - ${programmeKey}`
    dispatch(getReport({ studyprogrammeKey: programmeKey, year: 2025 }))
  }, [lang, programmeKey])

  useEffect(() => {
    if (!programmeKey) return
    if (formDeadline?.form !== form || !writeAccess) {
      dispatch(setViewOnly(true))
      if (currentRoom) {
        dispatch(wsLeaveRoom(form))
      }
    } else {
      dispatch(wsJoinRoom(programmeKey, form))
      dispatch(setViewOnly(false))
    }
  }, [programmeKey, form])

  useEffect(() => {
    return () => {
      dispatch(wsLeaveRoom(form))
    }
  }, [])

  if (!readAccess && !writeAccess) return <NoPermissions t={t} requestedForm={t('form')} />

  if (!keyData) {
    return <CircularProgress />
  }

  const { programme, metadata } = keyData

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const KeyDataPoints: KeyDataCardData[] = [
    {
      title: t('keyData:vetovoima'),
      groupKey: GroupKey.VETOVOIMAISUUS,
      description: t('keyData:vetovoimaInfo'),
      color: programme.vetovoimaisuus,
    },
    {
      title: t('keyData:lapivirtaus'),
      groupKey: GroupKey.LAPIVIRTAUS,
      description: t('keyData:lapivirtausInfo'),
      color: programme.lapivirtaus,
    },
    {
      title: t('keyData:palaute'),
      groupKey: GroupKey.OPISKELIJAPALAUTE,
      description: t('keyData:palauteInfo'),
      color: programme.opiskelijapalaute,
    },
    {
      title: t('keyData:resurssit'),
      groupKey: GroupKey.RESURSSIT,
      description: t('keyData:resurssitInfo'),
      color: programme.resurssit,
    },
  ]

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <IconButton component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <h2>{programme.koulutusohjelma}</h2>
      </div>

      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mt: 4 }}>
        <Tab label={t('keyData:keyFigure')} />
        <Tab label={t('keyData:actions')} />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" icon={false}>
            <Typography variant="h6">{t('keyData:title')}</Typography>
            <br />
            <Typography variant="body1">{t('keyData:info1')}</Typography>
            <br />
            <Typography variant="body1">{t('keyData:info2')}</Typography>
            <br />
            <Typography variant="body1">{t('keyData:keyFigureInfo')}</Typography>
            <ul>
              <li>{t('keyData:vetovoima')}</li>
              <li>{t('keyData:lapivirtaus')}</li>
              <li>{t('keyData:palaute')}</li>
              <li>{t('keyData:resurssit')}</li>
            </ul>
            <Typography variant="body1">{t('keyData:criteriaInfo')}</Typography>
          </Alert>

          {KeyDataPoints.map(data => (
            <React.Fragment key={data.title}>
              <KeyDataCard level={level} metadata={metadata} programme={programme} {...data} />
              <TextFieldComponent id={data.groupKey} type="Comment" />
            </React.Fragment>
          ))}

          <Link
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
          >
            <h4 style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: '6em' }}>
              {t('keyData:moveToActions')}
              <ArrowForwardIcon />
            </h4>
          </Link>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" icon={false} sx={{ mb: 4 }}>
            <Typography variant="h6">Toimenpiteet tulossa...</Typography>
          </Alert>
          <h1>Toimenpiteet koulutusohjelmalle</h1>
          <p>Lorem ipsum</p>
          <TextFieldComponent id={'1'} type={'Programme'} />
          <span style={{ display: 'block', height: '2em' }} />
          <h1>Toimenpiteet tiedekunnalle</h1>
          <p>Lorem ipsum</p>
          <TextFieldComponent id={'2'} type={'Faculty'} />
        </Box>
      )}
    </Box>
  )
}

export default ProgrammeView
