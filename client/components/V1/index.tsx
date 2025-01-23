import useFetchKeyData from '../../hooks/useFetchKeyData'

const Page = () => {
  const keyData = useFetchKeyData()

  return (
    <div>
      <h1>Page</h1>
      <p>{JSON.stringify(keyData)}</p>
    </div>
  )
}

export default Page