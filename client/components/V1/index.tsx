import useFetchKeyData from '../../hooks/useFetchKeyData'

import TextFieldComponent from './Generic/TextFieldComponent'

const Page = () => {
  const keyData = useFetchKeyData()

  const testJargon = "Testijargon"

  return (
    <div>
      <h1>Page</h1>
      <p>{JSON.stringify(keyData)}</p>

      <br />
      <div>
        <h1>Testattava teksikenttä</h1>
        <TextFieldComponent />
      </div>
    </div>
  )
}

export default Page