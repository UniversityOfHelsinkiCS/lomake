import { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Typography } from '@mui/material'

import { GroupKey, ProgrammeLevel } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import ActionsCell from '../Generic/ActionsCellComponent'
import TrafficLightCell from '../Generic/TrafficLightCellComponent'
import KeyDataModal, { type selectedKeyFigureData } from '../Overview/KeyDataModalComponent'
import { AppDispatch } from '@/client/util/store'
import { setKeyDataYear } from '@/client/util/redux/filterReducer'

const ProgrammeKeyDataTableComponent = ({
  programmeData,
  metadata,
}: {
  programmeData: KeyDataProgramme[]
  metadata: KeyDataMetadata[]
}) => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
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

  const annualFollowUpYear = (programmeDataYear: number) => {
    /*
      Simple solution for syncing data to the follow-up year.
      Data is always collected from the previous year relative to the annual follow-up year.
    */
    return (programmeDataYear + 1)
  }

  const getNextFollowUpYear = () => {
    const years = programmeData.map(data => data.year)
    return (annualFollowUpYear(Math.max(...years)) + 1).toString()
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

        {programmeData.length > 0 ? (
          <TableBody>
            {programmeData.map((programmeData: KeyDataProgramme, index) => (
              <TableRow key={programmeData.koulutusohjelmakoodi + index}>
                <TableCell style={{ borderRadius: '0.5rem 0 0 0.5rem' }}>
                  <Link
                    to={`/v1/programmes/10/${programmeData.koulutusohjelmakoodi}/${annualFollowUpYear(programmeData.year)}`}
                    style={{ width: '100%', textAlign: 'left' }}
                    onClick={() => dispatch(setKeyDataYear(annualFollowUpYear(programmeData.year)))}
                  >
                    <Typography variant="h5">{annualFollowUpYear(programmeData.year)}</Typography>
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
            ))}
            <TableRow>
              <TableCell>
                { /* @ts-expect-error */}
                <Link aria-disabled style={{ width: '100%', textAlign: 'left' }}>
                  <Typography variant="h5" color="secondary">
                    {getNextFollowUpYear()}
                  </Typography>
                </Link>
              </TableCell>
              <TableCell disabled />
              <TableCell disabled />
              <TableCell disabled />
              <TableCell disabled />
              <TableCell disabled />
            </TableRow>
          </TableBody>
        ) : (
          <TableBody>
            <TableRow variant="single-cell">
              <TableCell>
                <Typography variant="light">{t('common:noData')}</Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>

      <KeyDataModal open={modalOpen} setOpen={setModalOpen} data={selectedKeyFigureData} />
    </div >
  )
}

export default ProgrammeKeyDataTableComponent
