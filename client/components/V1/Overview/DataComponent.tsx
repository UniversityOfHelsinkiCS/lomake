import { useState } from 'react'
import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import SearchInput from '../Generic/SearchInputComponent'
import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import { KeyDataProgramme } from '@/client/lib/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
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

  if (!keyData) {
    return <CircularProgress />
  }

  const { kandiohjelmat, maisteriohjelmat } = keyData.data
  let programmeData: KeyDataProgramme[] = [...kandiohjelmat, ...maisteriohjelmat]

  // Convert to set for faster lookup
  const allowedFacultiesSet = new Set(facultyFilter)

  // Default sort by koulutusohjelma (ascending alphabetic order)
  const sortedData = _.sortBy(programmeData, ['koulutusohjelma'])

  // Filter by faculty, year and program level
  const filteredData = sortedData.filter((programmeData: KeyDataProgramme) => {
    // This filter assumes that kouluohjelmakoodi is in the format <Level><FacultyCode>_xxx
    // example: KH10_001, where K is the level, H10 is the faculty code

    const code = programmeData.koulutusohjelmakoodi

    let programmeLevelCode = ''
    switch (code.charAt(0)) {
      case 'K':
        programmeLevelCode = 'bachelor'
        break
      case 'M':
        programmeLevelCode = 'master'
        break
      case 'D':
        programmeLevelCode = 'doctoral'
        break
      case 'I':
        programmeLevelCode = 'international'
        break
      default:
        programmeLevelCode = ''
    }

    const facultyCode = code.substring(1, 4)

    const facultyMatches = allowedFacultiesSet.has(facultyCode) || allowedFacultiesSet.has('allFaculties')
    const levelMatches = programmeLevelCode === programmeLevelFilter || programmeLevelFilter === 'allProgrammes'

    return facultyMatches && levelMatches
  })

  // Filter by search input
  const searchFilteredData = filteredData.filter((programmeData: KeyDataProgramme) => {
    return (
      programmeData.koulutusohjelma.toLowerCase().includes(searchValue.toLowerCase()) ||
      programmeData.koulutusohjelmakoodi.toLowerCase().includes(searchValue.toLowerCase())
    )
  })

  return (
    <div style={{ minWidth: 1200 }}>
      <div style={{ marginBottom: '1rem', marginTop: '4rem' }}>
        <SearchInput placeholder={t('common:programmeFilter')} setSearchValue={setSearchValue} />
      </div>

      <Table>
        <TableRow isHeader>
          <TableCell>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
              <span>{t('common:programmeHeader')}</span>
              <span style={{ paddingRight: '20px' }}>{t('common:code')}</span>
            </div>
          </TableCell>
          <TableCell>{t('keyData:vetovoima')}</TableCell>
          <TableCell>{t('keyData:lapivirtaus')}</TableCell>
          <TableCell>{t('keyData:palaute')}</TableCell>
          <TableCell>{t('keyData:actions')}</TableCell>
          <TableCell>{t('keyData:resurssit')}</TableCell>
          <TableCell disabled>{t('keyData:qualityControl')}</TableCell>
          <TableCell>{t('keyData:supportProcess')}</TableCell>
        </TableRow>

        {searchFilteredData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell itemAlign="left">
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>{programmeData.koulutusohjelma}</Link>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>
                  {programmeData.koulutusohjelmakoodi}
                </Link>
              </div>
            </TableCell>
            <TableCell>
              <TrafficLight color={programmeData.vetovoimaisuus}></TrafficLight>
            </TableCell>
            <TableCell>
              <TrafficLight color={programmeData.lapivirtaus}></TrafficLight>
            </TableCell>
            <TableCell>
              <TrafficLight color={programmeData.opiskelijapalaute}></TrafficLight>
            </TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
export default KeyFigureTableComponent
