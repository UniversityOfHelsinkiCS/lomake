import { useState, useMemo, useEffect } from 'react'
import useFetchKeyData from '@/client/hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CircularProgress, Tooltip } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'

import { GroupKey } from '@/client/lib/enums'
import { KeyDataProgramme } from '@/client/lib/types'

import SearchInput from '../Generic/SearchInputComponent'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import KeyDataModal, { type selectedKeyFigureData } from './KeyDataModalComponent'

import _ from 'lodash'
interface KeyDataTableProps {
  facultyFilter: string[]
  programmeLevelFilter: string
  yearFilter: string
}

const KeyFigureTableComponent = ({
  facultyFilter = [],
  programmeLevelFilter = '',
  yearFilter = '',
}: KeyDataTableProps) => {
  const lang = useSelector((state: { language: string }) => state.language)
  const keyData = useFetchKeyData(lang)
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = useState<string>('')
  const [sortIdentity, setSortIdentity] = useState<'koulutusohjelma' | 'koulutusohjelmakoodi'>('koulutusohjelma')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)

  const programmeData = useMemo(() => {
    if (keyData) {
      const { kandiohjelmat, maisteriohjelmat } = keyData.data
      return [...kandiohjelmat, ...maisteriohjelmat]
    }
    return []
  }, [keyData])

  // Filter by faculty, year and program level
  const filteredData = useMemo(() => {
    // Convert to set for faster lookup
    const allowedFacultiesSet = new Set(facultyFilter)

    return programmeData.filter((programmeData: KeyDataProgramme) => {
      // This filter assumes that kouluohjelmakoodi is in the format <Level><FacultyCode>_xxx
      // example: KH10_001, where K is the level, H10 is the faculty code

      const facultyCode = programmeData.koulutusohjelmakoodi.substring(1, 4)

      const facultyMatches = allowedFacultiesSet.has(facultyCode) || allowedFacultiesSet.has('allFaculties')
      const levelMatches = programmeData.level === programmeLevelFilter || programmeLevelFilter === 'allProgrammes'

      return facultyMatches && levelMatches
    })
  }, [facultyFilter, programmeLevelFilter, programmeData])

  // Filter by search input
  const searchFilteredData = useMemo(
    () =>
      filteredData.filter((programmeData: KeyDataProgramme) => {
        return (
          programmeData.koulutusohjelma.toLowerCase().includes(searchValue.toLowerCase()) ||
          programmeData.koulutusohjelmakoodi.toLowerCase().includes(searchValue.toLowerCase())
        )
      }),
    [filteredData, searchValue],
  )

  // Default sort by koulutusohjelma (ascending alphabetic order)
  const sortedData = useMemo(() => {
    return _.orderBy(searchFilteredData, [sortIdentity], [sortDirection])
  }, [searchFilteredData, sortIdentity, sortDirection])

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
      metadata: keyData.data.metadata,
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
    <div style={{ minWidth: 1400 }}>
      {/* Search input */}
      <div style={{ marginBottom: '1rem', marginTop: '4rem' }}>
        <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
      </div>

      {/* Key Figure Data Table */}
      <Table>
        <TableRow isHeader>
          <TableCell>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
              <span onClick={sortByProgrammeName} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {t('common:programmeHeader')} <SwapVertIcon />
              </span>
              <span onClick={sortByProgrammeCode} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                {t('common:code')} <SwapVertIcon />
              </span>
            </div>
          </TableCell>
          <TableCell>{t('keyData:vetovoima')}</TableCell>
          <TableCell>{t('keyData:lapivirtaus')}</TableCell>
          <TableCell>{t('keyData:palaute')}</TableCell>
          <TableCell>{t('keyData:resurssit')}</TableCell>
          <TableCell>{t('keyData:actions')}</TableCell>
          <TableCell disabled>
            <Tooltip title={t('keyData:notUsed2025')} placement="top" arrow>
              <span>{t('keyData:qualityControl')}</span>
            </Tooltip>
          </TableCell>
          <TableCell>{t('keyData:supportProcess')}</TableCell>
        </TableRow>

        {sortedData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell itemAlign="left">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>{programmeData.koulutusohjelma}</Link>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>
                  {programmeData.koulutusohjelmakoodi}
                </Link>
              </div>
            </TableCell>
            <TableCell onClick={() => handleModalOpen(programmeData, GroupKey.VETOVOIMAISUUS)}>
              <TrafficLight color={programmeData.vetovoimaisuus} variant="medium"></TrafficLight>
            </TableCell>
            <TableCell onClick={() => handleModalOpen(programmeData, GroupKey.LAPIVIRTAUS)}>
              <TrafficLight color={programmeData.lapivirtaus} variant="medium"></TrafficLight>
            </TableCell>
            <TableCell onClick={() => handleModalOpen(programmeData, GroupKey.OPISKELIJAPALAUTE)}>
              <TrafficLight color={programmeData.opiskelijapalaute} variant="medium"></TrafficLight>
            </TableCell>
            <TableCell onClick={() => handleModalOpen(programmeData, GroupKey.RESURSSIT)}>
              <TrafficLight color={programmeData.resurssit} variant="medium"></TrafficLight>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </Table>

      {/* Key Figure Data Modal */}
      <KeyDataModal open={modalOpen} setOpen={setModalOpen} data={selectedKeyFigureData} />
    </div>
  )
}
export default KeyFigureTableComponent
