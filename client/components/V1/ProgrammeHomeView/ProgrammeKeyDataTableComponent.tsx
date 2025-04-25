import { Table, TableRow, TableCell } from '../Generic/TableComponent'
import { Typography, Tooltip } from '@mui/material'
import { useTranslation } from 'react-i18next'

const programmeKeyDataTableComponent = () => {
  const { t } = useTranslation()

  return (
    <Table>
      <TableRow isHeader>
        <TableCell></TableCell>
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

      <TableRow>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
    </Table>
  )
}

export default programmeKeyDataTableComponent
