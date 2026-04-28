import { useState, useEffect } from 'react'
import { Table, TableRow, TableHead, TableBody, TableCell } from '../Generic/TableComponent'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { useDispatch } from 'react-redux'
import { Typography } from '@mui/material'
import { GroupKey } from '@/client/lib/enums'
import { KeyDataMetadata, KeyDataProgramme } from '@/shared/lib/types'
import ActionsCell from '../Generic/ActionsCellComponent'
import TrafficLightCell from '../Generic/TrafficLightCellComponent'
import KeyDataModal, { type selectedKeyFigureData } from '../Overview/KeyDataModalComponent'
import { AppDispatch } from '@/client/redux'
import { setKeyDataYear } from '@/client/redux/filterReducer'
import { useGetReportsQuery } from '@/client/redux/reports'
import { useFetchAllKeyData } from '@/client/redux/keyData'

const ProgrammeKeyDataTableComponent = ({
  programmeData,
  programmeKey,
}: {
  programmeData: KeyDataProgramme[]
  programmeKey: string
}) => {
  const { t } = useTranslation()
  const dispatch: AppDispatch = useDispatch()
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedKeyFigureData, setSelecteKeyFigureData] = useState<selectedKeyFigureData | null>(null)

  const { keyData } = useFetchAllKeyData({ studyprogrammeKey: programmeKey })

  const handleModalOpen = (programme: KeyDataProgramme, metadata: KeyDataMetadata[], type: GroupKey) => {
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
            {programmeData.map((programmeRow: KeyDataProgramme, index) => {
              const matchingKeyData = keyData.filter(item => item.year === annualFollowUpYear(programmeRow.year))
              const selectedKeyData = matchingKeyData.find(item => item.active) ?? matchingKeyData[0]
              const selectedProgrammeData =
                selectedKeyData?.programme.find(programme => programme.year === programmeRow.year) ?? programmeRow
              const selectedMetadata = selectedKeyData?.metadata ?? []

              // eslint-disable-next-line react-hooks/rules-of-hooks
              const { data: reports = {} } = useGetReportsQuery({
                year: annualFollowUpYear(selectedProgrammeData.year).toString(),
              })
              const filteredKeyData = Object.fromEntries(
                Object.entries(selectedProgrammeData.values).filter(([key]) => !key.startsWith('Lisätietoja'))
              )

              return (
                // eslint-disable-next-line react/no-array-index-key
                <TableRow key={selectedProgrammeData.koulutusohjelmakoodi + index}>
                  <TableCell
                    data-cy={`keydatatable-programme-${selectedProgrammeData.koulutusohjelmakoodi}-${selectedProgrammeData.year}`}
                    style={{ borderRadius: '0.5rem 0 0 0.5rem' }}
                  >
                    {Object.keys(filteredKeyData).length <= 3 ? (
                      <span
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          display: 'inline-block',
                          opacity: 0.5,
                          cursor: 'default',
                        }}
                      >
                        <Typography variant="h5">{annualFollowUpYear(selectedProgrammeData.year)}</Typography>
                      </span>
                    ) : (
                      <Link
                        onClick={() => dispatch(setKeyDataYear(annualFollowUpYear(selectedProgrammeData.year)))}
                        style={{ width: '100%', textAlign: 'left' }}
                        to={`/v1/programmes/10/${selectedProgrammeData.koulutusohjelmakoodi}/${annualFollowUpYear(selectedProgrammeData.year)}`}
                      >
                        <Typography variant="h5">{annualFollowUpYear(selectedProgrammeData.year)}</Typography>
                      </Link>
                    )}
                  </TableCell>

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(selectedProgrammeData.year)}
                    groupKey={GroupKey.VETOVOIMAISUUS}
                    handleModalOpen={(programme, type) => handleModalOpen(programme, selectedMetadata, type)}
                    metadata={selectedMetadata}
                    programmeData={selectedProgrammeData}
                    reports={reports}
                  />

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(selectedProgrammeData.year)}
                    groupKey={GroupKey.LAPIVIRTAUS}
                    handleModalOpen={(programme, type) => handleModalOpen(programme, selectedMetadata, type)}
                    metadata={selectedMetadata}
                    programmeData={selectedProgrammeData}
                    reports={reports}
                  />

                  <TrafficLightCell
                    activeYear={annualFollowUpYear(selectedProgrammeData.year)}
                    groupKey={GroupKey.OPISKELIJAPALAUTE}
                    handleModalOpen={(programme, type) => handleModalOpen(programme, selectedMetadata, type)}
                    metadata={selectedMetadata}
                    programmeData={selectedProgrammeData}
                    reports={reports}
                  />
                  <TrafficLightCell
                    activeYear={annualFollowUpYear(selectedProgrammeData.year)}
                    groupKey={GroupKey.RESURSSIT}
                    handleModalOpen={(programme, type) => handleModalOpen(programme, selectedMetadata, type)}
                    metadata={selectedMetadata}
                    programmeData={selectedProgrammeData}
                    reports={reports}
                  />

                  <ActionsCell metadata={selectedMetadata} programmeData={selectedProgrammeData} reports={reports} />
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

      {selectedKeyFigureData ? (
        <KeyDataModal data={selectedKeyFigureData} open={modalOpen} setOpen={setModalOpen} />
      ) : null}
    </div>
  )
}

export default ProgrammeKeyDataTableComponent
