
export const comparisonPageTranslations = {
  comparisonPage: {
    fi: 'Vastausten vertailu ja kehitys',
    en: 'Compare answers',
    se: 'Compare answers',
  },
  reportHeader: {
    comparison: {
      fi: 'Vertaile tiedekuntaan',
      en: 'Compare to the faculty',
      se: 'Compare to the faculty',
    }
  },
  // ReportPage/Comparison.js
  chosenProgrammes: {
    fi: 'Valittu ohjelma',
    en: 'Chosen programme',
    se: 'Chosen programme',
  },
  comparedProgrammes: {
    fi: 'Vertaile tiedekuntaan',
    en: 'Compare to a faculty',
    se: 'Compare to a faculty',
  },
  chooseProgramme: {
    fi: 'Valitse vertailtava ohjelma',
    en: 'Choose a programme for comparison',
    se: 'Choose a programme for comparison',
  },
  noChosenProgrammes: {
    fi: 'Ei yhtään ohjelmaa vielä valittuna',
    en: 'No programmes have yet been chosen',
    se: 'No programmes have yet been chosen',
  },
  noAccessToAll: {
    fi: 'Huomioithan, että verrokkina näkyy vain niiden ohjelmien tiedot, joihin sinulla on lukuoikeus',
    en: 'Please note, that you can only see comparison with the programmes you have reading rights to',
    se: 'Please note, that you can only see comparison with the programmes you have reading rights to',
  },
  university: {
    fi: 'Koko yliopisto',
    en: 'Entire university',
    se: 'Entire university',
  },
  emptyAnswers: {
    en: 'Include programmes without answers to the graphs',
    fi: 'Ota mukaan koulutusohjelmat, jotka eivät ole vastanneet kysymykseen',
    se: 'Include programmes without answers to the graphs',
  },
  // ComparisonPage/PieChart.js
  responses: {
    en: 'Responses:',
    fi: 'Vastauksia:',
    se: 'Responses:',
  },
  noData: {
    fi: 'Yhtään ohjelmia tai vastauksia ei löytynyt. Kokeile muuttaa hakua.',
    en: 'No data available for these choices',
    se: 'No data available for these choices',
  },
  positive: {
    en: 'No issues',
    fi: 'Kunnossa',
    se: 'I sin ordning',
  },
  neutral: {
    en: 'Challenges identified and development underway',
    fi: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    se: 'Utmaningarna har identifierats och utvecklingsarbete pågår',
  },
  negative: {
    en: 'Significant measures required/development areas not yet specified',
    fi: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    se: 'Kräver betydande åtgärder/utvecklingsobjekten har inte preciserats',
  },
  empty: {
    en: 'No answer provided',
    fi: 'Ei vastausta',
    se: 'Inget svar',
  },
  noColors: {
    fi: '*Kysymyksiä, joille ei ole määritetty hymiöitä, ei näytetä ollenkaan (esim. 16 ja 17)',
    en: 'Questions, without smileys are not shown here',
    se: 'Questions, without smileys are not shown here',
  },
}

export const claimAccessTranslations = {
  // ClaimAccessPage/index.js
  prompt: {
    fi: 'Olet vastaanottamassa oikeuksia',
    en: 'You are claiming permissions',
    se: 'Du håller på att ta emot åtkomst',
  },
  buttonText: {
    fi: 'Vastaanota',
    en: 'Claim',
    se: 'Ta emot',
  },
  confirmPrompt: {
    fi: 'Ole hyvä ja kirjoita ohjelman nimi suomeksi yllä olevaan laatikkoon varmistusta varten',
    en: "Please write the programme's name in English to the input above to confirm",
    se: 'Vänligen skriv programmets namn på svenska i fältet ovanför verifiering',
  },
  rights: {
    ADMIN: {
      fi: 'Ylläpitäjän oikeudet',
      en: 'Admin access',
      se: 'Administrativ åtkomst',
    },
    WRITE: {
      fi: 'Vastausoikeudet',
      en: 'Edit access',
      se: 'Redigeringsåtkomst',
    },
    READ: {
      fi: 'Lukuoikeudet',
      en: 'Read access',
      se: 'Skrivskyddad åtkomst',
    },
  },
  invalidToken: {
    fi:
      'Virhe: Käyttämäsi linkki ei ole enää voimassa. Ole hyvä ja ota yhteys koulutusohjelmasi johtajaan uutta linkkiä varten.',
    en:
      'Error: The url you tried to access in no longer valid. Please contact your study programme leader for a new one.',
    se:
      'Fel: Länken du använde gäller inte längre. Vänligen kontakta ledaren för ditt utbildningsprogram för att få en ny länk.',
  },
  claimPermissions: {
    en: 'Form - Claim permissions',
    fi: 'Lomake - Vastaanota oikeuksia',
    se: 'Blankett - ta emot åtkomster',
  },
}

