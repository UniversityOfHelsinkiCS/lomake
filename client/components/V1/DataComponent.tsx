import { CircularProgress } from '@mui/material'
import useFetchKeyData from '../../hooks/useFetchKeyData'

interface CustomCardProps {
  type: string
  data: any
}

const CustomCard = ({ type, data }: CustomCardProps) => {
  if (type === 'metadata') return null
  return (
    <div className="custom-card">
      <h3>{type}</h3>
      <div className="custom-card-content">
        {Object.entries(data).map(([key, value]) => (
          <p key={key}>
            <strong>{key}:</strong> {JSON.stringify(value)}
          </p>
        ))}
      </div>
    </div>
  )
}

const DataComponent = () => {
  const keyData = useFetchKeyData()

  if (!keyData || keyData.length === 0 || !keyData[0].data) return <CircularProgress />

  const { metadata, ...dataMap } = keyData[0].data

  return (
    <div>
      <ul>
        {Object.keys(dataMap).map((key: string) => (
          <>
            {dataMap[key].map((value: any, index: number) => (
              <div key={index}>
                <CustomCard type={key} data={value} />
              </div>
            ))}
            <br />
          </>
        ))}
      </ul>
    </div>
  )
}

export default DataComponent
