import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'

import { TrafficLight } from '../Generic/TrafficLightComponent'
import { calculateKeyDataColor } from '../Utils/util'

const programmeKeyDataTableComponent = ({
  programmeData,
  metadata,
}: {
  programmeData: KeyDataProgramme[]
  metadata: KeyDataMetadata[]
}) => {
  const { t } = useTranslation()

  const TrafficLightCell = ({
    metadata,
    programmeData,
    groupKey,
  }: {
    metadata: KeyDataMetadata[]
    programmeData: KeyDataProgramme
    groupKey: GroupKey
  }) => {
    const level = programmeData.koulutusohjelmakoodi.startsWith('K') ? ProgrammeLevel.KANDI : ProgrammeLevel.MAISTERI
    const color = calculateKeyDataColor(metadata, programmeData, groupKey, level)
    return (
      <TableCell data-cy={`trafficlight-table-cell-${programmeData.koulutusohjelmakoodi}-${groupKey}`}>
        <TrafficLight color={color} variant="medium" />
      </TableCell>
    )
  }

  return (
    <div style={{ minWidth: 1200 }}>
      <Table variant="programme">
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
          {programmeData.length > 0 ? (
            programmeData.map((programmeData: KeyDataProgramme, index) => (
              <TableRow key={programmeData.koulutusohjelmakoodi + index}>
                <TableCell>{programmeData.year}</TableCell>
                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.VETOVOIMAISUUS}
                />

                <TrafficLightCell metadata={metadata} programmeData={programmeData} groupKey={GroupKey.LAPIVIRTAUS} />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.OPISKELIJAPALAUTE}
                />

                <TrafficLightCell metadata={metadata} programmeData={programmeData} groupKey={GroupKey.RESURSSIT} />

                {/* TODO: implement this when getReports is ready */}
                {/* <ActionsCell programmeData={programmeData} metadata={metadata} /> */}
                <TableCell></TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow variant="single-cell">
              <TableCell>
                <Typography variant="light">No Data</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default programmeKeyDataTableComponent
