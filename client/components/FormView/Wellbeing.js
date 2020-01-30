import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Streetlights from 'Components/Generic/Streetlights'

const Wellbeing = () => {
  return (
    <>
      <h2>II - WELLBEING</h2>
      <TextArea label="What information and sources of information did you use?"/>
      <TextArea label="What information would you have needed?" />
      <h3>9. COMMUNITY WELLBEING</h3>
      <p>How is the wellbeing of teachers and students monitored? Has the workload of teachers and students been assessed? What measures have been taken?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
      <h3>10. TEACHER SKILLS AND THEIR DEVELOPMENT</h3>
      <p>Are the skills and strengths of the degree programme teachers known and used? Are the teachers encouraged to enhance their teaching skills? Do the teachers need support for multilingual and multicultural education or digital skills?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
      <h3>11. MANAGEMENT AND COMMUNICATION</h3>
      <p>Has the steering group worked successfully? What challenges have been identified in the steering group’s work and management? How does internal information distribution/communication/interaction function between the programme teachers, students and leadership (director and steering group)? What development measures have been taken?</p>
      <Streetlights label="General assessment *"/>
      <TextArea label="Main points of discussion *" />
    </>
  )
}

export default Wellbeing
