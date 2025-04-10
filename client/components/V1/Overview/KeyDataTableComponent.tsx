import { useState, useMemo, useEffect } from 'react'
import useFetchKeyData from '@/client/hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CircularProgress, Tooltip, Typography, Button } from '@mui/material'
import SwapVertIcon from '@mui/icons-material/SwapVert'
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import { RootState } from '@/client/util/store'

import SearchInput from '../Generic/SearchInputComponent'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import KeyDataModal, { type selectedKeyFigureData } from './KeyDataModalComponent'
import { getReport } from '@/client/util/redux/reportsSlicer'
import Modal from '../Generic/ModalTemplateComponent'
import { TextFieldCard } from '../Generic/TextFieldComponent'
import { orderBy } from 'lodash'
import { useNotificationBadge } from '@/client/hooks/useNotificationBadge'
import NotificationBadge from '../Generic/NotificationBadge'
import { setViewOnly } from '@/client/util/redux/formReducer'
import { calculateKeyDataColor } from '../Utils/util'

interface KeyDataTableProps {
  facultyFilter: string[]
  programmeLevelFilter: string
  yearFilter: string
}

const ProgrammeInfoCell = ({ programmeData }: { programmeData: KeyDataProgramme }) => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
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

const ActionsCell = ({ programmeData, metadata }: { programmeData: KeyDataProgramme; metadata: KeyDataMetadata[] }) => {
  const { renderActionsBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const year = useSelector((state: RootState) => state.filters.keyDataYear)
  const [open, setOpen] = useState(false)
  const dispatch = useDispatch()

  const actionsBadgeData = renderActionsBadge(programmeData, metadata, true)

  const handleOpen = () => {
    dispatch(setViewOnly(true))
    dispatch(getReport({ studyprogrammeKey: programmeData.koulutusohjelmakoodi, year }))
    return setOpen(true)
  }

  return (
    <>
      {actionsBadgeData.showBadge && (
        <NotificationBadge data-cy={`actionsCellBadge`} variant="medium" tooltip={t('keyData:missingMeasure')} />
      )}
      {actionsBadgeData.showIcon && (
        <Button onClick={handleOpen}>
          <ChatBubbleOutlineIcon sx={{ fontSize: '28px' }} color="secondary" />
        </Button>
      )}
      <Modal open={open} setOpen={setOpen}>
        <Typography variant="h3">
          {programmeData.koulutusohjelma[lang]} {year}
        </Typography>
        <TextFieldCard id={'Toimenpiteet'} t={t} type={'Measure'}></TextFieldCard>
      </Modal>
    </>
  )
}

const TrafficLightCell = ({
  metadata,
  programmeData,
  groupKey,
  handleModalOpen,
}: {
  metadata: KeyDataMetadata[]
  programmeData: KeyDataProgramme
  groupKey: GroupKey
  handleModalOpen: (programme: KeyDataProgramme, type: GroupKey) => void
}) => {
  const { renderTrafficLightBadge } = useNotificationBadge()
  const { t } = useTranslation()
  const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
  const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
  const shouldRenderBadge = groupKey !== GroupKey.RESURSSIT && renderTrafficLightBadge(programmeData, groupKey, color)

  return (
    <TableCell onClick={() => handleModalOpen(programmeData, groupKey)} data-cy={`trafficlight-table-cell-${programmeData.koulutusohjelmakoodi}-${groupKey}`}>
      <TrafficLight color={color} variant="medium" />
      {shouldRenderBadge && (
        <NotificationBadge data-cy={`lightCellBadge-${groupKey}`} tooltip={t('keyData:missingComment')} />
      )}
    </TableCell>
  )
}

const KeyDataTableComponent = ({ facultyFilter = [], programmeLevelFilter = '', yearFilter }: KeyDataTableProps) => {
  const lang = useSelector((state: RootState) => state.language) as 'fi' | 'en' | 'se'
  const keyData = useFetchKeyData()
  const { t } = useTranslation()

  const [searchValue, setSearchValue] = useState<string>('')
  const [sortIdentity, setSortIdentity] = useState<'koulutusohjelma' | 'koulutusohjelmakoodi'>('koulutusohjelma')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)

  const metadata = useMemo(() => {
    return keyData?.data ? keyData.data.metadata : []
  }, [keyData])

  const programmeData = useMemo(() => {
    if (keyData) {
      const { kandiohjelmat, maisteriohjelmat } = keyData.data
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

  return (
    <div style={{ width: '100%' }}>
      {/* Search input */}
      <div style={{ margin: '3rem 1rem 1rem 1rem' }}>
        <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
      </div>

      {/* Key Figure Data Table */}
      <div style={{ width: '100%', overflowX: 'auto', padding: '1rem' }}>
        <div style={{ minWidth: 1750 }}>
          {/* Table Header */}
          <Table>
            <TableRow isHeader>
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

              <TableCell disabled>
                <Tooltip title={t('keyData:notUsed2025')} placement="top" arrow>
                  <Typography variant="regularSmall">{t('keyData:qualityControl')}</Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Typography variant="regularSmall">{t('keyData:supportProcess')}</Typography>
              </TableCell>
            </TableRow>

            {/* Table Body */}
            {keyFigureData.length > 0 ? (
              keyFigureData.map((programmeData: KeyDataProgramme) => (
                <TableRow key={programmeData.koulutusohjelmakoodi}>
                  <ProgrammeInfoCell programmeData={programmeData} />
                  <TrafficLightCell
                    metadata={metadata}
                    programmeData={programmeData}
                    groupKey={GroupKey.VETOVOIMAISUUS}
                    handleModalOpen={handleModalOpen}
                  />

                  <TrafficLightCell
                    metadata={metadata}
                    programmeData={programmeData}
                    groupKey={GroupKey.LAPIVIRTAUS}
                    handleModalOpen={handleModalOpen}
                  />

                  <TrafficLightCell
                    metadata={metadata}
                    programmeData={programmeData}
                    groupKey={GroupKey.OPISKELIJAPALAUTE}
                    handleModalOpen={handleModalOpen}
                  />

                  <TrafficLightCell
                    metadata={metadata}
                    programmeData={programmeData}
                    groupKey={GroupKey.RESURSSIT}
                    handleModalOpen={handleModalOpen}
                  />
                  <TableCell>
                    <ActionsCell programmeData={programmeData} metadata={metadata} />
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '5rem' }}>
                  <Typography variant="body1">{t('common:noData')}</Typography>
                </div>
              </TableRow>
            )}
          </Table>

          {/* Key Figure Data Modal */}
          <KeyDataModal open={modalOpen} setOpen={setModalOpen} data={selectedKeyFigureData} />
        </div>
      </div>
    </div>
  )
}
export default KeyDataTableComponent
