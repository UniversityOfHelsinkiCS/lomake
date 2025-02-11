import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { TrafficLight } from '../Generic/TrafficLightComponent'

import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import { KeyDataProgramme } from '@/client/lib/types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

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

  if (!keyData) {
    return <CircularProgress />
  }

  const { kandiohjelmat, maisteriohjelmat } = keyData.data
  let programmeData: KeyDataProgramme[] = [...kandiohjelmat, ...maisteriohjelmat]

  // Convert to set for faster lookup
  const allowedFacultiesSet = new Set(facultyFilter)

  const filteredData = programmeData.filter((programmeData: KeyDataProgramme) => {
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

  return (
    <div>
      <Table>
        <TableRow isHeader>
          <TableCell></TableCell>
          <TableCell>{t('keyData:vetovoima')}</TableCell>
          <TableCell>{t('keyData:lapivirtaus')}</TableCell>
          <TableCell>{t('keyData:palaute')}</TableCell>
          <TableCell>{t('keyData:resurssit')}</TableCell>
          <TableCell disabled>{t('keyData:qualityControl')}</TableCell>
          <TableCell>{t('keyData:actions')}</TableCell>
        </TableRow>

        {filteredData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell itemAlign="left">
              <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>{programmeData.koulutusohjelma}</Link>
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
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
export default KeyFigureTableComponent
