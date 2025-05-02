import { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Typography } from '@mui/material'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import ActionsCell from '../Generic/ActionsCellComponent'
import TrafficLightCell from '../Generic/TrafficLightCellComponent'
import KeyDataModal, { type selectedKeyFigureData } from '../Overview/KeyDataModalComponent'

const ProgrammeKeyDataTableComponent = ({
  programmeData,
  metadata,
}: {
  programmeData: KeyDataProgramme[]
  metadata: KeyDataMetadata[]
}) => {
  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)

  const handleModalOpen = (programme: KeyDataProgramme, type: GroupKey) => {
    setModalOpen(true)
    setSelecteKeyFigureData({
      programme,
      metadata,
      type,
    })
  }

  useEffect(() => {
    if (!modalOpen) {
      setSelecteKeyFigureData(null)
    }
  }, [modalOpen])

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
                <TableCell hoverEffect style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                  <Link
                    to={`/v1/programmes/10/${programmeData.koulutusohjelmakoodi}/${programmeData.year}`}
                    style={{ width: '100%' }}
                  >
                    <Typography variant="h5">{programmeData.year}</Typography>
                  </Link>
                </TableCell>

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.VETOVOIMAISUUS}
                  handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.LAPIVIRTAUS}
                  handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.OPISKELIJAPALAUTE}
                  handleModalOpen={handleModalOpen}
                />

                <TrafficLightCell
                  metadata={metadata}
                  programmeData={programmeData}
                  groupKey={GroupKey.RESURSSIT}
                  handleModalOpen={handleModalOpen}
                />

                <ActionsCell programmeData={programmeData} metadata={metadata} />
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

      <KeyDataModal open={modalOpen} setOpen={setModalOpen} data={selectedKeyFigureData} />
    </div>
  )
}

export default ProgrammeKeyDataTableComponent
