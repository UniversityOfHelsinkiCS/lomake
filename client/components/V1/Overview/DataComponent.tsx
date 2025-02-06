import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import type { KeyDataProgramme } from '../lib/types'

import { Table, TableRow, TableCell } from '../Generic/TableComponent'

interface KeyDataTableProps {
  facultyFilter: string[],
  programmeLevelFilter: string,
  yearFilter: string
}

const KeyFigureTableComponent = ({
  facultyFilter = [],
  programmeLevelFilter = "",
  yearFilter = ""
}: KeyDataTableProps) => {


  const keyData = useFetchKeyData()

  if (!keyData) {
    return <CircularProgress />
  }

  const { kandiohjelmat, maisteriohjelmat } = keyData.data
  let programmeData: KeyDataProgramme[] = [...kandiohjelmat, ...maisteriohjelmat]


  // Convert to set for faster lookup
  const allowedFacultiesSet = new Set(facultyFilter);

  const filteredData = programmeData.filter((programmeData: KeyDataProgramme) => {
    // This filter assumes that kouluohjelmakoodi is in the format <Level><FacultyCode>_xxx
    // example: KH10_001, where K is the level, H10 is the faculty code

    const code = programmeData.koulutusohjelmakoodi;

    let programmeLevelCode = "";
    switch (code.charAt(0)) {
      case "K":
        programmeLevelCode = "bachelor";
        break;
      case "M":
        programmeLevelCode = "master";
        break;
      case "D":
        programmeLevelCode = "doctoral";
        break;
      case "I":
        programmeLevelCode = "international";
        break;
      default:
        programmeLevelCode = "";
    }

    const facultyCode = code.substring(1, 4);

    const facultyMatches = allowedFacultiesSet.has(facultyCode) || allowedFacultiesSet.has("allFaculties");
    const levelMatches = programmeLevelCode === programmeLevelFilter || programmeLevelFilter === "allProgrammes";

    return facultyMatches && levelMatches;
  });


  return (
    <div>
      <Table>
        <TableRow isHeader>
          <TableCell></TableCell>
          <TableCell>Attractiveness</TableCell>
          <TableCell>Throughput and Graduation</TableCell>
          <TableCell>Student Feedback and Employment</TableCell>
          <TableCell>Toimenpiteet</TableCell>
          <TableCell disabled>Laadunhallinnan välineet</TableCell>
          <TableCell>Tukiprosessi</TableCell>
        </TableRow>

        {filteredData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell itemAlign='left'>
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
