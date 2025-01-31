// import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { ProgrammeLevel } from '../enums'
import { TrafficLight } from '../Generic/TrafficLightComponent'
import React, { useMemo } from 'react'

const TableCell = ({ children, isKey = false }: { children?: React.ReactNode, isKey?: boolean }) => {
  return (
    <div style={{
      margin: !isKey && "0 auto",
      textAlign: isKey ? "left" : "center",
    }}>{children}</div>
  )
}

const TableRow = ({ children, isHeader = false }: { children: React.ReactNode, isHeader?: boolean }) => {
  return (
    <div style={{
      display: "grid",
      gridTemplateRows: "1fr",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 1fr", // TODO: Make this dynamic
      boxShadow: isHeader ? "none" : "0px 1px 3px rgba(0,0,0,0.3)",
      borderRadius: "0.5rem"
    }}>
      {React.Children.map(children, (child, index) => (
        <div style={{
          borderRight: index < React.Children.count(children) - 1 && !isHeader ? '1px solid rgba(0,0,0,0.2)' : 'none',
          display: "flex",
          placeItems: "center",
          padding: "1.5rem",
        }}>
          {child}
        </div>
      ))}
    </div>
  )
}

const Table = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem", width: "100%" }}>{children}</div>
  )
}

const DataComponent = ({ programLevel, faculty, year}: {programLevel: string | null, faculty: string | null, year: number | null}) => {
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
          <TableCell>Programme</TableCell>
          <TableCell>Attractiveness</TableCell>
          <TableCell>Throughput and Graduation</TableCell>
          <TableCell>Student Feedback and Employment</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
          <TableCell>Placeholder</TableCell>
        </TableRow>

        {programmeData.map((programmeData: KeyDataProgramme) => (
          <TableRow key={programmeData.koulutusohjelmakoodi}>
            <TableCell isKey={true}>
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