export const formViewTranslations = {
  // FormView/index.js
  title: {
    en: 'DOCUMENTATION OF THE CURRENT STATUS OF DEGREE PROGRAMME',
    fi: 'KOULUTUSOHJELMAN TILANNEKUVAN DOKUMENTOINTI',
    se: 'DOKUMENTATION AV UTBILDNINGSPROGRAMMETS LÄGESBESKRIVNING',
  },
  p1: {
    en: 'Please discuss the topics below in the steering group of the degree programme. The questions are intended to spark discussion, and the purpose is not to answer them as such.',
    fi: 'Käykää koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista. Aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata.',
    se: 'Diskutera formulärets teman i utbildningsprogrammets ledningsgrupp. Frågorna kring de olika temana är avsedda att stimulera till diskussion; de ska alltså inte besvaras som sådana.',
  },
  p2: {
    en: 'Please provide an overall assessment of the programme’s current status (“Where are we now?”) with regard to each topic using the following system of emoji:',
    fi: 'Antakaa yleisarvio ”Missä mennään?” -kunkin aiheen kohdalla (liikennevalot):',
    se: 'Ge en allmän bedömning av läget för varje tema med hjälp av smilis',
  },
  positive: {
    en: 'No issues',
    fi: 'Kunnossa',
    se: 'I sin ordning',
  },
  neutral: {
    en: 'Challenges identified and development underway',
    fi: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    se: 'Utmaningarna har identifierats och utvecklingsarbete pågår',
  },
  negative: {
    en: 'Significant measures required/development areas not yet specified',
    fi: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    se: 'Kräver betydande åtgärder/utvecklingsobjekten har inte preciserats',
  },
  empty: {
    en: 'No answer provided',
    fi: 'Ei vastausta',
    se: 'Inget svar',
  },
  form: {
    en: 'Form',
    fi: 'Lomake',
    se: 'Blankett',
  },
  csvDownload: {
    fi: 'Lataa vastaukset csv-tiedostona',
    en: 'Download all data as a CSV file',
    se: 'Ladda ner svaren i en csv-fil',
  },
  // FormView/NavigationSidebar.js
  OK: {
    fi: 'Vastattu',
    en: 'Answer given',
    se: 'Svaret lämnat',
  },
  EMPTY: {
    fi: 'Ei vastausta',
    en: "There's no answer",
    se: 'Inget svar',
  },
  mandatory_field: {
    fi: 'pakollinen kenttä',
    en: 'required field',
    se: 'obligatoriskt fält',
  },
  // Formview/PDFDownload.js
  downloadText: {
    fi: 'Tulosta / Lataa vastaukset PDF-tiedostona',
    en: 'Print / Download answers as a PDF-file',
    se: 'Skriv ut / Ladda ner svaren i en PDF-fil',
  },
  setViewOnlyTrueText: {
    fi: 'Tulostus/PDF -näkymä',
    en: 'Print/Download as PDF view',
    se: 'Utskriftsläge/Pdf-vy',
  },
  setViewOnlyFalseText: {
    fi: 'Palaa täyttämään lomaketta',
    en: 'Back to edit view',
    se: 'Återgå till redigeringsläge',
  },
  // Formview/StatusMessage.js
  savingAnswersNotice: {
    fi: 'Vastaukset tallentuvat automaattisesti. Eräpäivä:',
    en: 'Answers are saved automatically. Deadline:',
    se: 'Svaren sparas automatiskt.',
  },
  savingAnswersSubtitle: {
    fi: 'Viimeksi tallennettu',
    en: 'Last saved',
    se: 'Senast sparat',
  },
  lockedFormNotice: {
    fi: 'Lomake on lukittu, eikä sitä voi muokata.',
    en: 'The form has been locked and it cannot be edited.',
    se: 'The form has been locked and it cannot be edited.',
  },
  lockedFormSubtitle: {
    fi: 'Lomakkeen omistaja voi vielä avata lomakkeen ennen sen eräpäivää',
    en: 'The owner of the form may still unlock the form before its deadline',
    se: 'The owner of the form may still unlock the form before its deadline.',
  },
  deadlinePassedNotice: {
    fi: 'Lomakeen täyttöaika on päättynyt.',
    en: 'The deadline to edit form has passed.',
    se: 'The deadline to edit form has passed.',
  },
  deadlinePassedSubtitle: {
    fi: 'OSPA käsittelee vastaukset.',
    en: 'OSPA will process the answers.',
    se: 'OSPA will process the answers.',
  },
}

