import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Streetlights from 'Components/Generic/Streetlights'
import Section from './Section'

const JointProgramme = () => {
	return (
		<Section title="JOINT PROGRAMME WITH SEVERAL FACULTIES" number="IV">
			<TextArea
				id="joint_programme_information_used"
				label="What other information and sources of information did you use?"
			/>
			<TextArea
				id="joint_programme_information_needed"
				label="What information would you have needed?"
			/>
			<h3>15. COOPERATION</h3>
			<p>
				How successfully have the partners cooperated? What are the major merits and challenges of
				cross-faculty operations?
			</p>
			<Streetlights id="cooperation_success" label="General assessment *" />
			<TextArea id="cooperation_success" label="Main points of discussion" />
		</Section>
	)
}

export default JointProgramme
