import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Box, CircularProgress, IconButton, Link, Tabs, Tab, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useHistory, useParams } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'

import { useFetchSingleKeyData } from '../../../hooks/useFetchKeyData'
import { getReport } from '../../../util/redux/reportsSlicer'
import { wsJoinRoom, wsLeaveRoom } from '../../../util/redux/websocketReducer.js'
import { setViewOnly } from '../../../util/redux/formReducer'
import { setKeyDataYear } from '../../../util/redux/filterReducer'

import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import NoPermissions from '../../Generic/NoPermissions'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { RootState, AppDispatch } from '@/client/util/store'
import { KeyDataByCode, KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { KeyDataCardData } from '@/client/lib/types'
import { basePath, isAdmin, hasSomeReadAccess, inProduction } from '@/config/common'
import { calculateKeyDataColor, getKeyDataPoints } from '../Utils/util'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import BreadcrumbComponent from '../Generic/BreadcrumbComponent'

const ProgrammeView = () => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const dispatch: AppDispatch = useDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const { programme: programmeKey, year: selectedYear } = useParams<{ programme: string; year: string }>()
  const [activeTab, setActiveTab] = useState(0)
  const keyData: KeyDataByCode = useFetchSingleKeyData(programmeKey)
  const form = 10

  const level = programmeKey.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI

  const { nextDeadline } = useSelector((state: RootState) => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find((d: Record<string, any>) => d.form === form) : null
  const currentRoom = useSelector((state: RootState) => state.room)
  const user = useSelector((state: RootState) => state.currentUser.data)

  const writeAccess = (user.access[programmeKey] && user.access[programmeKey].write) || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)

  const isValidYear = (targetYear: number, keyData: KeyDataByCode) => {
    const availableYears = keyData.data.programme.map((programmeData: KeyDataProgramme) => programmeData.year)

    if (inProduction) {
      if (availableYears.includes(targetYear - 1) && targetYear >= 2025) return true
    } else {
      if (availableYears.includes(targetYear - 1)) return true
    }

    return false
  }

  useEffect(() => {
    if (!keyData) return
    if (!isValidYear(parseInt(selectedYear), keyData)) return

    document.title = `${t('form')} - ${programmeKey}`
    dispatch(setKeyDataYear(selectedYear))
    dispatch(getReport({ studyprogrammeKey: programmeKey, year: selectedYear }))
  }, [lang, programmeKey, selectedYear, keyData])

  useEffect(() => {
    if (!programmeKey || !keyData) return
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

  const metadata = useMemo(() => {
    return keyData?.data ? keyData.data.metadata : []
  }, [keyData])

  const programmeData = useMemo(() => {
    if (keyData) {
      return keyData.data.programme.find(
        (programmeData: KeyDataProgramme) =>
          programmeData.koulutusohjelmakoodi === programmeKey && programmeData.year === parseInt(selectedYear) - 1,
      )
    }
    return {}
  }, [keyData, selectedYear])

  if (!keyData) {
    return <CircularProgress />
  }

  if (!readAccess && !writeAccess) return <NoPermissions t={t} requestedForm={t('form')} />

  if (!isValidYear(parseInt(selectedYear), keyData)) {
    history.push('/404')
    return
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  const ActionsBadge = ({
    programmeData,
    metadata,
  }: {
    programmeData: KeyDataProgramme
    metadata: KeyDataMetadata[]
  }) => {
    const { renderActionsBadge } = useNotificationBadge()

    const actionsBadgeData = useMemo(() => {
      return renderActionsBadge(programmeData, metadata, true)
    }, [programmeData, metadata, renderActionsBadge])

    return (
      actionsBadgeData.showBadge && (
        <NotificationBadge data-cy={`actionsfieldBadge`} variant={'small'} style={{ marginLeft: 0 }} />
      )
    )
  }

  const TextFieldBadge = ({
    programmeData,
    groupKey,
    metadata,
    level,
  }: {
    programmeData: KeyDataProgramme
    groupKey: GroupKey
    metadata: KeyDataMetadata[]
    level: ProgrammeLevel
  }) => {
    const { renderTrafficLightBadge } = useNotificationBadge()

    const color = useMemo(
      () => calculateKeyDataColor(metadata, programmeData, groupKey, level),
      [metadata, programmeData, groupKey, level],
    )

    const shouldRenderBadge = useMemo(() => {
      return groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color)
    }, [programmeData, groupKey, color, renderTrafficLightBadge])

    return shouldRenderBadge && <NotificationBadge data-cy={`textfieldBadge-${groupKey}`} variant={'small'} />
  }

  const TabBadge = ({
    programmeData,
    tab,
    metadata,
  }: {
    programmeData: KeyDataProgramme
    tab: 'lights' | 'actions'
    metadata: KeyDataMetadata[]
  }) => {
    const { renderTabBadge, renderActionsBadge } = useNotificationBadge()

    const shouldRenderBadge = useMemo(() => {
      if (tab === 'lights') return renderTabBadge(programmeData, metadata)
      else return renderActionsBadge(programmeData, metadata).showBadge
    }, [programmeData, metadata, tab, renderTabBadge, renderActionsBadge])

    return (
      shouldRenderBadge && (
        <NotificationBadge data-cy={`tabBadge-${tab}`} variant={'medium'} style={{ marginLeft: '1.5rem' }} />
      )
    )
  }

  const KeyDataPoints = getKeyDataPoints(t, programmeData)

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ marginTop: '4rem' }}>
        <BreadcrumbComponent
          links={[
            { label: t('keyData:overview'), href: `${basePath}v1/overview` },
            { label: t('keyData:programmeHome'), href: `${basePath}v1/programmes/${form}/${programmeKey}` },
            {
              label: `${t('keyData:year')} ${selectedYear}`,
              href: `${basePath}v1/programmes/${form}/${programmeKey}/${selectedYear}`,
            },
          ]}
        />
      </div>

      <div style={{ display: 'flex', marginTop: '4rem', alignItems: 'center' }}>
        <IconButton
          component={Link}
          href={`${basePath}v1/programmes/${form}/${programmeData.koulutusohjelmakoodi}`}
          sx={{ marginRight: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h2">
          {programmeData.koulutusohjelma[lang]} {selectedYear}
        </Typography>
      </div>

      <Tabs value={activeTab} onChange={handleTabChange} variant="fullWidth" sx={{ mt: 4 }}>
        <Tab
          label={t('keyData:keyFigure')}
          icon={<TabBadge tab="lights" programmeData={programmeData} metadata={metadata} />}
          iconPosition="end"
          data-cy="keyDataTab"
        />
        <Tab
          label={t('keyData:actions')}
          icon={<TabBadge tab="actions" programmeData={programmeData} metadata={metadata} />}
          iconPosition="end"
          data-cy="actionsTab"
        />
      </Tabs>

      {activeTab === 0 && (
        <Box sx={{ mt: 4 }}>
          {programmeData.additionalInfo && programmeData.additionalInfo[lang]?.length && (
            <Alert severity="warning" sx={{ mb: 4 }}>
              <Typography variant="light">{programmeData.additionalInfo[lang]}</Typography>
            </Alert>
          )}
          <Alert severity="info">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="h5">{t('keyData:title')}</Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="light">
                  <Trans i18nKey={'keyData:info1'} />
                </Typography>
                <Typography variant="light">
                  <Trans i18nKey={'keyData:info2'} />
                </Typography>
              </Box>

              <Box>
                <Typography variant="light">{t('keyData:info3')}</Typography>
                <ul style={{ listStyleType: 'none', paddingLeft: 4 }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <TrafficLight color="Tummanvihreä" />
                    <Typography variant="italic">{t('keyData:darkGreenInfo')}</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <TrafficLight color="Vaaleanvihreä" />
                    <Typography variant="italic">{t('keyData:lightGreenInfo')}</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <TrafficLight color="Keltainen" />
                    <Typography variant="italic">{t('keyData:yellowInfo')}</Typography>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrafficLight color="Punainen" />
                    <Typography variant="italic">{t('keyData:redInfo')}</Typography>
                  </li>
                </ul>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="h5">{t('keyData:pilotHeader')}</Typography>
                <Typography variant="light">{t('keyData:pilotInfo1')}</Typography>
                <Typography variant="light">{t('keyData:pilotInfo2')}</Typography>
              </Box>
            </Box>
          </Alert>

          {Object.values(KeyDataPoints).map((data: KeyDataCardData) => (
            <Box sx={{ p: '2.5rem 0' }} key={data.groupKey}>
              <KeyDataCard level={level} metadata={metadata} programme={programmeData} {...data} />
              <Box sx={{ alignItems: 'center' }}>
                {data.textField && (
                  <TextFieldComponent id={data.groupKey} type="Comment">
                    <TextFieldBadge
                      programmeData={programmeData}
                      groupKey={data.groupKey}
                      metadata={metadata}
                      level={level}
                    />
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
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography variant="light">
                <Trans i18nKey={'keyData:actionsInfo1'} />
              </Typography>
              <Typography variant="light">{t('keyData:actionsInfo2')}</Typography>
              <Typography variant="light">{t('keyData:actionsInfo3')}</Typography>
            </Box>
          </Alert>
          <TextFieldComponent id={'Toimenpiteet'} type={'Measure'}>
            <ActionsBadge programmeData={programmeData} metadata={metadata} />{' '}
          </TextFieldComponent>
        </Box>
      )}
    </Box>
  )
}

export default ProgrammeView
