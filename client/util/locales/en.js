export default {
  common: {
    // all use English fallback for following
    adminPage: 'OSPA',
    about: 'About',
    // End of fallbacks
    logOut: 'Log out',
    chosenLanguage: 'English',
    form: 'Form',
    positive: 'No issues',
    neutral: 'Challenges identified and development underway',
    negative: 'Significant measures required/development areas not yet specified',
    EMPTY: 'No answer provided',
    OK: 'Answer given',
    lastSaved: 'Last saved',
  },

  aboutPage: {
    title: 'What is the Form?',
    whatIsIt: 'What is the self-assessment form?',
    whatIsItReply:
      'The Form is meant to act as a basis of the self-assessment discussion done by the steering group of each study programme. The Form is also used to document these discussions. The Form is being used in the University of Helsinki.',
    howToFillTitle: 'How should we fill in the form?',
    howToFill: `
    The questions are meant to arouse discussion around the respective topic, and each programme is suppose to write down the main points of that conversation. 
    Additionally, a separate list of measures is created for the programme itself, and another list regarding the measures for the faculty-wide planning.
    The programmes give also a general assessment of the situation via the colored smileys / traffic lights. These color answers are supposed to answer the question "Where are we now?" in relation
    to the subject at hand. The color answers are meant only as a conversation starter, thus no judgements or conclusions are drawn about the quality of the programme based on them. `,
    whatElseTitle: 'What else can I do with the form?',
    whatElse:
      "You can read the written documentation done by other programmes. With the reporting and comparison tools, you can also compare your assessments with the other programmes' assessments.",
    contactInfo: 'Questions? Contact ospa@helsinki.fi',
    broughtBy: 'Brought to you by:',
  },

  formView: {
    title: 'DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME',
    info1:
      'Please discuss the topics below in the steering group of the degree programme. The questions are intended to spark discussion, and the purpose is not to answer them as such.',
    info2:
      "Please provide an overall assessment of the programme's current status (“Where are we now?”) with regard to each topic using the following system of emoji:",
    downloadCSV: 'Download all data as a CSV file',
    downloadPDF: 'Print / Download answers as a PDF-file',
    mandatory: 'required field',
    saveFailed: 'Error: The changes you have made in the last 10 seconds have not been saved!',
    saveFailedInstructions:
      'In order to continue filling the form, please backup any recent changes you have made. Then click the button to reload the page.',
    reload: 'Reload the page',
    status: {
      locked: 'The form has been locked for the selected year and it cannot be edited.',
      open: 'form is open for editing.',
      canBeOpened: 'The owner of the form may still unlock the form before its deadline',
      deadlinePassed: 'The deadline to edit form has passed.',
      ospaProcessing: 'OSPA will process the answers.',
    },
    savingAnswers: 'Answers are saved automatically. Final day for answering the form:',
  },
}
