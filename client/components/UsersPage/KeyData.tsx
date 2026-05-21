/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  useUploadKeyDataMutation,
  useGetKeyDataMetaQuery,
  useDeleteKeyDataMutation,
  useSetActiveKeyDataMutation,
  useLockKeyDataMutation,
  useFetchAllKeyDataQuery,
} from '../../redux/keyData'
import { Box, Typography } from '@mui/material'
import { calculateInterventionAreas } from '../V1/Generic/InterventionProcedure'
import { useTranslation } from 'react-i18next'
import {
  useGetInterventionProceduresQuery,
  useCreateInterventionProcedureMutation,
  useUpdateInterventionProcedureMutation,
} from '../../redux/interventionProcedures'
import { useState, useEffect } from 'react'

const tableStyle: React.CSSProperties = { borderCollapse: 'collapse', width: '100%' }
const cellStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '8px' }
const headerCellStyle: React.CSSProperties = { ...cellStyle, textAlign: 'left' }

export const KeyData = () => {
  const [uploadKeyData] = useUploadKeyDataMutation()
  const [setActiveKeyData] = useSetActiveKeyDataMutation()
  const [deleteKeyData] = useDeleteKeyDataMutation()
  const { data: meta } = useGetKeyDataMetaQuery({})
  const [lockKeyData] = useLockKeyDataMutation()
  const { data } = useFetchAllKeyDataQuery()
  const { t } = useTranslation()
  const { data: interventionProceduresData } = useGetInterventionProceduresQuery()
  const [interventionProcedures, setInterventionProcedures] = useState<any[]>(interventionProceduresData ?? [])
  useEffect(() => {
    if (interventionProceduresData) setInterventionProcedures(interventionProceduresData)
  }, [interventionProceduresData])

  const [createInterventionProcedure] = useCreateInterventionProcedureMutation()
  const [updateInterventionProcedure] = useUpdateInterventionProcedureMutation()

  const getActiveInterventionProcedures = (id: number): any[] => {
    const keyData = data?.find((d: any) => d.id === id) || data?.find((d: any) => d.data?.id === id)

    if (!keyData) {
      // eslint-disable-next-line no-console
      console.error('No entry found for key data id', id)
      return []
    }

    const payload = keyData.data ?? keyData

    const { kandiohjelmat = [], maisteriohjelmat = [], metadata = [] } = payload ?? {}
    const programmes = [...kandiohjelmat, ...maisteriohjelmat]

    const year = Number(keyData.year)

    const programmesWithIntervention: any[] = programmes
      .filter((programmeData: any) => {
        const redLights = calculateInterventionAreas({ metadata, programme: programmeData, t, selectedYear: year })
        return (
          redLights.length > 0 &&
          Number(programmeData?.year) === year - 1 &&
          !programmeData.additionalInfo.fi?.includes('Lakkautettu') &&
          !programmeData.additionalInfo?.fi?.includes('Uusi ohjelma')
        )
      })
      .map((programmeData: any) => {
        const redLights = calculateInterventionAreas({ metadata, programme: programmeData, t, selectedYear: year })
        return {
          koulutusohjelmakoodi: programmeData.koulutusohjelmakoodi,
          year: programmeData.year,
          redLights,
        }
      })

    return programmesWithIntervention
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        deleteKeyData(id)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error deleting key data: ${(error as Error).message}`)
      }
    }
  }

  const handleSetActive = (id: number) => {
    setActiveKeyData(id)
  }

  const saveNewInterventionProcedures = async (programmesWithIntervention: any[], year: number) => {
    for (const p of programmesWithIntervention) {
      const studyprogrammeKey = p.koulutusohjelmakoodi

      const existing = interventionProcedures.find((ip: any) => ip.studyprogrammeKey === studyprogrammeKey) || null

      if (!existing) {
        try {
          const result = await createInterventionProcedure({ studyprogrammeKey, year }).unwrap()
          setInterventionProcedures(prev => prev.concat(result))
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error creating intervention procedure', error)
        }

        continue
      }

      if (existing && existing.active === true) {
        const startYear = Number(existing.startYear)

        if (!isNaN(startYear) && startYear > year) {
          try {
            const result = await updateInterventionProcedure({ id: existing.id, startYear: year }).unwrap()
            setInterventionProcedures(prev => prev.map((ip: any) => (ip.id === result.id ? result : ip)))
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error updating intervention procedure', error)
          }

          continue
        }
      }

      if (existing && existing.active === false) {
        const startYear = Number(existing.startYear)
        const endYear = Number(existing.endYear)

        if (!isNaN(endYear) && endYear > year) {
          continue
        }

        if (!isNaN(startYear) && startYear >= year) {
          continue
        }

        if (!isNaN(startYear) && startYear < year && !isNaN(endYear) && endYear === year) {
          const ok = window.confirm(
            `Ohjelmalla ${studyprogrammeKey} on alkanut toimenpidemenettely vuonna ${startYear} ja se on merkitty päättyneeksi vuonna ${endYear}. 
            Jos ohjelmalla on alkanut edellisen menettelyn sulkemisen jälkeen vielä samana vuonna uusi toimenpidemenettely, 
            vie aktiivinen menettely tietokantaan valitsemalla ok.`
          )
          if (ok) {
            try {
              const result = await createInterventionProcedure({ studyprogrammeKey, year }).unwrap()
              setInterventionProcedures(prev => prev.concat(result))
            } catch (error) {
              // eslint-disable-next-line no-console
              console.error('Error creating intervention procedure', error)
            }
          }

          continue
        }

        if (!isNaN(startYear) && !isNaN(endYear) && startYear < year && endYear < year) {
          try {
            const result = await createInterventionProcedure({ studyprogrammeKey, year }).unwrap()
            setInterventionProcedures(prev => prev.concat(result))
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error creating intervention procedure', error)
          }

          continue
        }

        continue
      }
    }
  }

  const handleLock = async (id: number, year: number) => {
    if (window.confirm(`Are you sure you want to lock this key data for year ${year}?`)) {
      try {
        await lockKeyData({ id, year })
        const programmesWithIntervention = getActiveInterventionProcedures(id)
        await saveNewInterventionProcedures(programmesWithIntervention, year)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error locking key data: ${(error as Error).message}`)
      }
    }
  }

  return (
    <Box sx={{ border: '1px solid #ccc', display: 'flex', flexDirection: 'column', gap: 2, margin: 2, padding: 2 }}>
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const file = form.elements.namedItem('file') as HTMLInputElement
          uploadKeyData(file.files?.[0])
        }}
      >
        <input name="file" type="file" />
        <button type="submit">Upload</button>
      </form>
      {meta && meta.length > 0 ? (
        <Box>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headerCellStyle}>ID</th>
                <th style={headerCellStyle}>Time when uploaded</th>
                <th style={headerCellStyle}>Active</th>
                <th style={headerCellStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meta
                .slice()
                .sort((a: any, b: any) => a.id - b.id)
                .map((item: { id: number; createdAt: string; active: boolean; year: number; locked: boolean }) => (
                  <tr key={item.id}>
                    <td style={cellStyle}>{item.id}</td>
                    <td style={cellStyle}>{new Date(item.createdAt).toLocaleString()}</td>
                    <td style={cellStyle}>
                      <input
                        checked={item.active}
                        name="activeKeyData"
                        onChange={() => handleSetActive(item.id)}
                        type="radio"
                      />
                    </td>
                    {!item.locked ? (
                      <td style={{ ...cellStyle, display: 'flex', gap: 8 }}>
                        <button onClick={() => handleDelete(item.id)} type="button">
                          Delete
                        </button>

                        <form
                          onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault()
                            handleLock(item.id, item.year)
                          }}
                        >
                          <button type="submit">Lock for year {item.year}</button>
                        </form>
                      </td>
                    ) : (
                      <td style={cellStyle}>Locked for year {item.year}</td>
                    )}
                  </tr>
                ))}
            </tbody>
          </table>
          <br />
          <Typography>
            When a dataset is locked, the active intervention procedures for that year are saved to the database, and
            the dataset can no longer be deleted through the UI. Only one dataset may be locked per year. This ensures
            that historical data for previous years remains unchanged.
          </Typography>
        </Box>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  )
}

export default KeyData
