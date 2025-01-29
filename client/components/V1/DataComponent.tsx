import { CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material'
import useFetchKeyData, {
  KeyDataKandiohjelmat,
  KeyDataMaisteriohjelmat,
  KeyDataMetadata,
} from '../../hooks/useFetchKeyData'

enum KandiOrMaisteri {
  KANDI = 'kandi',
  MAISTERI = 'maisteri',
}

interface ProgrammeRowProps {
  type: KandiOrMaisteri
  data: KeyDataKandiohjelmat | KeyDataMaisteriohjelmat
  metaData: KeyDataMetadata[]
}

const ProgrammeRow = ({ type, data, metaData }: ProgrammeRowProps) => {
  return (
    <TableRow key={data.koulutusohjelma}>
      <TableCell>{data.koulutusohjelma}</TableCell>
      <TableCell>{data.vetovoimaisuus}</TableCell>
      <TableCell>{data.lapivirtaus}</TableCell>
      <TableCell>{data.opiskelijapalaute}</TableCell>
    </TableRow>
  )
}

const DataComponent = () => {
  const keyData = useFetchKeyData()

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
          {kandiohjelmat.map(kandiohjelma => (
            <ProgrammeRow
              key={kandiohjelma.koulutusohjelma}
              type={KandiOrMaisteri.KANDI}
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
          {maisteriohjelmat.map(maisteriohjelma => (
            <ProgrammeRow
              key={maisteriohjelma.koulutusohjelma}
              type={KandiOrMaisteri.MAISTERI}
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