export const genericTranslations = {
  programmeHeader: {
    fi: 'Koulutusohjelma',
    en: 'Programme',
    se: 'Program',
  },
  faculty: {
    fi: 'Tiedekunta',
    en: 'Faculty',
    se: 'Fakultet',
  },
  csvFile: {
    form: {
      written: {
        fi: 'Tilannekuvalomake_kirjalliset_vastaukset',
        en: 'Written_answers',
        se: 'Written_answers',
      },
      smileys: {
        fi: 'Tilannekuvalomake_liikennevalot',
        en: 'Colored_smileys',
        se: 'Colored_smileys',
      },
    },
    overview: {
      written: {
        fi: 'Tilannekuvalomake_kaikki_ohjelmat_kirjalliset_vastaukset',
        en: 'All_the_programmes_written_answers',
        se: 'All_the_programmes_written_answers',
      },
      smileys: {
        fi: 'Tilannekuvalomake_kaikki_ohjelmat_liikennevalot',
        en: 'All_the_programmes_colored_smileys',
        se: 'All_the_programmes_colored_smileys',
      },
    },
  },
  green: {
    fi: 'Vihreä',
    en: 'Green',
    se: 'Grön',
  },
  yellow: {
    fi: 'Keltainen',
    en: 'Yellow',
    se: 'Gul',
  },
  red: {
    fi: 'Punainen',
    en: 'Red',
    se: 'Röd',
  },
  csvLink: {
    written: {
      fi: 'Kirjalliset vastaukset',
      en: 'Written answers',
      se: 'Written answers',
    },
    smileys: {
      fi: 'Hymiöiden värit',
      en: 'Emoji colors',
      se: 'Emoji colors',
    },
  },
  // Generic/Entity.js
  streetLightsLabel: {
    fi: 'Yleisarvio',
    en: 'General assessment',
    se: 'Allmänn bedömning',
  },
  textAreaLabel: {
    fi: 'Keskustelun pääkohdat olivat',
    en: 'Main points of discussion',
    se: 'Diskussionens huvudpunkter',
  },
  // Generic/FacultyFilter.js
  facultyFilter: {
    en: 'Filter by faculty',
    fi: 'Vastaukset tiedekunnittain',
    se: 'Filter by faculty',
  },
  // Generic/LastYearsAnswersAccordion.js
  expandText: {
    fi: 'Näytä viime vuoden vastaukset',
    en: 'Show answers from last year',
    se: 'Visa fjolårets svar',
  },
  collapseText: {
    fi: 'Piilota viime vuoden vastaukset',
    en: 'Hide answers from last year',
    se: 'Dölj fjolårets svar',
  },
  // Generic/LevelFilter.js
  allProgrammes: {
    en: 'All programmes',
    fi: 'Kaikki ohjelmat',
    se: 'Alla program',
  },
  levelFilter: {
    en: 'Filter by programme level',
    fi: 'Vastaukset koulutusasteittain',
    se: 'Filter by programme level',
  },
  bachelor: {
    fi: 'Kandiohjelmat',
    en: "Bachelor's programmes",
    se: 'Kandidatsprogram',
  },
  master: {
    fi: 'Maisteriohjelmat',
    en: "Master's programmes",
    se: 'Magisterprogram',
  },
  doctoral: {
    fi: 'Tohtoriohjelmat',
    en: 'Doctoral programmes',
    se: 'Doktorandprogram',
  },
  international: {
    fi: 'Kansainväliset maisteriohjelmat',
    en: "International Master's programmes",
    se: 'Internationella Magisterprogram',
  },
  // Generic/Measures.js
  measureLabel: {
    fi: 'Lisää 1-5 toimenpidettä',
    en: 'Add 1-5 measures',
    se: 'Lägg till 1–5 åtgärder',
  },
  addButtonLabel: {
    fi: 'Lisää toimenpide',
    en: 'Add measure',
    se: 'Lägg till åtgärd',
  },
  removeButtonLabel: {
    fi: 'Poista toimenpide',
    en: 'Remove measure',
    se: 'Ta bort åtgärd',
  },
  // Generic/NoPermissions.js
  noPermissions: {
    fi:
      'Sinulla ei ole oikeuksia millekään koulutusohjelmalle. Ota yhteyttä opetuksen strategisiin palveluihin tai koulutusohjelman johtajaan.',
    en:
      "You have no permissions for any study programmes. Please contact Strategic Services for Teaching or your study programme's leader.",
    se: 'Ingen åtkomst. För att få åtkomst, kontakta utbildningsprogrammets ledare.',
  },
  // Generic/ProgrammeFilter.js
  programmeFilter: {
    en: 'Search for specific programmes',
    fi: 'Etsi koulutusohjelmia',
    se: 'Search for specific programmes',
  },
  filter: {
    fi: 'Etsi koulutusohjelmia',
    en: 'Search for study programmes',
    se: 'Filtrera',
  },
  // Generic/TextArea.js
  loading: {
    fi: 'Valmistellaan tekstieditoria, odota hetki...',
    se: '',
    en: 'Preparing the texteditor, please wait a moment...',
  },
  // Generic/YearSelector.js
  selectYear: {
    en: 'Select the year you would like to inspect',
    fi: 'Valitse vuosi jota haluat tarkastella',
    se: '',
  },
}

