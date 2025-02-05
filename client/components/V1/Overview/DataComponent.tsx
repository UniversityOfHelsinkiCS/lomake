// import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { ProgrammeLevel } from '../enums'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import { useMemo } from 'react'

import { Table, TableRow, TableCell } from '../Generic/TableComponent'


const DataComponent = ({ programLevel, faculty, year }: { programLevel: string | null, faculty: string | null, year: number | null }) => {
  const fetchedKeyData = useFetchKeyData()
  const keyData = useMemo(() => fetchedKeyData, [fetchedKeyData])

  if (!keyData) {
    return <CircularProgress />
  }

  const { kandiohjelmat, maisteriohjelmat } = keyData.data
  let programmeData: KeyDataProgramme[] = [...kandiohjelmat, ...maisteriohjelmat]

  // TODO: Add filtering by faculty and year
  programmeData = programmeData.filter((programmeData: KeyDataProgramme) => {
    if (programLevel === ProgrammeLevel.KANDI) {
      return programmeData.ohjelmataso === ProgrammeLevel.KANDI
    } else if (programLevel === ProgrammeLevel.MAISTERI) {
      return programmeData.ohjelmataso === ProgrammeLevel.MAISTERI
    } else {
      return true
    }
  });

  return (
    <>
      <Table>
        <TableRow isHeader>
          <TableCell></TableCell>
          <TableCell>Attractiveness</TableCell>
          <TableCell>Throughput and Graduation</TableCell>
          <TableCell>Student Feedback and Employment</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
        </TableRow>

        {programmeData.map((programmeData: KeyDataProgramme) => (
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
            <TableCell>Placeholder</TableCell>
            <TableCell>Placeholder</TableCell>
            <TableCell>Placeholder</TableCell>
          </TableRow>
        ))}
      </Table>
    </>
  )
}
export default DataComponent
