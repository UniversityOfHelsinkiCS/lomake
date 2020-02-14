import React from 'react'
import { useSelector } from 'react-redux'
import Form from 'Components/FormView/Form'
import ProgrammeSelect from 'Components/FormView/ProgrammeSelect'
import lyyti_image from 'Assets/lyyti.jpg'
import positiveEmoji from 'Assets/sunglasses.png'
import neutralEmoji from 'Assets/neutral.png'
import negativeEmoji from 'Assets/persevering.png'

const FormView = () => {
  const room = useSelector(({ room }) => room)
  return (
    <div className="the-form">
      <img className="img-responsive" src={lyyti_image} />
      <div className="intro">
        <h1>DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME</h1>
        <p>
          Please discuss the topics below in the steering group of the degree programme. The
          questions are intended to spark discussion, and the purpose is not to answer them as such.
        </p>
        <p>
          Please provide an overall assessment of the programme’s current status (“Where are we
          now?”) with regard to each topic using the following system of emoji:
        </p>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={positiveEmoji} style={{ width: '50px', height: 'auto', marginRight: '5px' }} />{' '}
          No issues
        </div>
        <div style={{ display: 'flex', alignItems: 'center', margin: '5px 0' }}>
          <img src={neutralEmoji} style={{ width: '50px', height: 'auto', marginRight: '5px' }} />{' '}
          Challenges identified and development underway
        </div>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.5em' }}>
          <img src={negativeEmoji} style={{ width: '50px', height: 'auto', marginRight: '5px' }} />{' '}
          Significant measures required/development areas not yet specified
        </div>
        <p>
          Please enter a brief description of the main points of discussion for each topic in the
          space provided.
        </p>
      </div>
      <ProgrammeSelect />
      {room && <Form />}
    </div>
  )
}

export default FormView
