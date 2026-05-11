import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'

import { CircularProgress, Tooltip, Typography } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'

import { GroupKey } from '@/client/lib/enums'
import { KeyDataProgramme } from '@/shared/lib/types'
import ActionsCell from '../Generic/ActionsCellComponent'
import QualityCell from '../Generic/QualityCellComponent'
import TrafficLightCell from '../Generic/TrafficLightCellComponent'
import SearchInput from '../Generic/SearchInputComponent'
import { Table, TableHead, TableBody, TableRow, TableCell } from '../Generic/TableComponent'
import KeyDataModal, { type selectedKeyFigureData } from './KeyDataModalComponent'
import { orderBy } from 'lodash'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'
import { useAppSelector } from '@/client/util/hooks'
import { useGetAllDocumentsQuery } from '@/client/redux/documents'
import { useGetReportsQuery } from '@/client/redux/reports'
import { useFetchAllKeyDataQuery } from '@/client/redux/keyData'
import { useGetActiveInterventionProceduresQuery } from '@/client/redux/interventionProcedures'
import { InterventionProcedureType } from '@/client/lib/types'
import DiscontinuedProgramFilter from '../Generic/DiscontinuedFilterComponent'
import { colors } from '@/client/util/common'

interface KeyDataTableProps {
  facultyFilter: string[]
  programmeLevelFilter: string
  yearFilter: string
  showDiscontinued: boolean
}

