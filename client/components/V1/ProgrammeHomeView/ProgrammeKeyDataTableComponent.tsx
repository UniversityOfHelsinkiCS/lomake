import { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { Typography } from '@mui/material'
import { isAdmin } from '@/config/common'
import { GroupKey } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import ActionsCell from '../Generic/ActionsCellComponent'
import TrafficLightCell from '../Generic/TrafficLightCellComponent'
import KeyDataModal, { type selectedKeyFigureData } from '../Overview/KeyDataModalComponent'
import { AppDispatch } from '@/client/redux'
import { setKeyDataYear } from '@/client/redux/filterReducer'
import { useGetReportsQuery } from '@/client/redux/reports'
import { useAppSelector } from '@/client/util/hooks'

const ProgrammeKeyDataTableComponent = ({
  programmeData,
  metadata,
  metadata2025,
}: {
  programmeData: KeyDataProgramme[]
  metadata: KeyDataMetadata[]
  metadata2025: KeyDataMetadata[]
}) => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)
  const user = useAppSelector(state => state.currentUser.data)

  const handleModalOpen = (programme: KeyDataProgramme, type: GroupKey) => {
    setModalOpen(true)
    setSelecteKeyFigureData({
      programme,
      metadata: programme.year + 1 === 2025 && metadata2025.length > 0 ? metadata2025 : metadata,
      type,
    })
  }

  useEffect(() => {
    if (!modalOpen) {
      setSelecteKeyFigureData(null)
    }
  }, [modalOpen])

  const annualFollowUpYear = (programmeDataYear: number) => {
    // this function is defined to communicate to you that the
    // follow-up year is the next year from the data year
    return programmeDataYear + 1
  }

  return (
    <div style={{ minWidth: 1200, marginTop: 20 }}>
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
            {programmeData.map((programmeData: KeyDataProgramme, index) => {
              if (annualFollowUpYear(programmeData.year) === 2026 && !isAdmin(user)) {
                return null
              }
              const selectedMetadata =
                annualFollowUpYear(programmeData.year) === 2025 && metadata2025.length > 0 ? metadata2025 : metadata
              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { data: reports = {} } = useGetReportsQuery({
                year: annualFollowUpYear(programmeData.year).toString(),
              })
              return (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={programmeData.koulutusohjelmakoodi + index}>
                  <TableCell
                    data-cy={`keydatatable-programme-${programmeData.koulutusohjelmakoodi}-${programmeData.year}`}
                    style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
                  >
                    <Link
                      onClick={() => dispatch(setKeyDataYear(annualFollowUpYear(programmeData.year)))}
                      style={{ width: '100%', textAlign: 'left' }}
                      to={`/v1/programmes/10/${programmeData.koulutusohjelmakoodi}/${annualFollowUpYear(programmeData.year)}`}
                    >
                      <Typography variant="h5">{annualFollowUpYear(programmeData.year)}</Typography>
                    </Link>
                  </TableCell>

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(programmeData.year)}
                    groupKey={GroupKey.VETOVOIMAISUUS}
                    handleModalOpen={handleModalOpen}
                    metadata={selectedMetadata}
                    programmeData={programmeData}
                    reports={reports}
                  />

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(programmeData.year)}
                    groupKey={GroupKey.LAPIVIRTAUS}
                    handleModalOpen={handleModalOpen}
                    metadata={selectedMetadata}
                    programmeData={programmeData}
                    reports={reports}
                  />

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(programmeData.year)}
                    groupKey={GroupKey.OPISKELIJAPALAUTE}
                    handleModalOpen={handleModalOpen}
                    metadata={selectedMetadata}
                    programmeData={programmeData}
                    reports={reports}
                  />
                  {programmeData.year < 2026 && !isAdmin(user) ? (
                    <TableCell disabled></TableCell>
                  ) : (
                    <TrafficLightCell
                      activeYear={annualFollowUpYear(programmeData.year)}
                      groupKey={GroupKey.RESURSSIT}
                      handleModalOpen={handleModalOpen}
                      metadata={selectedMetadata}
                      programmeData={programmeData}
                      reports={reports}
                    />
                  )}

                  <ActionsCell metadata={metadata} programmeData={programmeData} reports={reports} />
                </TableRow>
              )
            })}
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

      <KeyDataModal data={selectedKeyFigureData} open={modalOpen} setOpen={setModalOpen} />
    </div>
  )
}

export default ProgrammeKeyDataTableComponent
