import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Section from './Section'

const Feedback = () => {
	return (
		<Section title="FEEDBACK" number="VII">
			<h3>18. HOW DID IT GO?</h3>
			<p>
				How did the steering group’s discussion on the current status of the degree programme go?
				How long did it take to complete the discussion and record the current status of the degree
				programme? What went well? What requires further development?
			</p>
			<TextArea
				id="feedback"
				label="18. FEEDBACK: Please review the work done by the steering group to analyse the current status of the degree programme, and provide feedback for continued preparation."
			/>
		</Section>
	)
}

export default Feedback