const ProgrammeInfoCell = ({ programmeData }: { programmeData: KeyDataProgramme }) => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const { additionalInfo, koulutusohjelma, koulutusohjelmakoodi } = programmeData
  const color = additionalInfo.fi === 'Lakkautettu ohjelma' ? 'secondary' : ''
  const hasAdditionalInfo = Boolean(additionalInfo[lang])
  const backRoundColor = programmeData?.additionalInfo?.fi?.includes('Lakkautettu') ? colors.background_gray : ''

  return (
    <TableCell
      data-cy={`keydatatable-programme-${programmeData.koulutusohjelmakoodi}`}
      hoverEffect
      itemAlign="left"
      style={{ backgroundColor: backRoundColor }}
    >
      <Link style={{ width: '100%' }} to={`/v1/programmes/10/${koulutusohjelmakoodi}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Typography color={color} variant="regular">
              {koulutusohjelma[lang]}{' '}
              {hasAdditionalInfo ? (
                <Tooltip arrow placement="top" title={<div>{additionalInfo[lang]}</div>}>
                  <span style={{ display: 'inline-flex', alignItems: 'center' }}>
                    <InfoOutlinedIcon
                      color="secondary"
                      fontSize="small"
                      sx={{
                        verticalAlign: 'middle',
                      }}
                    />
                  </span>
                </Tooltip>
              ) : null}
            </Typography>
          </div>
          <Typography color={color} variant="regular">
            {koulutusohjelmakoodi}
          </Typography>
        </div>
      </Link>
    </TableCell>
  )
}

const InterventionCell = ({
  programmeData,
  selectedYear,
  interventionProcedures,
  activeYear,
  metadata,
  t,
}: {
  programmeData: KeyDataProgramme
  selectedYear: string
  interventionProcedures: InterventionProcedureType[]
  activeYear: any
  metadata: any
  t: any
}) => {
  const { data: documents = [] } = useGetAllDocumentsQuery({ activeYear })
  const { renderInterventionBadge } = useNotificationBadge()
  const interventionData = renderInterventionBadge(
    programmeData,
    metadata,
    selectedYear,
    documents,
    interventionProcedures
  )

  if (!interventionData.interventionStatus || programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
    return (
      <Typography color="secondary" data-cy={`interventionText-${programmeData.koulutusohjelmakoodi}`} variant="italic">
        {t('keyData:interventionOff')}
      </Typography>
    )
  } else if (interventionData.interventionStatus) {
    return (
      <>
        <Typography data-cy={`interventionText-${programmeData.koulutusohjelmakoodi}`} variant="regularSmall">
          {t('keyData:interventionOn')}
        </Typography>
        {interventionData.showBadge ? (
          <NotificationBadge
            data-cy={`interventionBadge-${programmeData.koulutusohjelmakoodi}`}
            tooltip={t('keyData:interventionMissing')}
            variant="small"
          />
        ) : null}
      </>
    )
  }
  return null
}

const KeyDataTableComponent = ({
  facultyFilter = [],
  programmeLevelFilter = '',
  yearFilter,
  showDiscontinued = true,
}: KeyDataTableProps) => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const { t } = useTranslation()
  const activeYear = useAppSelector(state => state.filters.keyDataYear)

  const [searchValue, setSearchValue] = useState<string>('')
  const [sortIdentity, setSortIdentity] = useState<'koulutusohjelma' | 'koulutusohjelmakoodi'>('koulutusohjelma')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)
  const { data: reports = {} } = useGetReportsQuery({ year: activeYear })
  const { data: interventionProcedures = [] } = useGetActiveInterventionProceduresQuery()

  const { data: allKeyData } = useFetchAllKeyDataQuery()
  const selectedYear = Number.parseInt(yearFilter, 10)
  const yearMatches = allKeyData?.filter(keyData => keyData.year === selectedYear) ?? []
  const selectedKeyDataRow = yearMatches.find(keyData => keyData.active) ?? yearMatches[0]
  const keyData = selectedKeyDataRow?.data

  const metadata = useMemo(() => {
    return keyData ? keyData.metadata : []
  }, [keyData])

  const programmeData = useMemo(() => {
    if (keyData) {
      const { kandiohjelmat, maisteriohjelmat } = keyData
      return [...kandiohjelmat, ...maisteriohjelmat]
    }
    return []
  }, [keyData])

  const keyFigureData = useMemo(() => {
    // Convert to set for faster lookup
    const allowedFacultiesSet = new Set(facultyFilter)

    // Filter by faculty, year and program level
    const filteredData = programmeData.filter((programmeData: KeyDataProgramme) => {
      // This filter assumes that kouluohjelmakoodi is in the format <Level><FacultyCode>_xxx
      // example: KH10_001, where K is the level, H10 is the faculty code

      const facultyCode = programmeData.koulutusohjelmakoodi.substring(1, 4)

      const yearMatches = programmeData.year === parseInt(yearFilter) - 1 // Always fetch previous year results
      const facultyMatches = allowedFacultiesSet.has(facultyCode) || allowedFacultiesSet.has('allFaculties')
      const levelMatches = programmeData.level === programmeLevelFilter || programmeLevelFilter === 'allProgrammes'
      const isDiscontinued = programmeData.additionalInfo.fi?.includes('Lakkautettu')
      return yearMatches && facultyMatches && levelMatches && (showDiscontinued ? true : !isDiscontinued)
    })

    // Sort by programme name or code
    const sortCallback = (item: KeyDataProgramme) =>
      sortIdentity === 'koulutusohjelma' ? item.koulutusohjelma[lang] : item.koulutusohjelmakoodi
    const sortedData = orderBy(filteredData, item => sortCallback(item), [sortDirection])

    // Filter by search input
    const searchedData = sortedData.filter((programmeData: KeyDataProgramme) => {
      return (
        programmeData.koulutusohjelma[lang]?.toLowerCase().includes(searchValue.toLowerCase()) ||
        programmeData.koulutusohjelmakoodi.toLowerCase().includes(searchValue.toLowerCase())
      )
    })

    return searchedData
  }, [
    facultyFilter,
    programmeLevelFilter,
    yearFilter,
    showDiscontinued,
    programmeData,
    searchValue,
    sortIdentity,
    sortDirection,
    lang,
  ])

  const sortByProgrammeName = () => {
    if (sortIdentity !== 'koulutusohjelma') {
      setSortDirection('asc')
      setSortIdentity('koulutusohjelma')
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
  }

  const sortByProgrammeCode = () => {
    if (sortIdentity !== 'koulutusohjelmakoodi') {
      setSortDirection('asc')
      setSortIdentity('koulutusohjelmakoodi')
    } else {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    }
  }

  const handleModalOpen = (programme: KeyDataProgramme, type: GroupKey) => {
    setModalOpen(true)
    setSelecteKeyFigureData({
      programme,
      metadata,
      type,
    })
  }

  useEffect(() => {
    if (!modalOpen) {
      setSelecteKeyFigureData(null)
    }
  }, [modalOpen])

  if (!keyData) {
    return <CircularProgress />
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{
          margin: '3rem 1rem 1rem 1rem',
          alignItems: 'center',
          flexDirection: 'row',
          display: 'flex',
          gap: '2rem',
        }}
      >
        <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
        <DiscontinuedProgramFilter />
      </div>
      <div style={{ width: '100%', overflowX: 'auto', padding: '1rem' }}>
        <div style={{ minWidth: 1750 }}>
          <Table variant="overview">
            <TableHead>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                    <Typography
                      onClick={sortByProgrammeName}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      variant="h6"
                    >
                      {t('common:programmeHeader')} <SwapVertIcon />
                    </Typography>
                    <Typography
                      onClick={sortByProgrammeCode}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                      variant="h6"
                    >
                      {t('common:code')} <SwapVertIcon />
                    </Typography>
                  </div>
                </TableCell>
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:vetovoimaisuus')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:lapivirtaus')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:opiskelijapalaute')}</Typography>
                </TableCell>
                {activeYear < 2026 ? (
                  <TableCell disabled isHeader>
                    <Tooltip arrow placement="top" title={<div>{t('keyData:notUsed2025')}</div>}>
                      <Typography variant="regularSmall">{t('keyData:resurssit')}</Typography>
                    </Tooltip>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Typography variant="regularSmall">{t('keyData:resurssit')}</Typography>
                  </TableCell>
                )}
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:actions')}</Typography>
                </TableCell>
                {activeYear < 2026 ? (
                  <TableCell disabled isHeader>
                    <Tooltip arrow placement="top" title={<div>{t('keyData:notUsed2025')}</div>}>
                      <Typography variant="regularSmall">{t('keyData:qualityControl')}</Typography>
                    </Tooltip>
                  </TableCell>
                ) : (
                  <TableCell>
                    <Typography variant="regularSmall">
                      {t('keyData:qualityControl')}
                      <Tooltip
                        arrow
                        placement="right"
                        slotProps={{ popper: { sx: { '& .MuiTooltip-tooltip': { maxWidth: '700px' } } } }}
                        title={
                          <div>
                            {t('qualitydocument:info')} <br /> {t('qualitydocument:info2')}
                          </div>
                        }
                      >
                        <span style={{ display: 'inline-flex', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
                          <InfoOutlinedIcon
                            color="secondary"
                            fontSize="small"
                            sx={{
                              verticalAlign: 'middle',
                            }}
                          />
                        </span>
                      </Tooltip>
                    </Typography>
                  </TableCell>
                )}
                <TableCell isHeader>
                  <Typography variant="regularSmall">{t('keyData:supportProcess')}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {keyFigureData.length > 0 ? (
                keyFigureData.map((programmeData: KeyDataProgramme) => (
                  <TableRow key={programmeData.koulutusohjelmakoodi}>
                    <ProgrammeInfoCell programmeData={programmeData} />
                    <TrafficLightCell
                      activeYear={activeYear}
                      groupKey={GroupKey.VETOVOIMAISUUS}
                      handleModalOpen={handleModalOpen}
                      metadata={metadata}
                      programmeData={programmeData}
                      reports={reports}
                    />

                    <TrafficLightCell
                      activeYear={activeYear}
                      groupKey={GroupKey.LAPIVIRTAUS}
                      handleModalOpen={handleModalOpen}
                      metadata={metadata}
                      programmeData={programmeData}
                      reports={reports}
                    />

                    <TrafficLightCell
                      activeYear={activeYear}
                      groupKey={GroupKey.OPISKELIJAPALAUTE}
                      handleModalOpen={handleModalOpen}
                      metadata={metadata}
                      programmeData={programmeData}
                      reports={reports}
                    />
                    {activeYear < 2026 ? (
                      <TableCell disabled></TableCell>
                    ) : (
                      <TrafficLightCell
                        activeYear={activeYear}
                        groupKey={GroupKey.RESURSSIT}
                        handleModalOpen={handleModalOpen}
                        metadata={metadata}
                        programmeData={programmeData}
                        reports={reports}
                      />
                    )}

                    <ActionsCell metadata={metadata} programmeData={programmeData} reports={reports} />
                    {activeYear < 2026 ? (
                      <TableCell disabled></TableCell>
                    ) : (
                      <QualityCell programmeData={programmeData} />
                    )}
                    <TableCell
                      style={{
                        backgroundColor: programmeData?.additionalInfo?.fi?.includes('Lakkautettu')
                          ? colors.background_gray
                          : '',
                      }}
                    >
                      <InterventionCell
                        activeYear={activeYear}
                        interventionProcedures={interventionProcedures}
                        metadata={metadata}
                        programmeData={programmeData}
                        selectedYear={yearFilter}
                        t={t}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow variant="single-cell">
                  <TableCell>
                    <Typography variant="light">{t('common:noData')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {selectedKeyFigureData ? (
            <KeyDataModal data={selectedKeyFigureData} open={modalOpen} setOpen={setModalOpen} />
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default KeyDataTableComponent
