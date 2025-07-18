import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { CircularProgress, Tooltip, Typography } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'

import { GroupKey } from '@/client/lib/enums'
import { KeyDataProgramme } from '@/shared/lib/types'

import ActionsCell from '../Generic/ActionsCellComponent'
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
import { useFetchKeyDataQuery } from '@/client/redux/keyData'

interface KeyDataTableProps {
  facultyFilter: string[]
  programmeLevelFilter: string
  yearFilter: string
}

const ProgrammeInfoCell = ({ programmeData }: { programmeData: KeyDataProgramme }) => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const { additionalInfo, koulutusohjelma, koulutusohjelmakoodi } = programmeData
  const color = additionalInfo.fi === 'Lakkautettu ohjelma' ? 'secondary' : ''

  return (
    <TableCell itemAlign="left" hoverEffect data-cy={`keydatatable-programme-${programmeData.koulutusohjelmakoodi}`}>
      <Link to={`/v1/programmes/10/${koulutusohjelmakoodi}`} style={{ width: '100%' }}>
        <Tooltip title={additionalInfo[lang]} placement="top" arrow>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
            <Typography variant="regular" color={color}>
              {koulutusohjelma[lang]}
            </Typography>
            <Typography variant="regular" color={color}>
              {koulutusohjelmakoodi}
            </Typography>
          </div>
        </Tooltip>
      </Link>
    </TableCell>
  )
}

const KeyDataTableComponent = ({ facultyFilter = [], programmeLevelFilter = '', yearFilter }: KeyDataTableProps) => {
  const lang = useAppSelector(state => state.language) as 'fi' | 'en' | 'se'
  const { data: keyData } = useFetchKeyDataQuery()
  const { t } = useTranslation()
  const activeYear = useAppSelector(state => state.filters.keyDataYear)
  const { data: documents = [] } = useGetAllDocumentsQuery({ activeYear })
  const { renderInterventionBadge } = useNotificationBadge()
  const [searchValue, setSearchValue] = useState<string>('')
  const [sortIdentity, setSortIdentity] = useState<'koulutusohjelma' | 'koulutusohjelmakoodi'>('koulutusohjelma')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)
  const { data: reports = {} } = useGetReportsQuery({ year: activeYear })

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
      return yearMatches && facultyMatches && levelMatches
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
  }, [facultyFilter, programmeLevelFilter, yearFilter, programmeData, searchValue, sortIdentity, sortDirection, lang])

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

  const InterventionCell = ({
    programmeData,
    selectedYear,
  }: {
    programmeData: KeyDataProgramme
    selectedYear: string
  }) => {
    const interventionData = renderInterventionBadge(programmeData, metadata, selectedYear, documents)

    if (!interventionData.interventionStatus || programmeData.additionalInfo?.fi?.includes('Lakkautettu')) {
      return (
        <Typography variant="italic" color="secondary">
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
              variant="small"
              data-cy={`interventionBadge-${programmeData.koulutusohjelmakoodi}`}
              tooltip={t('keyData:interventionMissing')}
            />
          ) : (
            <></>
          )}
        </>
      )
    }
  }

  return (
    <div style={{ width: '100%' }}>
      {/* Search input */}
      <div style={{ margin: '3rem 1rem 1rem 1rem' }}>
        <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
      </div>

      {/* Key Figure Data Table */}
      <div style={{ width: '100%', overflowX: 'auto', padding: '1rem' }}>
        <div style={{ minWidth: 1750 }}>
          <Table variant="overview">
            <TableHead>
              <TableRow>
                <TableCell>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                    <Typography
                      variant="h6"
                      onClick={sortByProgrammeName}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                    >
                      {t('common:programmeHeader')} <SwapVertIcon />
                    </Typography>
                    <Typography
                      variant="h6"
                      onClick={sortByProgrammeCode}
                      style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
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
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:resurssit')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="regularSmall">{t('keyData:actions')}</Typography>
                </TableCell>

                <TableCell disabled isHeader>
                  <Tooltip title={t('keyData:notUsed2025')} placement="top" arrow>
                    <Typography variant="regularSmall">{t('keyData:qualityControl')}</Typography>
                  </Tooltip>
                </TableCell>
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
                      metadata={metadata}
                      programmeData={programmeData}
                      groupKey={GroupKey.VETOVOIMAISUUS}
                      handleModalOpen={handleModalOpen}
                      reports={reports}
                    />

                    <TrafficLightCell
                      metadata={metadata}
                      programmeData={programmeData}
                      groupKey={GroupKey.LAPIVIRTAUS}
                      handleModalOpen={handleModalOpen}
                      reports={reports}
                    />

                    <TrafficLightCell
                      metadata={metadata}
                      programmeData={programmeData}
                      groupKey={GroupKey.OPISKELIJAPALAUTE}
                      handleModalOpen={handleModalOpen}
                      reports={reports}
                    />

                    <TrafficLightCell
                      metadata={metadata}
                      programmeData={programmeData}
                      groupKey={GroupKey.RESURSSIT}
                      handleModalOpen={handleModalOpen}
                      reports={reports}
                    />

                    <ActionsCell programmeData={programmeData} metadata={metadata} reports={reports} />
                    <TableCell disabled></TableCell>
                    <TableCell>
                      <InterventionCell programmeData={programmeData} selectedYear={yearFilter} />
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

          <KeyDataModal open={modalOpen} setOpen={setModalOpen} data={selectedKeyFigureData} />
        </div>
      </div>
    </div>
  )
}
export default KeyDataTableComponent
