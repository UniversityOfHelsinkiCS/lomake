import DataComponent from './DataComponent'

import TextFieldComponent from './Generic/TextFieldComponent'

const Page = () => {
  return (
    <div>
      <h1>Page</h1>
      <br />
      <div>
        <h1>Testattava teksikenttä</h1>
        <TextFieldComponent />
        
      </div>

      <br />
      <br />
      <DataComponent />
      <DataComponent />
    </div>
  )
}

export default Page