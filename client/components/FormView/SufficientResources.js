import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Streetlights from 'Components/Generic/Streetlights'

const SufficientResources = () => {
  return (
    <>
      <h2>III - SUFFICIENT AND APPROPRIATE HUMAN AND OTHER RESOURCES</h2>
      <TextArea label="What other information and sources of information did you use?" />
      <TextArea label="What information would you need?" />
      <h3>12. TEACHING RESOURCES</h3>
      <p>Have the teaching, guidance and supervision resources of the degree programme been sufficient? How successfully have the degree programme and the faculty/department negotiated on the contributions of teachers? Have changes been made to the teaching resources to such a degree that they have affected the programme operations? What areas should be developed?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
      <h3>13. OPPORTUNITIES TO INFLUENCE THE RECRUITMENT OF NEW STAFF</h3>
      <p>How has the degree programme been able to influence the recruitment of new staff? What areas should be developed?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
      <h3>14. RESOURCES RELATED TO FACILITIES, EQUIPMENT AND LEARNING ENVIRONMENTS</h3>
      <p>How would you describe the degree programme resources relating to facilities, equipment and learning environments?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
    </>
  )
}

export default SufficientResources
