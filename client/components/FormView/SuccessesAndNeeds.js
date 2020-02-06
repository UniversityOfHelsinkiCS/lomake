import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Section from './Section'

const SuccessesAndNeeds = () => {
	return (
		<Section title="SUCCESSES AND DEVELOPMENT NEEDS" number="V">
			<p>
				Please review the main points you have recorded, trying to pinpoint areas where the
				programme has succeeded particularly well, and write them down.
			</p>
			<p>
				Please also consider the development needs you have identified and the measures required.
				You should select the three to five most important measures and record them for the purpose
				of the faculty’s implementation plan together with the resources required for each measure.
			</p>
			<h3>16. IN WHAT AREAS HAS THE DEGREE PROGRAMME SUCCEEDED PARTICULARLY WELL?</h3>
			<TextArea id="successes_and_development_needs" label="Greatest successes *" />
		</Section>
	)
}

export default SuccessesAndNeeds
