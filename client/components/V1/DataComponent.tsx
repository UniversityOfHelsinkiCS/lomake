import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import useFetchKeyData from '../../hooks/useFetchKeyData'
import { Link } from 'react-router-dom'
import { TrafficLight } from './Generic/TrafficLightComponent'

import { ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataProgramme, KeyDataMetadata } from '@/client/lib/types'
import { useTranslation } from 'react-i18next'

interface ProgrammeRowProps {
  type: ProgrammeLevel
  data: KeyDataProgramme
  metaData: KeyDataMetadata[]
}

const ProgrammeRow = ({ type, data, metaData }: ProgrammeRowProps) => {
  const programmeId = data.koulutusohjelmakoodi

  return (
    <TableRow key={data.koulutusohjelmakoodi}>
      <TableCell>
        <Link to={`/v1/programmes/${programmeId}`}>{data.koulutusohjelma}</Link>
      </TableCell>
      <TableCell>
        <TrafficLight color={data.vetovoimaisuus}></TrafficLight>
      </TableCell>
      <TableCell>
        <TrafficLight color={data.lapivirtaus}></TrafficLight>
      </TableCell>
      <TableCell>
        <TrafficLight color={data.opiskelijapalaute}></TrafficLight>
      </TableCell>
    </TableRow>
  )
}

const DataComponent = () => {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const keyData = useFetchKeyData(lang)

  if (!keyData) {
    return <CircularProgress />
  }

  const { metadata, kandiohjelmat, maisteriohjelmat } = keyData.data

  return (
    <>
      <h2>Kandiohjelmat</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Koulutusohjelma</TableCell>
            <TableCell>Vetovoimaisuus</TableCell>
            <TableCell>Läpivirtaus ja Valmistuminen</TableCell>
            <TableCell>Opiskelijapalaute ja Työllistyminen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {kandiohjelmat.map((kandiohjelma: any) => (
            <ProgrammeRow
              key={kandiohjelma.koulutusohjelmakoodi}
              type={ProgrammeLevel.KANDI}
              data={kandiohjelma}
              metaData={metadata}
            />
          ))}
        </TableBody>
      </Table>

      <h2>Maisteriohjelmat</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Koulutusohjelma</TableCell>
            <TableCell>Vetovoimaisuus</TableCell>
            <TableCell>Läpivirtaus ja Valmistuminen</TableCell>
            <TableCell>Opiskelijapalaute ja Työllistyminen</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {maisteriohjelmat.map((maisteriohjelma: any) => (
            <ProgrammeRow
              key={maisteriohjelma.koulutusohjelmakoodi}
              type={ProgrammeLevel.MAISTERI}
              data={maisteriohjelma}
              metaData={metadata}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}
export default DataComponent
