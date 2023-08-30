export default {
  common: {
    logOut: 'Logga ut',
    backToFrontPage: 'Tillbaka till framsidan',
    chosenLanguage: 'Svenska',
    form: 'Blankett',
    positive: 'I sin ordning',
    neutral: 'Utbildningsprogrammet är medvetet om utmaningarna och utvecklingsarbete pågår ',
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
    international: 'Internationella Magisterprogram',
    programmeFilter: 'Sök utbildningsprogram',
    facultyFilter: 'Sök',

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

    yearlyAssessment: 'Årlig utvärdering',
    evaluation: 'Katselmus',
    'degree-reform': 'Koulutusuudistus',
    'degree-reform-group': 'Koulutusuudistus - ohjelmat',
    'degree-reform-individual': 'Koulutusuudistus - yksilö',
    'read-more': 'Läs mer',
    'read-less': 'Läs mindre',
    otherTextBox: 'Något annat, vilket?',
    send: 'Skicka',
    what: 'Vad',
    chooseFaculty: 'Välj en fakultet',
    chooseProgramme: 'Välj ett studieprogram',
    showAllProgrammes: 'Visa alla studieprogram',
    showDataByProgramme: 'Visa data per studieprogram',
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
    savingAnswers: 'Svaren sparas automatiskt. Sista dagen för att svara på blanketten:',
    noSystemsSelected: 'Inget responssystem har valts',
    // selectSystems: '',
    // mostUseful: '',
    developmentArea: 'Utvecklingsobjekt',
    actions: 'Åtgärdsförslag',
    // requiredActions: '',
    addDevelopmentArea: 'Lägg till utvecklingsobjekt', // Not from translation (FIX?)
    // removeDevelopmentArea: '',
    allYearlyAnswerYears: 'Alla år i årsuppföljningen',
    evaluationInfo1:
      'I översynen granskas läget för utbildningsprogrammet på ett mer omfattande plan i fråga om <strong>de senaste tre åren</strong>.',
    evaluationInfo2:
      'Diskutera formulärets teman i utbildningsprogrammets ledningsgrupp. Observera att <strong> 2023 års årsuppföljning ska vara slutförd innan översynsformuläret fylls i</strong>.',
    selectApplicable: 'Välj alla lämpliga alternativ',
    // addMissing: '',
    progSummaryTitle: 'Svaren på årsuppföljningens frågor om temat under observationsperioden',
    // facultySummaryTitle: '',
    materials: 'Bakgrundsmaterial',
    materialsProg:
      'Via länken nedan kan ni läsa alla svar som antecknats i samband med årsuppföljningen.<br/>På detta formulär har det dessutom till flera av frågorna bifogats en sammanfattning av de senaste tre årens svar på årsuppföljningens frågor om respektive tema.<br/>Till stöd för översynen har det skapats en vy i Oodikone. I vyn har det sammanställts central statistik om studenterna vid ert utbildningsprogram och er fakultet samt om studenternas studieframsteg. Nedan finns en länk till vyn på både program- och fakultetsnivå. ',
    summaryLinkProg: 'Granska alla svar från tidigare årsuppföljningar',
    oodikoneProg: 'Granska utbildningsprogrammets uppgifter i Oodikone',
    oodikoneFaculty: 'Granska fakultetens uppgifter i Oodikone',
    // rapo: '',
    // facultyInfo: '',
    // materialsFaculty: '',
    // yearlyAnswers: '',
    // formReady: '',
    // sendNewForm: '',
    // modifyForm: '',
    // sendForm: '',
    // sendFormModalHeader: '',
    // sendFormModalDescription: '',
    stronglyDisagree: 'Helt av annan åsikt',
    partiallyDisagree: 'Delvis av annan åsikt',
    neitherNor: 'Varken av samma eller av annan åsikt',
    partiallyAgree: 'Delvis av samma åsikt',
    stronglyAgree: 'Helt av samma åsikt / kan inte säga',
  },

  generic: {
    companionFilter: 'Inkludera i svaren fakultetens samarbetsprogram',
    isWriting: 'skriver',
    allDoctoralSchools: 'Alla doktorandprogram',
    doctoralSchoolFilter: 'Filtrera enligt forskarskola',
    socialSchool: 'Humanistisk-samhällsvetenskapliga forskarskolan',
    sciencesSchool: 'Naturvetenskapliga forskarskolan',
    healthSchool: 'Forskarskolan i hälsoforskning',
    environmentalSchool: 'Miljö-, livsmedels- och biovetenskapliga forskarskolan',
    textAreaLabel: 'Diskussionens huvudpunkter',
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

    // level: {
    //   programmes: '',
    //   faculties: '',
    //   university: '',
    //   committee: '',
    // },
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
  },

  report: {
    pdfNotification: 'Endest de frågorna och svaren som väljs här kommer på PDF-utskriften',
    facultyFilter: 'Filtrera enligt fakultet',
    reportPage: 'Svar',
    selectQuestions: 'Filtrera bort frågor',
    clickToCheck: 'Se skriftliga svar',
    question: 'Fråga',
    answered: 'Svarat',
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
