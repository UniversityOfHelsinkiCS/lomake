import useFetchKeyData from '../../hooks/useFetchKeyData'
import DataComponent from './DataComponent'

import TextFieldComponent from './Generic/TextFieldComponent'

const Page = () => {
  const keyData = useFetchKeyData()

  return (
    <div>
      <h1>Page</h1>
      <p>{JSON.stringify(keyData)}</p>

      <br />
      <div>
        <h1>Testattava teksikenttä</h1>
        <TextFieldComponent />
        
      </div>
      <DataComponent />
    </div>
  )
}

export default Page