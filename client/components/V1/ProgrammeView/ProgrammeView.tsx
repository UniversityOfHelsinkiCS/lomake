import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, CircularProgress, IconButton, Link, Tabs, Tab, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useParams } from 'react-router'
import { useTranslation } from 'react-i18next'

import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReport, getReports } from '../../../util/redux/reportsSlicer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import { setViewOnly } from '../../../util/redux/formReducer'

import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import NoPermissions from '../../Generic/NoPermissions'

import { ColorKey, GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { RootState } from '@/client/util/store'
import { KeyDataProgramme } from '@/shared/lib/types'
import { KeyDataCardData } from '@/client/lib/types'
import { basePath, isAdmin, hasSomeReadAccess, inProduction } from '@/config/common'
import { getKeyDataPoints } from '../Utils/util'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'

const ProgrammeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { programme: programmeKey } = useParams<{ programme: string }>()
  const [activeTab, setActiveTab] = useState(0)
  const selectedYear = useSelector((state: RootState) => state.filters.keyDataYear)
  const currentUser = useSelector((state: RootState) => state.currentUser)

  const keyData = useFetchSingleKeyData(programmeKey)
  const reports = useSelector((state: RootState) => state.reports.dataForYear)
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
    if (selectedYear) {
      dispatch(getReports({ year: selectedYear }))
    }
  }, [selectedYear])

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

  const ActionsBadge = ({ programmeData }: { programmeData: KeyDataProgramme }) => {
    const { renderActionsBadge } = useNotificationBadge()

    const actionsBadgeData = useMemo(() => {
      return renderActionsBadge(programmeData, true)
    }, [programmeData, reports])

    return actionsBadgeData.showBadge && <NotificationBadge variant={'small'} style={{ marginLeft: 0 }} />
  }

  const TextFieldBadge = ({ programmeData, groupKey }: { programmeData: KeyDataProgramme; groupKey: GroupKey }) => {
    const { renderTrafficLightBadge } = useNotificationBadge()

    const shouldRenderBadge = useMemo(() => {
      return groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey)
    }, [programmeData, groupKey, reports])

    return shouldRenderBadge && <NotificationBadge variant={'small'} />
  }

  const TabBadge = ({ programmeData, tab }: { programmeData: KeyDataProgramme; tab: 'lights' | 'actions' }) => {
    const { renderTabBadge, renderActionsBadge } = useNotificationBadge()

    const shouldRenderBadge = useMemo(() => {
      if (tab === 'lights') return renderTabBadge(programmeData)
      else return renderActionsBadge(programmeData).showBadge
    }, [programmeData, reports])

    return shouldRenderBadge && <NotificationBadge variant={'medium'} style={{ marginLeft: '1.5rem' }} />
  }

  const KeyDataPoints = getKeyDataPoints(t, programme)

  // remove before pilot 
  if (!isAdmin(user) && inProduction) return <NoPermissions />

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <IconButton component={Link} href={`${basePath}v1/overview`} sx={{ marginRight: 2 }}>
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h2" style={{ paddingTop: '2rem' }}>
          {programme.koulutusohjelma[lang]} {selectedYear}
        </Typography>
      </div>

      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mt: 4 }}>
        <Tab
          label={t('keyData:keyFigure')}
          icon={<TabBadge tab="lights" programmeData={programme} />}
          iconPosition="end"
        />
        <Tab
          label={t('keyData:actions')}
          icon={<TabBadge tab="actions" programmeData={programme} />}
          iconPosition="end"
        />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            <Typography variant="h5">{t('keyData:title')}</Typography>
            <br />
            <Typography variant="light">{t('keyData:info1')}</Typography>
            <br />
            <br />
            <Typography variant="light">{t('keyData:info2')}</Typography>
            <br />
            <Typography variant="light">{t('keyData:keyFigureInfo')}</Typography>
            <Typography variant="light">
              <ul>
                <li>{t('keyData:vetovoimaisuus')}</li>
                <li>{t('keyData:lapivirtaus')}</li>
                <li>{t('keyData:opiskelijapalaute')}</li>
                <li>{t('keyData:resurssit')}</li>
              </ul>
            </Typography>
            <Typography variant="light">{t('keyData:criteriaInfo')}</Typography>
          </Alert>

          {Object.values(KeyDataPoints).map((data: KeyDataCardData) => (
            <Box sx={{ p: '2.5rem 0' }} key={data.groupKey}>
              <KeyDataCard level={level} metadata={metadata} programme={programme} {...data} />
              <Box sx={{ alignItems: 'center' }}>
                {data.textField && (
                  <TextFieldComponent id={data.groupKey} type="Comment">
                    <TextFieldBadge programmeData={programme} groupKey={data.groupKey} />
                  </TextFieldComponent>
                )}
              </Box>
            </Box>
          ))}

          <Link
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
            onClick={() => setActiveTab(activeTab === 0 ? 1 : 0)}
          >
            <Typography variant="h4" style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: '6em' }}>
              {t('keyData:moveToActions')}
              <ArrowForwardIcon />
            </Typography>
          </Link>
        </Box>
      )}

      {activeTab === 1 && (
        <Box sx={{ mt: 4 }}>
          <Alert severity="info" sx={{ mb: 4 }}>
            <Typography variant="light">Toimenpiteiden ohjeistus tulossa...</Typography>
          </Alert>
          <TextFieldComponent id={'Toimenpiteet'} type={'Measure'}>
            <ActionsBadge programmeData={programme} />
          </TextFieldComponent>
        </Box>
      )}
    </Box>
  )
}

export default ProgrammeView
