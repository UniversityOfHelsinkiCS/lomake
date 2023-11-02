export default {
  common: {
    adminPage: 'OSPA',
    about: 'About',
    admin: 'Admin',
    logOut: 'Log out',
    backToFrontPage: 'Back to frontpage',
    chosenLanguage: 'English',
    form: 'Form',
    positive: 'No issues',
    neutral: 'Challenges identified and development underway',
    negative: 'Significant measures required/development areas not yet specified',
    noColors: '*Questions, without traffic lights are not shown here (e.g. 16 and 17)',
    green: 'Green',
    yellow: 'Yellow',
    red: 'Red',
    EMPTY: 'No answer provided',
    empty: 'No answer provided',
    OK: 'Answer given',
    lastSaved: 'Last saved',
    lastSent: 'Last sent',
    lastSentInThisRole: 'Ensisijainen rooli viimeksi lähetetyssä lomakkeessa',
    close: 'Close',

    faculty: 'Faculty',
    programmeHeader: 'Programme',
    code: 'Code',
    allProgrammes: 'All programmes',
    bachelor: "Bachelor's programmes",
    master: "Master's programmes",
    doctoral: 'Doctoral programmes',
    bachelorShort: 'Bachelor',
    masterShort: 'Master',
    doctoralShort: 'Doctoral',
    international: "International Master's programmes",
    programmeFilter: 'Search for degree programmes',
    facultyFilter: 'Search for faculties',

    noData: 'No data available for these choices',
    selectAll: 'Select all',
    clearSelection: 'Clear selection',
    responses: 'Responses:',
    writtenAnswers: 'Written answers',
    trafficLights: 'Traffic lights',

    choose: 'Choose',
    colors_all: 'all',
    colors_green: 'only green',
    colors_yellow: 'only yellow',
    colors_red: 'only red',
    answers: 'answers',

    email: 'Email',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',

    yearlyAssessment: 'Annual follow-up',
    evaluation: 'Review',
    evaluationFaculty: 'Review - Faculty',
    'degree-reform': 'Current state of education',
    'degree-reform-group': 'Current state of education - programmes',
    'degree-reform-individual': 'Current state of education - individual',
    'read-more': 'Show more',
    'read-less': 'Show less',
    otherTextBox: 'Other, please specify',
    send: 'Send',
    what: 'What',
    chooseFaculty: 'Choose faculty',
    chooseForm: 'Choose form',
    chooseProgramme: 'Choose degree programme',
    showAllProgrammes: 'Show all programmes',
    showDataByProgramme: 'Degree programme answers by faculty',
    showAllFacultyProgrammes: 'Show also joint programmes',
  },

  aboutPage: {
    title: 'What is the Form?',
    whatIsIt: 'What is the self-assessment form?',
    whatIsItReply:
      'The Form is meant to act as a basis of the self-assessment discussion done by the steering group of each degree programme. The Form is also used to document these discussions. The Form is being used in the University of Helsinki.',
    howToFillTitle: 'How should we fill in the form?',
    howToFill: `
    The questions are meant to arouse discussion around the respective topic, and each programme is suppose to write down the main points of that conversation. 
    Additionally, a separate list of measures is created for the programme itself, and another list regarding the measures for the faculty-wide planning.
    The programmes give also a general assessment of the situation via traffic lights. These color answers are supposed to answer the question "Where are we now?" in relation
    to the subject at hand. The color answers are meant only as a conversation starter, thus no judgements or conclusions are drawn about the quality of the programme based on them. `,
    whatElseTitle: 'What else can I do with the form?',
    whatElse:
      "You can read the written documentation done by other programmes. With the reporting and comparison tools, you can also compare your assessments with the other programmes' assessments.",
    contactInfo: 'Questions? Contact ospa@helsinki.fi',
    broughtBy: 'Brought to you by:',
  },

  comparison: {
    compare: 'Compare answers',
    reportHeader: {
      byFaculty: 'Compare programme to a faculty',
      byYear: 'Compare answers by year',
    },
    selectYears: 'Select the year(s) you would like to inspect',
    filterFaculties: 'Filter by faculty',
    selectQuestions: 'Questions for comparison',
    writtenAnswers: 'Written answers by year',
    chosenProgrammes: 'Chosen programme',
    chooseProgramme: 'Choose a programme for comparison',
    compareFaculties: 'Compare by faculty',
    emptyAnswers: 'Include programmes without answers to the graphs',
    university: 'Entire university',
    noAccessToAll: 'Please note, that you can only see comparison with the programmes you have reading rights to',
    labelOptions: 'Unit in the graph',
    percentage: 'Percentages',
    programmeAmount: 'Amount of programmes',
    programmes: 'Programmes',
    fullscreen: 'Full screen',
    downloadPNG: 'Download as a PNG-image',
    downloadSVG: 'Download as a SVG-image',
    downloadPDF: 'Download as a PDF',
    chartExport: 'Comparison_of_self-assessment_answers',
  },

  formView: {
    formError: 'Error connecting the form',
    formErrorButton: 'Click here to reload the page!',
    canChange: 'You can edit the answers after saving',
    title: 'DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME',
    info1:
      'Please discuss the topics below in the steering group of the degree programme. The questions are intended to spark discussion, and the purpose is not to answer them as such.',
    info2:
      'Please provide an overall assessment with regard to each topic using the following system of traffic lights:',
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
      viewOnly: "You don't have editing rights to this form. But you can view the answers.",
      canBeOpened: 'The owner of the form may still unlock the form before its deadline',
      deadlinePassed: 'The deadline to edit form has passed.',
      ospaProcessing: 'OSPA will process the answers.',
      prosessing: 'The answers will be processed.',
    },
    savingAnswers: 'Answers are saved automatically except for text fields. Final day for answering the form:',
    noSystemsSelected: 'No feedback systems selected.',
    selectSystems: 'Chooce a system by clicking',
    mostUseful: 'Most useful feedback systems',
    developmentArea: 'Development area',
    actions: 'Suggestion for corrective actions',
    requiredActions: 'Actions required',
    addDevelopmentArea: 'Add development area',
    removeDevelopmentArea: 'Delete last',
    allYearlyAnswerYears: 'All annual follow-up report years',
    evaluationInfo1:
      "For this review, consider the degree programme's overall situation <strong>over the last three years</strong>.",
    evaluationInfo2:
      "Discuss the following themes among the degree programme's steering group. Please note, that <strong>the annual follow-up for year 2023 should be done before this review</strong>.",
    selectApplicable: 'Select all applicable options',
    addMissing: ' Add any missing options - You may add several',
    progSummaryTitle: 'Annual follow-up answers related to this theme from the review period',
    facultySummaryTitle: 'The answers given by the steering groups of the faculty´s degree programmes',
    facultyActionSummaryTitle:
      'The steering groups of the degree programmes recorded their development areas and their required measures as follows:',
    materials: 'Supporting materials',
    materialsProg:
      'You can view all annual follow-up answers by following the below link.<br/> Additionally, a summary of annual follow-up answers related to each theme has been added to most questions in this form.<br/>A new view has also been added to Oodikone. This view contains a selection of key statistics about the students of your programme and faculty, and about the progress of their studies. Shown below are links to both programme and faculty views.',
    summaryLinkProg: 'View all previous annual follow-up answers',
    oodikoneProg: 'View programme statistics in Oodikone',
    oodikoneFaculty: 'View faculty statistics in Oodikone',
    rapo: 'View doctoral programme statistics in Rapo',
    toijo:
      'Assessment of the operating structure and management system (TOIJO) self-assessment report <a href="https://workgroups.helsinki.fi/pages/viewpage.action?pageId=323688922&preview=/323688922/323688944/1_University%20of%20Helsinki%20TOIJO%20self-assessment%20report%20280823.pdf" target="_blank">here</a>',
    langCenterRaport:
      "Language Centre's self-evaluation report <a href='https://workgroups.helsinki.fi/display/KTKKT/Kielikeskuksen+taustamateriaali+koulutusohjelmien+katselmuksen+tueksi' target='_blank'>here</a> (currently only in Finnish)",
    facultyInfo:
      'For this review you will consider the state of degree programmes of the <strong>faculty</strong> over the period of the three previous years.',
    materialsFaculty:
      'The questions in this form are accompanied by a summary of the answers given to the same theme by the steering groups of the faculty´s degree programmes.<br><br>A supporting view has been added to Oodikone. This view contains some of the key statistics about the students of the faculty, and about the progress of their studies. Link shown below.',
    yearlyAnswers: 'Annual follow-up answers',
    evaluationFacultyAnswers: 'Review in degree programmes answers',
    yearlyFacultyAnswers: 'Annual follow-up answers in degree programmes',
    fillAllRequiredFields: 'At least the first three questions must be answered if you want to save',
    showAllProgrammes: 'Show all degree programmes',
    formReady: 'Your answers are saved',
    sendNewForm: 'Send a new form',
    modifyForm: 'Modify your answers',
    sendForm: 'Save your answers',
    sendFormModalDescription: 'Are you sure you want to send the form? Information from sent forms are saved',
    sendFormModalHeader: 'Sending new Degree Reform form',
    stronglyDisagree: 'Strongly disagree',
    partiallyDisagree: 'Partially disagree',
    neitherNor: 'Neither agree nor disagree',
    partiallyAgree: 'Partially agree',
    stronglyAgree: 'Strongly agree',
    doNotKnow: "I don't know",
    noAnswer: 'No answer',
    average: 'Average',
    showAnswers: 'Show answers',
    hideAnswers: 'Hide answers',
    evaluationSummaryByProgramme: 'View the faculty data on the results of the Current state of education survey.',
    formNotReady: 'Form is still under development, opens 1.11.',
  },

  generic: {
    noData: 'answers to individual questions not yet available',
    facultyAvg: 'Average of programmes of the faculty',
    universityAvg: 'Average of all programmes',
    individualAvg: 'Average of individual answers of the faculty',
    noAnswerData: 'No answeers for the question',
    kludgeButton: 'Save the textfield',
    degreeReformIndividualAnswers: 'Answers',
    degreeReformIndividualForm: 'Form',
    companionFilter: "Include faculty's partnership programmes to the answers",
    isWriting: 'is writing',
    allDoctoralSchools: 'All doctoral programmes',
    doctoralSchoolFilter: 'Filter by doctoral schools',
    socialSchool: 'Doctoral school in humanities and social sciences',
    sciencesSchool: 'Doctoral school in natural sciences',
    healthSchool: 'Doctoral school in health sciences',
    environmentalSchool: 'Doctoral school in environmental, food and biological sciences',
    textAreaLabel: 'Main points of discussion',
    textAreaLabelQ12and13: 'Justify the assessment',
    kludgedLabel: 'ASSESMENT',
    kludgedLabel2: 'DESCRIPTION',
    allFaculties: 'All faculties',
    collapseText: 'Hide answers from last year',
    expandText: 'Show answers from last year',
    compareLevel: 'Compare by programme level',
    levelFilter: 'Filter by programme level',
    measureLabel: 'Add 1-5 measures.',
    noPermissions:
      "You have no permissions for any degree programmes. Please contact Strategic Services for Teaching or your degree programme's leader.",
    nowShowing: 'NOW SHOWING THE ANSWERS OF',
    chooseMore: 'CHOOSE MORE PROGRAMMES:',
    tooLongPaste:
      'The text you are trying to paste ({{newLength}} characters in total) does not fit in the maximum character limit {{MAX_LENGTH}} characters)',
    year: 'Year(s)',
    pdfExportText: 'Answers_to_the_self-assessment_form',
    reportPage: 'Answers to the Form',
    downloadPDF: 'Download answers as a PDF-file',
    statusHeader: 'Answers for the year {{year}} can be modified.',
    statusMessage: 'Year can be selected from the dropdown below the headline. Final day for answering the form is: ',

    csvFileformwritten: 'Written_answers',
    csvFileformcolors: 'Traffic_lights',
    csvFileoverviewwritten: 'All_the_programmes_written_answers',
    csvFileoverviewcolors: 'All_the_programmes_traffic_lights',
    colors: 'Download traffic light answers as a CSV file',
    written: 'Download written answers as a CSV file',

    level: {
      programmes: 'Degree programme level',
      faculties: 'Faculty level',
      university: 'University level',
      committee: 'Committee',
    },
    textUnsaved: 'Text not saved!',
  },

  overview: {
    betterThanLastYear: 'Better than last year',
    worseThanLastYear: 'Worse than last year',
    formLocked: 'Form is locked',
    formUnlocked: 'Form can be edited',
    unlockForm: 'Unlock form',
    lockForm: 'Lock form (prevents editing)',
    overviewPage: 'Form - Overview',
    accessRights: 'Access Rights',
    selectYear: 'Select year to inspect',
    readAnswers: 'Read answers',
    compareAnswers: 'Compare answers',
    csvDownload: 'Download CSV',
    name: 'Name',
    view: 'Read',
    edit: 'Edit',
    owner: 'Owner',
    noUsers: 'No users',
    userListJory: 'Steering group members who have accessed the form',
    userListOthers: 'Other users who have programme access rights and have accessed the form',
    greenModalAccordion: 'Situation good',
    yellowModalAccordion: 'Situation satisfactory',
    redModalAccordion: 'Situation poor',
    facultySummary: 'Degree programme answers',
    pcs: 'pcs',
  },

  report: {
    pdfNotification: 'Only the questions and answers chosen here will be printed on the PDF-report',
    facultyFilter: 'Filter by faculty',
    reportPage: 'Answers',
    selectQuestions: 'Filter out questions',
    clickToCheck: 'Check the written answers',
    question: 'Question',
    answered: 'Answered',
    all: 'All',
    filterBy: 'Filter answers by',
    improvementAreas: 'Development areas',
    improvementActions: 'Suggestion for corrective actions',
  },

  users: {
    nextDeadline: 'Next deadline: ',
    answersSavedForYear: 'Current draft answers will be saved for the year: ',
    contactToska: 'If you wish to change the deadline, please contact Toska (grp-toska@helsinki.fi).',
    noDeadlineSet: 'No deadline has yet been set for this year or the deadline has already passed. ',
    selectNewDeadline: 'Select new deadline',
    selectDraftYear: 'Set which years answers will be opened: ',
    deadlineWarning:
      'Form is already open for another draft year. Please freeze the form first so all data is saved properly',
    updateDeadline: 'Update deadline',
    deleteThisDeadline: 'Freeze the form',
    noDraftYear: 'No year has been selected',
    adminPage: 'Form - Admin-page',
    users: 'Users',
    iams: 'IAM-groups',
    deadline: 'Deadline',
    updateStudyprogrammes: 'Update degree programmes',
    deadlineSettings: 'Deadline settings',
    moreProgrammes_one: 'more programme',
    moreProgrammes_other: 'more programmes',
    special: {
      access_accessAllProgrammes: 'All programmes',
      access_accessInternational2020: "International Master's programmes 2020 ->",
      access_accessInternational: "International Master's programmes",
      access_accessDoctoral: 'All doctoral programmes',
      access_accessEvaluationFaculty: 'Evaluation faculty',
    },
    basicUser: 'Basic user',
    superAdmin: 'Super admin',
    searchByName: 'Search users by name',
    filterByAccess: 'Etsi koulutusohjelmien perusteella',
    name: 'Name',
    userId: 'User id',
    access: 'Access',
    userGroup: 'User group',
    lastLogin: 'Last login',
    specialGroup: 'Access groups',
    role: 'Main role',

    tempAccess: 'Manage accesses',
    tempAccessMangement: 'Manage temporary accesses',
    tempAccessInfo1: `
      If necessary, an user can be given temporary reading and writing rights to certain programmes.
    `,
    tempAccessInfo2: `
      The recipient of the temporary right must have LOGGED IN PREVIOUSLY to the form.
      Upon saving, the director of the chosen programme will be sent a notification email.
    `,
    tempAccessNote:
      'This feature is meant only for exceptional situations. Rights should be primarily managed via IAM groups.',
    receiverEmail: 'Helsinki.fi-email of the access recipient',
    accessProgramme: 'Programme to give access to',
    endOfAccess: 'Last day of access',
    kojoEmail: 'Programme director email',
    giveWritingRights: 'Give writing rights',
    saveRight: 'Save access right',
    tempAccesses: 'Temporary accesses',
    expired: 'Show expired',
    writingRight: 'Writing right',
    endsIn: 'Until',
    confirm: 'Delete temporary access right of {{firstname}} {{lastname}} to programme {{progName}}?',
  },
}
