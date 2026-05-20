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
} from '../../redux/keyData'
import { Box, Typography } from '@mui/material'

const tableStyle: React.CSSProperties = { borderCollapse: 'collapse', width: '100%' }
const cellStyle: React.CSSProperties = { border: '1px solid #ccc', padding: '8px' }
const headerCellStyle: React.CSSProperties = { ...cellStyle, textAlign: 'left' }

export const KeyData = () => {
  const [uploadKeyData] = useUploadKeyDataMutation()
  const [setActiveKeyData] = useSetActiveKeyDataMutation()
  const [deleteKeyData] = useDeleteKeyDataMutation()
  const { data: meta } = useGetKeyDataMetaQuery({})
  const [lockKeyData] = useLockKeyDataMutation()

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

  const handleLock = (id: number, year: number) => {
    if (window.confirm(`Are you sure you want to lock this key data for year ${year}?`)) {
      lockKeyData({ id, year })
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
            When a dataset is locked, the active intervention procedures are saved to the database and the dataset can
            no longer be deleted through the UI. Only one dataset may be locked per year. This ensures that historical
            data for previous years remains unchanged.
          </Typography>
        </Box>
      ) : (
        <Typography>No data available</Typography>
      )}
    </Box>
  )
}

export default KeyData
