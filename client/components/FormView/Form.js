import React from 'react'

import OverallStatus from 'Components/FormView/OverallStatus'
import Wellbeing from 'Components/FormView/Wellbeing'
import SufficientResources from 'Components/FormView/SufficientResources'
import JointProgramme from 'Components/FormView/JointProgramme'
import SuccessesAndNeeds from 'Components/FormView/SuccessesAndNeeds'
import ListOfMeasures from 'Components/FormView/ListOfMeasures'
import Feedback from 'Components/FormView/Feedback'

const Form = () => {
  return (
    <div className="the-form">
      <OverallStatus />
      <Wellbeing />
      <SufficientResources />
      <JointProgramme />
      <SuccessesAndNeeds />
      <ListOfMeasures />
      <Feedback />
    </div>
  )
}

export default Form