export const overviewPageTranslations = {
  // OverviewPage/index.js
  overviewPage: {
    fi: 'Lomake - Yleisnäkymä ',
    en: 'Form - Overview',
    se: 'Blankett - översikt',
  },
  accessControl: {
    fi: 'Käytönhallinta',
    en: 'Access Control',
    se: '',
  },
  csvDownload: {
    fi: 'Lataa vastaukset csv-tiedostona',
    en: 'Download all data as a CSV file',
    se: 'Ladda ner svaren i en csv-fil',
  },
  filter: {
    fi: 'Etsi koulutusohjelmia',
    en: 'Search for study programmes',
    se: 'Filtrera',
  },
  showProgressFromLastYear: {
    fi: 'Näytä kehitys viime vuodesta',
    en: 'Show progress from last year',
    se: 'Show progress from last year',
  },
  showUnclaimedOnly: {
    fi: 'Näytä vain lunastamattomat koulutusohjelmat',
    en: 'Show only unclaimed programmes',
    se: 'Visa enbart program som inte tagits emot',
  },
  // OverviewPage/FormLocker.js
  lockForm: {
    en: 'Lock form (prevents editing)',
    fi: 'Lukitse lomake',
    se: 'Lås blanketten (hindrar redigering)',
  },
  unLockForm: {
    en: 'Unlock form',
    fi: 'Poista lukitus',
    se: 'Tillåt redigering',
  },
  lockedTriggerButtonText: {
    en: 'Form is locked',
    fi: 'Lomake on lukittu',
    se: 'Blanketten är låst',
  },
  unlockedTriggerButtonText: {
    en: 'Form can be edited',
    fi: 'Lomaketta voi muokata',
    se: 'Blanketten kan redigeras',
  },
  // OverviewPage/ProgramControlLinks.js
  editPrompt: {
    fi:
      'Linkin kautta kirjautumalla (HY-tunnukset) käyttäjä saa kirjoitusoikeuden (jaa vain lomakkeen täyttäjille).',
    en: 'Link grants edit access, share to editors only:',
    se:
      'Med länken får man redigerinsåtkomst. Dela endast till personer som ska fylla i blanketten:',
  },
  viewPrompt: {
    fi: 'Linkin kautta kirjautumalla (HY-tunnukset) käyttäjä saa lukuoikeuden (jaa esim. johtoryhmän jäsenille).',
    en: 'Link grants read access, share e.g. to student members',
    se: 'Med länken får man skrivskyddad åtkomst. Dela exempelvis till ledningsgruppen:',
  },
  copyPrompt: {
    fi: 'Kopioi linkki',
    en: 'Copy link',
    se: '',
  },
  resetPrompt: {
    fi: 'Nollaa ja luo uusi jakolinkki',
    en: 'Reset the current link, and generate a new one',
    se: 'Återställ länken och skapa en ny',
  },
  createPrompt: {
    fi: 'Luo linkki',
    en: 'Create link',
    se: 'Skapa länk',
  },
  resetWarning: {
    fi: 'Linkin nollaaminen estää vanhan linkin käyttämisen välittömästi. Oletko varma että haluat tehdä tämän?',
    en: 'Resetting the link deactivates the old link immediately. Are you sure you with to do this?',
    se: 'Resetting the link deactivates the old link immediately. Are you sure you with to do this?',
  },
  copyLink: {
    fi: 'Kopioi linkki',
    en: 'Copy link',
    se: 'Kopiera länk',
  },
  readAccess: {
    fi: 'Lukuoikeus',
    en: 'Read Access',
    se: 'Skrivskyddad åtkomst',
  },
  writeAccess: {
    fi: 'Kirjoitusoikeus',
    en: 'Write Access',
    se: 'Redigeringsåtkomst',
  },
  // OverviewPage/ProgramControlsUsers.js
  nameHeader: {
    fi: 'Nimi',
    en: 'Name',
    se: 'Namn',
  },
  viewHeader: {
    fi: 'Luku',
    en: 'Read',
    se: 'Läs',
  },
  editHeader: {
    fi: 'Vastaus',
    en: 'Edit',
    se: 'Redigera',
  },
  ownerHeader: {
    fi: 'Omistaja',
    en: 'Owner',
    se: 'Ägare',
  },
  grantAccess: {
    fi: 'Anna oikeus',
    en: 'Grant access right',
    se: 'Ge åtkomst',
  },
  removeAccess: {
    fi: 'Poista oikeus',
    en: 'Remove access right',
    se: 'Ta bort åtkomst',
  },
  noUsers: {
    fi: 'Ei käyttäjiä, käytä ylläolevia linkkejä kutsumiseen',
    en: 'No users, use the links above to invite',
    se: 'Inga användare. Använd ovanstående länkar för att bjuda in användare.',
  },
  userList: {
    fi: 'Käyttäjät',
    en: 'Users',
    se: 'Users',
  },
  //OverviewPage/SmileyTable.js
  openManageText: {
    fi: 'Hallitse',
    en: 'Manage',
    se: 'Administrera',
  },
  closeManageText: {
    fi: 'Piilota',
    en: 'Hide',
    se: 'Dölj',
  },
  noResultsText: {
    fi: 'Yhtään ohjelmaa ei löytynyt. Kokeile muuttaa hakua.',
    en: 'No matching programmes were found. Please try a different filter.',
    se: 'Inga program hittades. Prova att söka med andra kriterier.',
  },
  programmeClaimed: {
    fi: 'Tämä ohjelma on vastaanotettu',
    en: 'This programme has been claimed',
    se: 'Programmet har tagits emot',
  },
  programmeNotClaimed: {
    fi: 'Tätä ohjelmaa ei ole vastaanotettu',
    en: 'This programme has not been claimed',
    se: 'Programmet har inte tagits emot',
  },
  programmeLocked: {
    fi: 'Tämän ohjelman muokkaus on estetty.',
    en: 'This programme has been locked.',
    se: 'This programme has been locked.',
  },
  programmeHeader: {
    fi: 'Koulutusohjelma',
    en: 'Programme',
    se: 'Program',
  },
}

