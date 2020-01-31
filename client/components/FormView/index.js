import React from 'react'
import { useSelector } from 'react-redux'
import Form from 'Components/FormView/Form'
import ProgrammeSelect from 'Components/FormView/ProgrammeSelect'
import lyyti_image from 'Assets/lyyti.jpg'

const FormView = () => {

  const room = useSelector(({ room }) => room)
  return (
    <div className="the-form">
      <img className="img-responsive" src={lyyti_image} />
      <div className="intro">
        <h1>DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME</h1>
        <p>Please discuss the topics below in the steering group of the degree programme. The questions are intended to spark discussion, and the purpose is not to answer them as such.</p>
        <p>Please provide an overall assessment of the programme’s current status (“Where are we now?”) with regard to each topic using the following system of traffic lights:</p>
        <p><span style={{ background: 'lightgreen' }}>GREEN:</span> No issues</p>
        <p><span style={{ background: 'yellow' }}>YELLOW:</span> Challenges identified and development underway</p>
        <p><span style={{ background: 'red' }}>RED:</span> Significant measures required/development areas not yet specified</p>
        <p>Please enter a brief description of the main points of discussion for each topic in the space provided.</p>
      </div>
      <ProgrammeSelect />
      {room &&
        <Form />}
    </div>
  )
}

export default FormView
