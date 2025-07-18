import React, { useEffect, useMemo, useState, useRef } from 'react'
import { Alert, Box, CircularProgress, IconButton, Link, Tabs, Tab, Typography } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { useHistory, useParams, useLocation } from 'react-router'
import { Trans, useTranslation } from 'react-i18next'

import { setViewOnly } from '../../../redux/formReducer'
import { setKeyDataYear } from '../../../redux/filterReducer'

import KeyDataCard from '../Generic/KeyDataCardComponent'
import TextFieldComponent from '../Generic/TextFieldComponent'
import NoPermissions from '../../Generic/NoPermissions'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { KeyDataCardData } from '@/client/lib/types'
import { basePath, isAdmin, hasSomeReadAccess, inProduction } from '@/config/common'
import { calculateKeyDataColor, formatURLFragment, getKeyDataPoints } from '@/client/util/v1'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import BreadcrumbComponent from '../Generic/BreadcrumbComponent'
import { useAppSelector, useAppDispatch } from '@/client/util/hooks'
import { useGetReportsQuery } from '@/client/redux/reports'
import { useFetchSingleKeyDataQuery } from '@/client/redux/keyData'

const ProgrammeView = () => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { t } = useTranslation()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const { programme: studyprogrammeKey, year } = useParams<{ programme: string; year: string }>()
  const [activeTab, setActiveTab] = useState(0)
  const { isLoading, programme, metadata } = useFetchSingleKeyDataQuery({ studyprogrammeKey })
  const form = 10
  const { data: reports = {} } = useGetReportsQuery({ year })

  const level = studyprogrammeKey.startsWith('K') ? ProgrammeLevel.Bachelor : ProgrammeLevel.Master

  const { nextDeadline } = useAppSelector(state => state.deadlines)
  const formDeadline = nextDeadline ? nextDeadline.find((d: Record<string, any>) => d.form === form) : null
  const user = useAppSelector(state => state.currentUser.data)

  const writeAccess = (user.access[studyprogrammeKey] && user.access[studyprogrammeKey].write) || isAdmin(user)
  const readAccess = hasSomeReadAccess(user) || isAdmin(user)

  const anchorItems = useRef<Record<string, HTMLDivElement | null>>({})

  const isValidYear = (targetYear: number, programme: KeyDataProgramme[]) => {
    const availableYears = programme.map((programmeData: KeyDataProgramme) => programmeData.year)

    if (inProduction) {
      if (availableYears.includes(targetYear - 1) && targetYear >= 2025) return true
    } else {
      if (availableYears.includes(targetYear - 1)) return true
    }

    return false
  }

  useEffect(() => {
    const tabParam = searchParams.get('tab')
    setActiveTab(parseInt(tabParam) || 0)

    return () => {
      // dispatch(wsLeaveRoom(form))
    }
  }, [])

  useEffect(() => {
    if (!programme) return
    if (!isValidYear(parseInt(year), programme)) return

    document.title = `${t('form')} - ${studyprogrammeKey}`
    dispatch(setKeyDataYear(year))
  }, [lang, studyprogrammeKey, year, programme])

  useEffect(() => {
    if (!studyprogrammeKey || !programme) return
    if ((new Date(formDeadline?.date).getFullYear().toString() !== year) || !writeAccess) {
      dispatch(setViewOnly(true))
    } else {
      dispatch(setViewOnly(false))
    }
  }, [studyprogrammeKey, form, programme])

  const programmeData = useMemo(() => {
    if (programme) {
      return programme.find(
        (programmeData: KeyDataProgramme) =>
          programmeData.koulutusohjelmakoodi === studyprogrammeKey && programmeData.year === parseInt(year) - 1,
      )
    }
    return {}
  }, [programme, year])

  useEffect(() => {
    if (!programme || !programmeData) return
    const anchor = location.hash.substring(1)

    if (anchor && anchorItems.current[anchor]) {
      anchorItems.current[anchor].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [programmeData, location.hash])

  if (isLoading) {
    return <CircularProgress />
  }

  if (!readAccess && !writeAccess) return <NoPermissions t={t} requestedForm={t('form')} />

  if (!isValidYear(parseInt(year), programme)) {
    history.push('/404')
    return
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
    history.push({
      pathname: location.pathname,
      search: `?tab=${newValue}`,
    })
  }

  const ActionsBadge = ({
    programmeData,
    metadata,
  }: {
    programmeData: KeyDataProgramme
    metadata: KeyDataMetadata[]
  }) => {
    const { renderActionsBadge } = useNotificationBadge()
    const actionsBadgeData = () => {
      return renderActionsBadge(programmeData, metadata, true, reports)
    }
    return (
      actionsBadgeData().showBadge && (
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

    const shouldRenderBadge = () => {
      return groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color, reports)
    }

    return shouldRenderBadge() && <NotificationBadge data-cy={`textfieldBadge-${groupKey}`} variant={'small'} />
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

    const shouldRenderBadge = () => {
      if (tab === 'lights') return renderTabBadge(programmeData, metadata, reports)
      else return renderActionsBadge(programmeData, metadata, false, reports).showBadge
    }

    return (
      shouldRenderBadge() && (
        <NotificationBadge data-cy={`tabBadge-${tab}`} variant={'medium'} style={{ marginLeft: '1.5rem' }} />
      )
    )
  }

  const KeyDataPoints = getKeyDataPoints(t)

  return (
    <Box sx={{ width: '75%' }}>
      <div style={{ marginTop: '4rem' }}>
        <BreadcrumbComponent
          links={[
            { label: t('keyData:overview'), href: `${basePath}v1/overview` },
            { label: t('keyData:programmeHome'), href: `${basePath}v1/programmes/${form}/${studyprogrammeKey}` },
            {
              label: `${t('keyData:year')} ${year}`,
              href: `${basePath}v1/programmes/${form}/${studyprogrammeKey}/${year}`,
            },
          ]}
        />
      </div>

      <div style={{ display: 'flex', marginTop: '2rem', marginBottom: '2rem', alignItems: 'center' }}>
        <IconButton
          component={Link}
          href={`${basePath}v1/programmes/${form}/${programmeData.koulutusohjelmakoodi}`}
          sx={{ marginRight: 2 }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h2">
          {programmeData.koulutusohjelma[lang]} {year}
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

          {Object.values(KeyDataPoints).map((data: KeyDataCardData) => {
            const anchor = formatURLFragment(data.groupKey)
            return (
              <Box
                sx={{ pt: '2.5rem' }}
                key={data.groupKey}
                id={anchor}
                ref={(el: any | null) => {
                  anchorItems.current[anchor] = el
                }}
              >
                <KeyDataCard level={level} metadata={metadata} programme={programmeData} {...data} />
                <Box sx={{ alignItems: 'center' }}>
                  {data.textField && (
                    <div style={{ minHeight: 200 }}>
                      <TextFieldComponent id={data.groupKey} type="Comment">
                        <TextFieldBadge
                          programmeData={programmeData}
                          groupKey={data.groupKey}
                          metadata={metadata}
                          level={level}
                        />
                      </TextFieldComponent>
                    </div>
                  )}
                </Box>
              </Box>
            )
          })}

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
