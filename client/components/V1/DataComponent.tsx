import useFetchKeyData from '../../hooks/useFetchKeyData'

interface CustomCardProps {
  type: string
  data: any
}

const CustomCard = ({ type, data }: CustomCardProps) => {
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

  if (!keyData || keyData === 0 || !keyData[0].data) return <div>Loading...</div>

  const dataMap = keyData[0].data

  return (
    <div>
      <ul>
        {Object.keys(dataMap).map((key: string) => (
          <>
            <li key={key}>
              <h2>{key}</h2>
              {dataMap[key].map((value: any, index: number) => (
                <div key={index}>
                  <CustomCard type={key} data={value} />
                </div>
              ))}
            </li>
            <br />
          </>
        ))}
      </ul>
    </div>
  )
}

export default DataComponent
