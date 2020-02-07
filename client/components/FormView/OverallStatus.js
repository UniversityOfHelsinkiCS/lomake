import React from 'react'
import TextArea from 'Components/Generic/Textarea'
import Streetlights from 'Components/Generic/Streetlights'
import Section from './Section'

const OverallStatus = () => {
	return (
		<Section title="OVERALL STATUS OF THE DEGREE PROGRAMME" number="I">
			<a href="https://oodikone.cs.helsinki.fi">Information provided</a>
			<TextArea id="overall_status_information_used" label="What other information did you use?" />
			<TextArea
				id="overall_status_information_needed"
				label="What information would you have needed?"
			/>
			<h3>1. STUDENT ADMISSIONS</h3>
			<p>
				Is the number of places available to new students in the programme suitable? Is the number
				of applicants sufficient and are the applicants suitable for the programme? How well do the
				admissions procedures function? What is the ratio of international students to the total
				number of students? How many students who have completed a lower-level degree at the
				University of Helsinki continue in the programme, and how many students are recruited from
				other Finnish institutions of higher education? In the case of a doctoral programme, how
				well do student admissions (procedure for granting the right to complete a degree) and the
				allocation of salaried doctoral student positions function?
			</p>
			<Streetlights id="student_admissions" label="General assessment" required />
			<TextArea id="student_admissions" label="Main points of discussion" required />
			<h3>2. LANGUAGE ENVIRONMENT</h3>
			<p>
				How successfully have teaching, guidance, supervision and student services been provided in
				various languages (Finnish, Swedish and English)? In the case of an English-language or
				multilingual degree programme, has the programme created a language environment that is
				suitable for everyone? In the case of a multilingual degree programme, does the programme
				function well from the perspective of the various languages (Finnish, Swedish and English)?
				Do international students have the opportunity to study the national languages of Finland
				(Finnish and Swedish)?
			</p>
			<Streetlights id="language_environment" label="General assessment" required />
			<TextArea id="language_environment" label="Main points of discussion" required />
			<h3>
				3. PROFILE AND DISTINCTIVE FEATURES OF THE DEGREE PROGRAMME WITHIN THE UNIVERSITY, IN
				FINLAND AND ABROAD
			</h3>
			<p>
				Does the degree programme have a clear profile and identity recognised by its teachers,
				those providing guidance and supervision as well as (doctoral) students? How does the
				programme profile stand out from other degree programmes in the same field and of the same
				level?
			</p>
			<Streetlights id="programme_identity" label="General assessment" required />
			<TextArea id="programme_identity" label="Main points of discussion" required />
			<h3>4. EMPLOYABILITY</h3>
			<p>
				How are the results of national career tracking used in the programme? In what other ways
				does the programme steering group monitor relevant employment figures and the demand for the
				expertise it provides in the (Finnish and international) job market? How does the programme
				support students in career planning and the establishment of employer connections? How does
				the programme take the special employment needs and challenges of international students
				into account?
			</p>
			<Streetlights id="employability" label="General assessment" required />
			<TextArea id="employability" label="Main points of discussion" required />
			<h3>5. LEARNING OUTCOMES</h3>
			<p>
				Are the learning outcomes set for the degree programme clear and realistic? How should the
				learning outcomes be developed?
			</p>
			<Streetlights id="learning_outcomes" label="General assessment" required />
			<TextArea id="learning_outcomes" label="Main points of discussion" required />
			<h3>6. FUNCTIONALITY AND DEVELOPMENT OF THE CURRICULUM</h3>
			<p>
				How do the curriculum and the teaching programme ensure that all students can and do
				complete the degree programme within the target duration? Does the programme offer
				sufficient and appropriate teaching? Does the programme offer sufficient teaching in various
				languages (Finnish, Swedish and English)? How does Swedish-language education function,
				particularly if the programme offers applicants a Swedish-language option?
			</p>
			<Streetlights id="curriculum" label="General assessment" required />
			<TextArea id="curriculum" label="Main points of discussion" required />
			<h3>7. STUDENT GUIDANCE AND SUPERVISION</h3>
			<p>
				How does the programme offer guidance and supervision associated with personal study plans
				and other studies, and how have such guidance and supervision functioned? How should the
				guidance and supervision be developed? How does the supervision of theses and dissertations
				function?
			</p>
			<Streetlights id="guidance" label="General assessment" required />
			<TextArea id="guidance" label="Main points of discussion" required />
			<h3>8. USE OF STUDENT FEEDBACK</h3>
			<p>
				What types of feedback does the programme use and how? How has the feedback collected been
				processed in the degree programme? Who has participated in processing the feedback? What
				changes have been made based on the feedback?
			</p>
			<Streetlights id="student_feedback" label="General assessment" required />
			<TextArea id="student_feedback" label="Main points of discussion" required />
		</Section>
	)
}

export default OverallStatus