export const reportPageTranslations = {
  // ReportPage/index.js
  reportPage: {
    fi: 'Tilannekuvalomakkeen vastaukset',
    en: 'Answers',
    se: 'Answers',
  },
  nowShowing: {
    fi: 'VASTAUKSISSA MUKANA OLEVAT OHJELMAT:',
    en: 'NOW SHOWING THE ANSWERS OF',
    se: 'NOW SHOWING THE ANSWERS OF',
  },
  chooseMore: {
    fi: 'VALITSE OHJELMAT RAPORTILLE:',
    se: 'CHOOSE MORE PROGRAMMES:',
    en: 'CHOOSE MORE PROGRAMMES:',
  },
  selectAll: {
    fi: 'Valitse kaikki',
    se: 'Select all',
    en: 'Select all',
  },
  clearSelection: {
    fi: 'Tyhjennä valinta',
    se: 'Clear selection',
    en: 'Clear selection',
  },
  reportHeader: {
    written: {
      en: 'Written answers',
      fi: 'Kirjalliset vastaukset',
      se: 'Written answers',
    },
    smileys: {
      en: 'Smiley colors',
      fi: 'Hymiöiden värit',
      se: 'Smiley colors',
    },
  },
  answered: {
    en: 'Answered',
    fi: 'Vastattu',
    se: 'Svarat',
  },
  allProgrammes: {
    en: 'All programmes',
    fi: 'Kaikki ohjelmat',
    se: 'Alla program',
  },
  // ReportPage/PieChart.js
  responses: {
    en: 'Responses:',
    fi: 'Vastauksia:',
    se: 'Responses:',
  },
  // ReportPage/WrittenAnswers.js
  questions: {
    fi: 'Kysymys',
    en: 'Question',
    se: 'Fråga',
  },
  // ReportPage/SmileyAnswers.js
  // ReportPage/PieChart.js
  emptyAnswers: {
    en: 'Include programmes without answers to the graphs',
    fi: 'Ota mukaan koulutusohjelmat, jotka eivät ole vastanneet kysymykseen',
    se: 'Include programmes without answers to the graphs',
  },
  noData: {
    fi: 'Yhtään ohjelmia tai vastauksia ei löytynyt. Kokeile muuttaa hakua.',
    en: 'No data available for these choices',
    se: 'No data available for these choices',
  },
  positive: {
    en: 'No issues',
    fi: 'Kunnossa',
    se: 'I sin ordning',
  },
  neutral: {
    en: 'Challenges identified and development underway',
    fi: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    se: 'Utmaningarna har identifierats och utvecklingsarbete pågår',
  },
  negative: {
    en: 'Significant measures required/development areas not yet specified',
    fi: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    se: 'Kräver betydande åtgärder/utvecklingsobjekten har inte preciserats',
  },
  empty: {
    en: 'No answer provided',
    fi: 'Ei vastausta',
    se: 'Inget svar',
  },
  noColors: {
    fi: '*Kysymyksiä, joille ei ole määritetty hymiöitä, ei näytetä ollenkaan (esim. 16 ja 17)',
    en: 'Questions, without smileys are not shown here',
    se: 'Questions, without smileys are not shown here',
  },
}

