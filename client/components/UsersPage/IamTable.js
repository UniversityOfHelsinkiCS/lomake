import React from 'react'
import { Table } from '@mui/material'
import * as _ from 'lodash'
import {
  doctoralIams,
  doctoralWritingIams,
  doctoralSchoolMap,
  isUniversityWideWritingGroups,
  superAdminGroups,
  adminGroups,
} from '../../../config/IAMConfig'

const IamTable = () => {
  const getTableRow = (iamGroup, accessGroup, workPosition) => {
    return (
      <Table.Row>
        <Table.Cell>{iamGroup}</Table.Cell>
        <Table.Cell>{accessGroup}</Table.Cell>
        <Table.Cell>{workPosition}</Table.Cell>
      </Table.Row>
    )
  }

  const getRowsForAccessGroup = (iamGroups, accessGroup, workPosition) => {
    return <>{iamGroups.map(iamGroup => getTableRow(iamGroup, accessGroup, workPosition))}</>
  }

  return (
    <>
      <Table compact>
        <Table.Typography>
          <Table.HeaderCell>IAM-ryhmä</Table.HeaderCell>
          <Table.HeaderCell>Mitä oikeuksia sillä saa?</Table.HeaderCell>
          <Table.HeaderCell>Keitä ryhmään kuuluu?</Table.HeaderCell>
        </Table.Typography>
        <Table.Body>
          {getRowsForAccessGroup(superAdminGroups, 'Super-admin-oikeudet', 'Toska-ryhmä')}
          {getRowsForAccessGroup(adminGroups, 'Admin-oikeudet', 'Ospa-ryhmä')}
          {getRowsForAccessGroup(
            isUniversityWideWritingGroups,
            'Kirjoitusoikeudet kaikkiin ohjelmiin',
            'Koulutussuunnittelijat ja opintoasiainpäälliköt'
          )}
          {getRowsForAccessGroup(
            _.uniq([
              'hy-[tiedekunta]-maisteri/kandi-kojot',
              'hy-[tiedekunta]-dekanaatti',
              'hy-rehtoraatti',
              'hy-ypa-toimi-helsinki',
              'hy-ypa-opa-oymp-jory',
              'grp-katselmus-projektiryhma/ohjausryhmä',
            ]),
            'Lukuoikeudet kaikkiin ohjelmiin',
            'Dekanaatit, rehtoraatti, koulutusohjelmien johtajat, toiminnanohjausyksikkö, oppimisympäristöjen palvelut ja katselmustyöryhmä'
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
          {getRowsForAccessGroup(
            Object.keys(doctoralSchoolMap),
            'Lukuoikeudet kyseiseen tutkijakouluun',
            'Tutkijakoulun johtoryhmä'
          )}
          {getRowsForAccessGroup(
            ['hy-[tiedekunta]-[koulutusohjelma]-jory & hy-[tiedekunta]-maisteri/kandi-kojot & hy-employees'],
            'Admin-oikeudet kyseiseen koulutusohjelmaan',
            'Koulutusohjelmien johtajat'
          )}
          {getRowsForAccessGroup(
            ['hy-[tiedekunta]-[koulutusohjelma]-jory & hy-employees'],
            'Kirjoitusoikeudet kyseiseen koulutusohjelmaan',
            'Koulutusohjelman johtoryhmän työsuhteessa olevat jäsenet'
          )}
          {getRowsForAccessGroup(
            ['hy-[tiedekunta]-[koulutusohjelma]-jory'],
            'Lukuoikeudet kyseiseen koulutusohjelmaan',
            'Koulutusohjelman johtoryhmän opiskelijajäsenet'
          )}
        </Table.Body>
      </Table>
    </>
  )
}

export default IamTable
