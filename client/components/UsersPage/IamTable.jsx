import { Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material'
import uniq from 'lodash/uniq'
import { colors } from '../../util/common'
import { doctoralIams, doctoralWritingIams, superAdminGroups, adminGroups } from '../../../config/IAMConfig'

const IamTable = () => {
  const getTableRow = (iamGroup, accessGroup, workPosition, keyProp) => {
    return (
      <TableRow key={keyProp}>
        <TableCell>{iamGroup}</TableCell>
        <TableCell>{accessGroup}</TableCell>
        <TableCell>{workPosition}</TableCell>
      </TableRow>
    )
  }

  const getRowsForAccessGroup = (iamGroups, accessGroup, workPosition) => {
    return (
      <>
        {iamGroups.map((iamGroup, idx) =>
          getTableRow(iamGroup, accessGroup, workPosition, `${accessGroup}-${iamGroup}-${idx}`)
        )}
      </>
    )
  }

  return (
    <Table
      sx={{
        tableLayout: 'fixed',
        width: '100%',
        '& .MuiTableCell-root': {
          borderRight: 1,
          borderColor: 'divider',
        },
        '& .MuiTableCell-root:last-of-type': {
          borderRight: 0,
        },
      }}
    >
      <TableHead>
        <TableCell sx={{ backgroundColor: colors.background_gray, fontWeight: 700 }}>IAM-ryhmä</TableCell>
        <TableCell sx={{ backgroundColor: colors.background_gray, fontWeight: 700 }}>
          Mitä oikeuksia sillä saa?
        </TableCell>
        <TableCell sx={{ backgroundColor: colors.background_gray, fontWeight: 700 }}>Keitä ryhmään kuuluu?</TableCell>
      </TableHead>
      <TableBody>
        {getRowsForAccessGroup(superAdminGroups, 'Super-admin-oikeudet', 'Toska-ryhmä')}
        {getRowsForAccessGroup(adminGroups, 'Admin-oikeudet', 'Ospa-ryhmä')}
        {getRowsForAccessGroup(
          ['hy-kopa-koulutusasiantuntijat'],
          'Kirjoitusoikeudet kaikkiin ohjelmiin',
          'Koulutustasiantuntijat'
        )}
        {getRowsForAccessGroup(
          ['hy-kopa-koulutuspaallikot'],
          'Kirjoitusoikeudet kaikkiin ohjelmiin',
          'Koulutuspäälliköt'
        )}
        {getRowsForAccessGroup(['hy-ypa-kopa-johtoryhma'], 'Kirjoitusoikeudet kaikkiin ohjelmiin', 'Johtoryhmä')}
        {getRowsForAccessGroup(
          uniq([
            'hy-[tiedekunta]-maisteri/kandi-kojot',
            'hy-[tiedekunta]-dekanaatti',
            'hy-rehtoraatti',
            'hy-ypa-toimi-helsinki',
            'hy-ypa-opa-oymp-jory',
            'grp-a01807-svenskaarenden',
            'grp-koordinaatioryhma',
          ]),
          'Lukuoikeudet kaikkiin ohjelmiin: uusi vuosiseuranta + archive',
          'Dekanaatit, rehtoraatti, koulutusohjelmien johtajat, toiminnanohjausyksikkö, oppimisympäristöjen palvelut ja katselmustyöryhmä'
        )}
        {getRowsForAccessGroup(
          ['hy-[tiedekunta]-students'],
          'Lukuoikeudet kaikkiin ohjelmiin: uusi vuosiseuranta',
          'Tutkinto-opiskelijat'
        )}
        {getRowsForAccessGroup(
          ['hy-employees'],
          'Lukuoikeudet kaikkiin ohjelmiin: uusi vuosiseuranta',
          'Helsingin yliopiston työntekijä'
        )}
        {getRowsForAccessGroup(
          doctoralWritingIams,
          'Kirjoitusoikeudet kaikkiin tohtoriohjelmiin',
          'Tohtoriohjelmien suunnittelijat'
        )}
        {getRowsForAccessGroup(
          doctoralIams,
          'Lukuoikeudet kaikkiin tohtoriohjelmiin',
          'Tohtoriohjelmien johtajat ja tieteellinen neuvosto'
        )}
        {getRowsForAccessGroup([], 'Lukuoikeudet kyseiseen tutkijakouluun', 'Tutkijakoulun johtoryhmä')}
        {getRowsForAccessGroup(
          ['hy-[tiedekunta]-[koulutusohjelma]-jory & hy-[tiedekunta]-maisteri/kandi-kojot & hy-employees'],
          'Admin-oikeudet kyseiseen koulutusohjelmaan',
          'Koulutusohjelmien johtajat'
        )}
        {getRowsForAccessGroup(
          ['hy-[tiedekunta]-[koulutusohjelma]-jory'],
          'Kirjoitusoikeudet kyseiseen koulutusohjelmaan',
          'Koulutusohjelman johtoryhmän työsuhteessa olevat jäsenet'
        )}
      </TableBody>
    </Table>
  )
}

export default IamTable
