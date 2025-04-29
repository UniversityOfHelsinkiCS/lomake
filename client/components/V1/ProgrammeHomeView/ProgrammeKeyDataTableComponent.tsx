import { Table, TableRow, TableHead, TableBody, TableCell, TableConfig } from '../Generic/TableComponent'
import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

const programmeKeyDataTableComponent = () => {
  const { t } = useTranslation()

  const tableConfig: TableConfig = {
    columns: ['160px', '1fr', '1fr', '1fr', '1fr', '1fr'],
    body: {
      firstColumnStyle: {
        boxed: false,
      },
    },
  }

  return (
    <Table config={tableConfig}>
      <TableHead>
        <TableRow>
          <TableCell />
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
        </TableRow>
      </TableHead>

      <TableBody>
        <TableRow>
          <TableCell itemAlign="left">2000</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

export default programmeKeyDataTableComponent