export const usersPageTranslations = {
  adminPage: {
    en: 'Form - Admin-page',
    fi: 'Lomake - Ylläpito-sivu',
    se: 'Blankett - administrationssida',
  },
  users: {
    en: 'Users',
    fi: 'Käyttäjät',
    se: 'Users',
  },
  deadline: {
    en: 'Deadline',
    fi: 'Määräaika',
    se: 'Deadline'
  },
  linksForOwners: {
    en: 'Links for owners',
    fi: 'Ylläpitäjien linkit',
    se: 'Links for owners',
  },
  linksForFaculties: {
    en: 'Links for faculties',
    fi: 'Tiedekuntien linkit',
    se: 'Links for faculties',
  },
  linksForDoctoral: {
    en: 'Links for doctoral programmes',
    fi: 'Tohtoriohjelmien linkit',
    se: 'Links for doctoral programmes',
  },
  doctorMessage: {
    en: 'The links listed here give READ-permissions all DOCTOR-programmes under the respective faculty.',
    fi: 'Tässä olevat linkit antavat lukuoikeudet KAIKKIIN kyseisen tiedekunnan tohtoriohjelmiin',
    se: 'The links listed here give READ-permissions all DOCTOR-programmes under the respective faculty.',
  },
  facultyMessage: {
    en: 'The links listed here give READ-permissions to all studyprogrammes under the respective faculty.',
    fi: 'Tässä olevat linkit antavat lukuoikeudet KAIKKIIN kyseisen tiedekunnan ohjelmiin',
    se: 'The links listed here give READ-permissions to all studyprogrammes under the respective faculty.',
  },
  ownerMessage: {
    en: 'The links listed here give ADMIN-permissions and can be used one time only. Only programmes that have yet not been claimed are listed here.',
    fi: 'Tässä olevat linkit antavat ADMIN-oikeudet kyseiseen ohjelmaan. Linkkiä voi käyttää vain kerran, ja listalla näkyy ainoastaan ne ohjelmat, joita ei vielä ole lunastettu.',
    se: 'The links listed here give ADMIN-permissions and can be used one time only. Only programmes that have yet not been claimed are listed here.',
  },
  code: {
    en: 'Code',
    fi: 'Koodi',
    se: 'Code',
  },
  faculty: {
    en: 'Faculty',
    fi: 'Tiedekunta',
    se: 'Faculty',
  },
  shareUrl: {
    en: 'Share-URL',
    fi: 'Linkki',
    se: 'Share-URL',
  },
  deadlineSettings: {
    en: 'Deadline settings',
    fi: 'Määräaika-asetukset',
    se: 'Hantera deadline',
  },
  selectNewDeadline: {
    en: 'Select new deadline',
    fi: 'Valitse uusi määräaika',
    se: 'Välj ny deadline',
  },
  updateDeadline: {
    en: 'Update deadline',
    fi: 'Päivitä määräaika',
    se: 'Uppdatera deadline',
  },
  nextDeadline: {
    en: 'Next deadline:',
    fi: 'Seuraava määräaika:',
    se: 'Nästa deadline:',
  },
  noDeadlineSet: {
    en: 'No deadline set.',
    fi: 'Määräaikaa ei ole asetettu.',
    se: 'Ingen deadline vald.',
  },
  deleteThisDeadline: {
    en: 'Freeze the form',
    fi: 'Lukitse lomake',
    se: 'Ta bort deadline',
  },
  grantAdmin: {
    en: 'Grant admin rights',
    fi: 'Myönnä admin-oikeudet',
    se: 'Grant admin rights',
  },
  removeAdmin: {
    en: 'Remove admin rights',
    fi: 'Poista admin-oikeudet',
    se: 'Remove admin rights',
  },
  markIrrelevant: {
    en: 'Mark as irrelevant',
    fi: 'Merkitse tarpeettomaksi',
    se: 'Mark as irrelevant',
  },
  markRelevant: {
    en: 'Mark as relevant',
    fi: 'Poista piilottaminen',
    se: 'Mark as irrelevant',
  },
  searchByName: {
    en: 'Search users by name',
    fi: 'Etsi käyttäjiä',
    se: 'Search users by name',
  },
  filterByAccess: {
    en: 'Filter users by access',
    fi: 'Etsi oikeuksien perusteella',
    se: 'Filter users by access',
  },
  name: {
    en: 'Name',
    fi: 'Nimi',
    se: 'Name',
  },
  userId: {
    en: 'User id',
    fi: 'Käyttäjätunnus',
    se: 'User id',
  },
  email: {
    en: 'Email',
    fi: 'Sähköposti',
    se: 'Email',
  },
  access: {
    en: 'Access',
    fi: 'Oikeudet',
    se: 'Access',
  },
  admin: {
    en: 'Admin',
    fi: 'Admin',
    se: 'Admin',
  },
  hide: {
    en: 'Hide',
    fi: 'Piilota',
    se: 'Hide',
  },
}