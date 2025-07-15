import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { uploadKeyData, getKeyDataMeta, deleteKeyData, setActiveKeyData } from '../../redux/keyData'
import { RootState } from '@/client/redux'

export const KeyData = () => {
  const dispatch = useDispatch()
  const meta = useSelector((state: RootState) => state.keyData.meta)

  useEffect(() => {
    dispatch(getKeyDataMeta())
  }, [dispatch])

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      dispatch(deleteKeyData(id))
    }
  }

  const handleSetActive = (id: number) => {
    dispatch(setActiveKeyData(id))
  }

  return (
    <div>
      <form
        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const form = e.currentTarget as HTMLFormElement
          const file = form.elements.namedItem('file') as HTMLInputElement
          dispatch(uploadKeyData(file.files?.[0]))
        }}
      >
        <input type="file" name="file" />
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
                .map((item: { id: number, createdAt: string, active: boolean }) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{new Date(item.createdAt).toLocaleString()}</td>
                    <td>
                      <input
                        type="radio"
                        name="activeKeyData"
                        checked={item.active}
                        onChange={() => handleSetActive(item.id)}
                      />
                    </td>
                    <td>
                      <button
                        onClick={() => handleDelete(item.id)}
                        type="button"
                      >
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
