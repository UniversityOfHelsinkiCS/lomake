export default {
  common: {
    adminPage: 'OSPA',
    about: 'Om blanketten',
    admin: 'Administration',
    logOut: 'Logga ut',
    backToFrontPage: 'Tillbaka till framsidan',
    chosenLanguage: 'Svenska',
    form: 'Blankett',
    positive: 'I sin ordning',
    neutral: 'Utmaningarna är kända och utvecklingsarbete pågår',
    negative: 'Kräver betydande åtgärder/utvecklingsobjekten har inte preciserats',
    noColors: '*Frågor utan trafikljus visas inte alls (t.ex. 16 och 17)',
    green: 'Grön',
    yellow: 'Gul',
    red: 'Röd',
    EMPTY: 'Inget svar',
    empty: 'Inget svar',
    OK: 'Svaret lämnat',
    lastSaved: 'Senast sparat',
    lastSent: 'Last sent(se)',
    lastSentInThisRole: 'Ensisijainen rooli viimeksi lähetetyssä lomakkeessa(se)',
    close: 'Close',

    faculty: 'Fakultet',
    programmeHeader: 'Program',
    code: 'Kod',
    allProgrammes: 'Alla program',
    bachelor: 'Kandidatsprogram',
    master: 'Magisterprogram',
    doctoral: 'Doktorandprogram',
    bachelorShort: 'Kandidat',
    masterShort: 'Magister',
    doctoralShort: 'Doktorand',
    international: 'Internationella Magisterprogram',
    programmeFilter: 'Sök utbildningsprogram',
    facultyFilter: 'Sök',
    find: 'Sök',

    noData: 'Ingen data tillgänglig för dessa urval',
    selectAll: 'Välj alla',
    clearSelection: 'Rensa urval',
    responses: 'Svar:',
    writtenAnswers: 'Skriftliga svar',
    trafficLights: 'Trafikljus',

    choose: 'Välj',
    colors_all: 'alla',
    colors_green: 'endast gröna',
    colors_yellow: 'endast gula',
    colors_red: 'endast röda',
    answers: 'svar',

    email: 'E-post',
    cancel: 'Avbryt',
    edit: 'Redigera',
    delete: 'Ta bort',

    yearlyAssessment: 'Årlig uppföljning',
    evaluation: 'Översyn',
    evaluationFaculty: 'Översyn - fakultet',
    'degree-reform': 'Utbildningens nuvarande tillstånd',
    'degree-reform-group': 'Utbildningens nuvarande tillstånd - program',
    'degree-reform-individual': 'Utbildningens nuvarande tillstånd - individuell',
    'read-more': 'Se mer',
    'read-less': 'Se mindre',
    otherTextBox: 'Något annat, vilket?',
    send: 'Skicka',
    what: 'Vad',
    chooseFaculty: 'Välj en fakultet',
    chooseForm: 'Välj en svaren',
    chooseProgramme: 'Välj ett studieprogram',
    showAllProgrammes: 'Visa alla studieprogram',
    showDataByProgramme: 'Examensprogram svar per fakultet',
    showAllFacultyProgrammes: 'Visa även gemensamma program',
  },

  aboutPage: {
    title: 'Information om blanketten',
    whatIsIt: 'Vad är självbedömningsblanketten?',
    whatIsItReply:
      'Blanketten lägger grunden för diskussionen om självbedömning, som förs av ledningsgruppen av varje utbildningsprogram. Blanketten används dessutom för att dokumentera dessa diskussioner. Blanketten används i Helsingfors Universitet.',
    howToFillTitle: 'Hur fyller man in blanketten?',
    howToFill: ` 
    Frågorna i självbedömningsblanketten är avsedda att väcka diskussion, och inte att besvaras som sådana.
    I blanketten antecknas kortfattat diskussionens huvudpunkter. Dessutom skapas både en lista på åtgärder för själva programmet, och en separat lista för fakultetens planer.
    För varje tema ges en allmän bedömning (trafikljus). Denna bedömning är avsedd att starta en diskussion, inte att dra slutsatser om verksamhetens kvalitet.`,
    whatElseTitle: 'Vad annat kan man göra med blanketten?',
    whatElse:
      'Du kan läsa ditt egna och andra utbildningsprograms skriftliga dokumentationer. Med hjälp av rapporteringsverktygen kan du jämföra data från ditt eget utbildningsprogram med data från andra program. Du kan även skapa grafer utifrån datan.',
    contactInfo: 'Frågor? Kontakta ospa@helsinki.fi',
    broughtBy: 'Förverkligad av',
  },

  comparison: {
    compare: 'Jämför svar',
    reportHeader: {
      byFaculty: 'Jämför program med fakultet',
      byYear: 'Jämför enligt år',
    },
    selectYears: 'Jämför åren du vill granska',
    filterFaculties: 'Filtrera enligt fakultet',
    selectQuestions: 'Frågor att jämföra',
    writtenAnswers: 'Skriftliga svar enligt år',
    chosenProgrammes: 'Valt program',
    chooseProgramme: 'Välj ett program att jämföra',
    compareFaculties: 'Jämför enligt fakultet',
    emptyAnswers: 'Räkna in program utan svar på frågan',
    university: 'Hela universitetet',
    noAccessToAll: 'Observera att du bara kan se jämförelser med de programmen som du har läsrättigheter till',
    labelOptions: 'Enhet i grafen',
    percentage: 'Procentandelar',
    programmeAmount: 'Antal program',
    programmes: 'Program',
    fullscreen: 'Helskärm',
    downloadPNG: 'Ladda ner som PNG-bild',
    downloadSVG: 'Ladda ner som SVG-bild',
    downloadPDF: 'Ladda ner som PDF',
    chartExport: 'Jämförelse_av_självbedömningssvar',
  },

  formView: {
    formError: 'Fel vid anslutning av sidan',
    formErrorButton: 'Klicka här för att ladda om sidan!',
    requiredActions: 'Åtgärder',
    universitySummaryTitle: 'Fakulteten svarade på följande sätt:',
    facultyActionSummaryTitle:
      'Ledningsgrupperna för fakultetens utbildningsprogram antecknade sina utvecklingsobjekt och åtgärder på följande sätt:',
    // universityActionSummaryTitle: '',
    facultySummaryTitle: 'Ledningsgrupperna för fakultetens utbildningsprogram svarade på följande sätt:',
    materialsUniversity:
      'I blanketten har man lagt till en sammanfattning av svaren på översyn från fakulteten.<br /><br />I Oodikone har skapats en vy som stöd för översynen. I denna vy har man samlat in statistik om fakultetens studerande och hur deras studier framskrider. Nedan länk till Oodikone.',
    materialsFaculty:
      'I blanketten har man lagt till en sammanfattning av svaren på översyn från fakultetens utbildningsprogram.<br><br>I Oodikone har skapats en vy som stöd för översynen. I denna vy har man samlat in statistik om fakultetens studerande och hur deras studier framskrider. Nedan länk till fakultetens vy.',
    facultyInfo:
      'Denna översyn tar ett bredare grepp på situationen för <strong>fakultetets utbildningsprogram</strong> under de senaste tre åren.',
    canChange: 'Du kan redigera svaren efter att du har sparat',
    title: 'DOKUMENTATION AV UTBILDNINGSPROGRAMMETS LÄGESBESKRIVNING',
    info1:
      'Diskutera formulärets teman i utbildningsprogrammets ledningsgrupp. Frågorna kring de olika temana är avsedda att stimulera till diskussion; de ska alltså inte besvaras som sådana.',
    info2: 'Ge en allmän bedömning av läget för varje tema med hjälp av trafikljusen: ',
    downloadCSV: 'Ladda ner svaren i en csv-fil',
    downloadPDF: 'Skriv ut / Ladda ner svaren i en PDF-fil',
    mandatory: 'obligatoriskt fält',
    saveFailed: 'Fel: De ändringar som du har gjort under de senaste 10 sekunderna har inte sparats!',
    saveFailedInstructions:
      'För att fortsätta att fylla i formuläret, säkerhetskopiera dina senaste ändringar. Tryck sedan på knappen för att ladda om sidan.',
    reload: 'Ladda om sidan',
    status: {
      locked: 'Blanketten från det valda året har blivit låst och kan inte redigeras.',
      open: 'svaren kan redigeras.',
      canBeOpened: 'Blankettens ägare kan ännu öppna blanketten innan dess deadline.',
      deadlinePassed: 'Tiden för att redigera blanketten har gått ut.',
      ospaProcessing: 'OSPA behandlar svaren.',
      prosessing: 'Svaren behandlas.',
    },
    savingAnswers: 'Svaren sparas automatiskt utom för textfält. Sista dagen för att svara på blanketten:',
    noSystemsSelected: 'Inget responssystem har valts',
    // selectSystems: '',
    // mostUseful: '',
    developmentArea: 'Utvecklingsobjekt',
    actions: 'Åtgärdsförslag',
    // requiredActions: '',
    addDevelopmentArea: 'Lägg till utvecklingsobjekt', // Not from translation (FIX?)
    // removeDevelopmentArea: '',
    allYearlyAnswerYears: 'Alla år i årsuppföljningen',
    evaluationUniTopInfo:
      '<strong>OBS!</strong> Ansvaret för att sammanställa uppgifter på universitetsnivå ligger utbildningsrådet (ONE) för kandidat- och masterprogram, och hos styrgruppen för forskarskolan och det vetenskapliga rådet (TINE) för doktorandprogram.<br /><br />Utbildningsrådet, vetenskapliga rådet och styrgruppen för forskarskolan gör sina noteringar på samma formulär som utvärderingsgruppen kommer att använda.',
    evaluationInfo1:
      'I översynen granskas läget för utbildningsprogrammet på ett mer omfattande plan i fråga om <strong>de senaste tre åren</strong>.',
    evaluationInfo2:
      'Diskutera formulärets teman i utbildningsprogrammets ledningsgrupp. Observera att <strong> 2023 års årsuppföljning ska vara slutförd innan översynsformuläret fylls i</strong>.',
    evaluationInfoUni:
      'Denna översyn tar ett bredare grepp på situationen för universitetets utbildningsprogrammen under de senastge tre åren.',
    selectApplicable: 'Välj alla lämpliga alternativ',
    addMissing: 'Lägg till ett alternativ',
    progSummaryTitle: 'Svaren på årsuppföljningens frågor om temat under observationsperioden',
    // facultySummaryTitle: '',
    materials: 'Bakgrundsmaterial',
    materialsProg:
      'Via länken nedan kan ni läsa alla svar som antecknats i samband med årsuppföljningen.<br/>På detta formulär har det dessutom till flera av frågorna bifogats en sammanfattning av de senaste tre årens svar på årsuppföljningens frågor om respektive tema.<br/>Till stöd för översynen har det skapats en vy i Oodikone. I vyn har det sammanställts central statistik om studenterna vid ert utbildningsprogram och er fakultet samt om studenternas studieframsteg. Nedan finns en länk till vyn på både program- och fakultetsnivå. ',
    summaryLinkProg: 'Granska alla svar från tidigare årsuppföljningar',
    oodikoneProg: 'Granska utbildningsprogrammets uppgifter i Oodikone',
    oodikoneFaculty: 'Granska fakultetens uppgifter i Oodikone',
    oodikoneUniversity: 'Granska uppgifter i Oodikone',
    // rapo: '',
    // facultyInfo: '',
    // yearlyAnswers: '',
    formReady: 'Svaren har sparats',
    // sendNewForm: '',
    modifyForm: 'Redigera svaren',
    sendForm: 'Spara svaren',
    fillAllRequiredFields: 'Åtminstone de tre första frågorna måste besvaras om du vill spara',
    // sendFormModalHeader: '',
    // sendFormModalDescription: '',
    stronglyDisagree: 'Helt av annan åsikt',
    partiallyDisagree: 'Delvis av annan åsikt',
    neitherNor: 'Varken av samma eller av annan åsikt',
    partiallyAgree: 'Delvis av samma åsikt',
    stronglyAgree: 'Helt av samma åsikt',
    doNotKnow: 'Kan inte säga',
    noAnswer: 'Inget svar',
    average: 'Genomsnitt',
    toijo:
      'TOIJO självutvärderingsrapporten <a href="https://workgroups.helsinki.fi/pages/viewpage.action?pageId=323688922&preview=/323688922/323688944/1_University%20of%20Helsinki%20TOIJO%20self-assessment%20report%20280823.pdf" target="_blank">här</a> (endast på engelska)',
    langCenterRaport:
      'Språkcentrums självutvärderingsrapporten <a href="https://workgroups.helsinki.fi/display/KTKKT/Kielikeskuksen+taustamateriaali+koulutusohjelmien+katselmuksen+tueksi" target="_blank">här</a> (för närvarande endast på finska)',
    showAnswers: 'Visa svar',
    hideAnswers: 'Dölj svar',
    evaluationSummaryByProgramme: 'Titta på fakultetens information om resultaten av enkäten Utbildningens tillstånd',
    evaluationSummaryUniversity: 'Granska resultat av enkäten Utbildningens nuvarande tillstånd',
    formNotReady: '',
    overallActionSummaryTitle: 'Allmänna bedömningar och rekommendationer',
    bachelorUniForm: 'Kandidatprogrammen (ONE gör anteckningarna)',
    masterUniForm: 'Magisterprogrammen (ONE gör anteckningarna)',
    doctoralUniForm: 'Doktorandprogrammen (TINE och styrgruppen för forskarskolan gör anteckningarna)',
  },

  generic: {
    noData: 'svar på enskilda frågor som ännu inte är tillgängliga',
    facultyAvg: 'Genomsnitt av fakultetens program',
    chosenFacultyAvg: 'genomsnitt för vald fakultet',
    //   chosenFaculties: '',
    universityAvg: 'Genomsnitt för alla program',
    individualAvg: 'Genomsnitt av individuella svar från fakulteten',
    individualTxt: 'Öppna svar från enskilda respondenter vid fakulteten',
    individualAvgUni: '',
    individualAvgUniSelected: '',
    noAnswerData: 'Inga svar på frågan',
    kludgeButton: 'Spara textfält',
    kludgeButtonRelease: 'Sluta redigera textfältet',
    textUnsavedRelease: 'Tryck på knappen för att frigöra fältet för andra att redigera!!',
    degreeReformIndividualAnswers: 'Svara',
    degreeReformIndividualForm: 'Form',
    companionFilter: 'Inkludera i svaren fakultetens samarbetsprogram',
    isWriting: 'skriver',
    allDoctoralSchools: 'Alla doktorandprogram',
    doctoralSchoolFilter: 'Filtrera enligt forskarskola',
    socialSchool: 'Humanistisk-samhällsvetenskapliga forskarskolan',
    sciencesSchool: 'Naturvetenskapliga forskarskolan',
    healthSchool: 'Forskarskolan i hälsoforskning',
    environmentalSchool: 'Miljö-, livsmedels- och biovetenskapliga forskarskolan',
    textAreaLabel: 'Diskussionens huvudpunkter',
    textAreaLabelQ12and13: 'Motivera bedömningen',
    kludgedLabel: 'BEDÖMNING',
    kludgedLabel2: 'BESKRIVNING',
    allFaculties: 'Alla fakultet',
    collapseText: 'Dölj fjolårets svar',
    expandText: 'Visa fjolårets svar',
    compareLevel: 'Jämför enligt utbildningsnivå',
    levelFilter: 'Filtrera enligt utbildningsnivå',
    measureLabel: 'Lägg till 1-5 åtgärder.',
    noPermissions: 'Ingen åtkomst. För att få åtkomst, kontakta utbildningsprogrammets ledare.',
    nowShowing: 'PROGRAM MED I SVAREN',
    chooseMore: 'VÄLJ MER PROGRAM:',
    tooLongPaste:
      'Texten du försöker klistra in ({{newLength}} tecken totalt) ryms inte inom det maximala antalet tecken {{MAX_LENGTH}} tecken)',
    year: 'Välj år',
    pdfExportText: 'Svar_på_självbedömningsblanketten',
    reportPage: 'Svar på självbedömningsblanketten',
    downloadPDF: 'Ladda ner svaren i en PDF-fil',
    statusHeader: 'Svar från året {{year}} kan redigeras.',
    statusMessage: 'År kan väljas i rullgardinsmenyn nedanför rubriken. Sista dagen blanketten kan svaras på är:',

    csvFileformwritten: 'Skriftliga_svar',
    csvFileformcolors: 'Trafikljus',
    csvFileoverviewwritten: 'Alla_program_skriftliga_svar',
    csvFileoverviewcolors: 'Alla_program_trafikljus',
    colors: 'Trafikljus', // check
    written: 'Skriftliga svar', // check

    level: {
      programmes: 'Utbilndingsprogram',
      faculties: 'Fakultet',
      university: 'Universitet',
      committee: 'Kommitté',
    },
    textUnsaved: '',
  },

  overview: {
    betterThanLastYear: 'Bättre än förra året',
    worseThanLastYear: 'Värre än förra året',
    formLocked: 'Blanketten är låst',
    formUnlocked: 'Blanketten kan redigeras',
    unlockForm: 'Tillåt redigering',
    lockForm: 'Lås blanketten (hindrar redigering)',
    overviewPage: 'Blankett - översikt',
    accessRights: 'Åtkomsträttigheter',
    selectYear: 'Välj ett år att granska',
    readAnswers: 'Läs svar',
    compareAnswers: 'Jämför svar',
    csvDownload: 'Ladda ner CSV',
    name: 'Namn',
    view: 'Läs',
    edit: 'Redigera',
    owner: 'Ägare',
    noUsers: 'Inga användare',
    userListJory: 'Ledningsgruppmedlemmar som har fått tillgång till blanketten',
    userListOthers: 'Övriga användare med programåtkomsträttigheter, som har fått tillgång till blanketten',
    // facultySummary: '',
    pcs: 'st',
    // chooseFaculty: '',
  },

  report: {
    pdfNotification: 'Endest de frågorna och svaren som väljs här kommer på PDF-utskriften',
    facultyFilter: 'Filtrera enligt fakultet',
    reportPage: 'Svar',
    selectQuestions: 'Filtrera bort frågor',
    clickToCheck: 'Se skriftliga svar',
    question: 'Fråga',
    answered: 'Svarat',
    //  improvementAreas: '',
    //  improvementActions: '',
  },

  users: {
    nextDeadline: 'Nästa deadline:',
    answersSavedForYear: 'Svaren sparas till året:',
    contactToska: 'Om du vill ändra på deadlinen, vänligen kontakta Toska (grp-toska@helsinki.fi).',
    noDeadlineSet: 'Ingen deadline har angetts för detta år, eller så har den gått ut',
    selectNewDeadline: 'Välj ny deadline',
    selectDraftYear: 'Välj redigeringsår: ',
    deadlineWarning:
      'Blanketten är redan öppen för ett annat år. Lås formuläret innan du öppnar ett nytt år, så att uppgifterna sparas ordentligt.',
    updateDeadline: 'Uppdatera deadline',
    deleteThisDeadline: 'Ta bort deadline',
    noDraftYear: 'Inget år har valts',
    adminPage: 'Blankett - administrationssida',
    users: 'Användare',
    iams: 'IAM-grupper',
    deadline: 'Deadline',
    updateStudyprogrammes: 'Uppdatera undervisningsprogram',
    deadlineSettings: 'Hantera deadline',
    moreProgrammes_one: 'annat program',
    moreProgrammes_two: 'annat program',
    moreProgrammes_other: 'annat program',
    special: {
      access_accessAllProgrammes: 'Alla program',
      access_accessInternational2020: 'Internationella magisterprogram 2020 ->',
      access_accessInternational: 'Internationella magisterprogram',
      access_accessDoctoral: 'Alla doktorandprogram',
      //  access_accessEvaluationFaculty: '',
    },
    basicUser: 'Vanlig användare',
    superAdmin: 'Super admin',
    searchByName: 'Sök användare enligt namn',
    filterByAccess: 'Sök enligt utbildningsprogram',
    name: 'Namn',
    userId: 'Användar-ID',
    access: 'Rättigheter',
    userGroup: 'Användargrupp',
    lastLogin: 'Senast inloggad',
    specialGroup: 'Åtkomstgrupper',
    role: 'Huvudroll',

    // tempAccess: '',
    // tempAccessMangement,
    // tempAccessInfo:,
    // tempAccessNote:,
    // receiverEmail: 'Oikeuden saajan helsinki.fi-sähköpostiosoite',
    // accessProgramme: 'Koulutusohjelma, johon oikeudet annetaan',
    // endOfAccess: 'Käyttöoikeuden viimeinen voimassaolopäivä',
    // kojoEmail: 'Koulutusohjelman johtajan sähköpostiosoite',
    // giveWritingRights: 'Anna kirjoitusoikeudet',
    // saveRight: 'Tallenna oikeus',
    // tempAccesses: 'Annetut väliaikaiset oikeudet',
    // expired: 'Näytä vanhentuneet',
    // writingRight: 'Kirjoitusoikeus',
    // endsIn: 'Päättyy',
    // confirm: '',
  },
}
