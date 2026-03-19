/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-floating-promises */
import {
  useUploadKeyDataMutation,
  useGetKeyDataMetaQuery,
  useDeleteKeyDataMutation,
  useSetActiveKeyDataMutation,
} from '../../redux/keyData'

export const KeyData = () => {
  const [uploadKeyData] = useUploadKeyDataMutation()
  const [setActiveKeyData] = useSetActiveKeyDataMutation()
  const [deleteKeyData] = useDeleteKeyDataMutation()
  const { data: meta } = useGetKeyDataMetaQuery()

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteKeyData(id)
    }
  }

  const handleSetActive = (id: number) => {
    setActiveKeyData(id)
  }

  return (
    <div>
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
        <div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Time when uploaded</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {meta
                .slice()
                .sort((a: any, b: any) => a.id - b.id)
                .map((item: { id: number; createdAt: string; active: boolean }) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      <input
                        checked={item.active}
                        name="activeKeyData"
                        onChange={() => handleSetActive(item.id)}
                        type="radio"
                      />
                    </td>
                    <td>
                      <button onClick={() => handleDelete(item.id)} type="button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available</p>
      )}
    </div>
  )
}

export default KeyData
