import { useMemo, useState } from 'react'
import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import { useSelector } from 'react-redux'
import { RootState } from '@/client/util/store'
import _ from 'lodash'

import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import { KeyDataProgramme } from '@/client/lib/types'
import SearchInput from '../Generic/SearchInput'

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

  const lang = useSelector((state: RootState) => state.language)
  const fetchedKeyData = useFetchKeyData(lang)
  const keyData = useMemo(() => fetchedKeyData, [fetchedKeyData])
  const [searchValue, setSearchValue] = useState("")

  if (!keyData) {
    return <CircularProgress />
  }

  const { kandiohjelmat, maisteriohjelmat } = keyData.data
  let programmeData: KeyDataProgramme[] = [...kandiohjelmat, ...maisteriohjelmat]

  // Convert to set for faster lookup
  const allowedFacultiesSet = new Set(facultyFilter);

  // Default sort by koulutusohjelma (ascending alphabetic order)
  const sortedData = _.sortBy(programmeData, ['koulutusohjelma']);

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

    return facultyMatches && levelMatches;
  });

  // Filter by search input
  const searchFilteredData = filteredData.filter((programmeData: KeyDataProgramme) => {
    return programmeData.koulutusohjelma.toLowerCase().startsWith(searchValue.toLowerCase()) || programmeData.koulutusohjelmakoodi.toLowerCase().startsWith(searchValue.toLowerCase());
  })

  return (
    <div>
      <div style={{ marginBottom: "1rem", marginTop: "4rem" }}>
        <SearchInput
          placeholder="Hae koulutusohjelmaa nimellä tai koodilla"
          setSearchValue={setSearchValue} />
      </div>

      <Table>
        <TableRow isHeader>
          <TableCell>
            <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
              <span>Koulutusohjelma</span>
              <span style={{ paddingRight: "20px" }}>Koodi</span>
            </div>
          </TableCell>
          <TableCell>Attractiveness</TableCell>
          <TableCell>Throughput and Graduation</TableCell>
          <TableCell>Student Feedback and Employment</TableCell>
          <TableCell>Toimenpiteet</TableCell>
          <TableCell disabled>Laadunhallinnan välineet</TableCell>
          <TableCell>Tukiprosessi</TableCell>
        </TableRow>

        {searchFilteredData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell itemAlign='left'>
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%", gap: "1rem" }}>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>{programmeData.koulutusohjelma}</Link>
                <Link to={`/v1/programmes/${programmeData.koulutusohjelmakoodi}`}>{programmeData.koulutusohjelmakoodi}</Link>
              </ div>
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
