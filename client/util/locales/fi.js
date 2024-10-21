export default {
  // default namespace, can be used without prefix, ie. t('logOut')
  common: {
    // all use Finnish fallback for following
    adminPage: 'OSPA',
    about: 'About',
    admin: 'Admin',
    // end
    logOut: 'Kirjaudu ulos',
    backToFrontPage: 'Takaisin etusivulle',
    chosenLanguage: 'Suomi',
    form: 'Lomake',
    positive: 'Kunnossa',
    neutral: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    negative: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    noColors: '*Kysymyksiä, joille ei ole määritetty liikennevaloja, ei näytetä ollenkaan (esim. 16 ja 17)',
    green: 'Vihreä',
    yellow: 'Keltainen',
    red: 'Punainen',
    gray: 'Harmaa',
    all: 'Kaikki',
    EMPTY: 'Ei vastausta',
    empty: 'Ei vastausta',
    OK: 'Vastattu',
    lastSaved: 'Viimeksi tallennettu',
    lastSent: 'Viimeksi lähetetty',
    lastSentInThisRole: 'Ensisijainen rooli viimeksi lähetetyssä lomakkeessa',
    close: 'Sulje',

    faculty: 'Tiedekunta',
    programmeHeader: 'Koulutusohjelma',
    code: 'Koodi',
    allProgrammes: 'Kaikki ohjelmat',
    bachelor: 'Kandiohjelmat',
    master: 'Maisteriohjelmat',
    doctoral: 'Tohtoriohjelmat',
    bachelorShort: 'Kandi',
    masterShort: 'Maisteri',
    doctoralShort: 'Tohtori',
    international: 'Kansainväliset maisteriohjelmat',
    programmeFilter: 'Etsi koulutusohjelmia',
    facultyFilter: 'Etsi tiedekuntia',
    find: 'Etsi',

    noData: 'Yhtään ohjelmia tai vastauksia ei löytynyt. Kokeile muuttaa hakua.',
    noDataForFaculty: 'Yhtään tiedekuntaa tai vastauksia ei löytynyt. Kokeile muuttaa hakua.',
    selectAll: 'Valitse kaikki',
    clearSelection: 'Tyhjennä valinta',
    responses: 'Vastauksia:',
    writtenAnswers: 'Kirjalliset vastaukset',
    trafficLights: 'Liikennevalojen värit',
    tracking: 'Suunnittelu ja seuranta',
    chooseTrafficLight: 'Lisää uusi arvio',
    noTrafficLight: 'Ei arvioita. Lisää uusi liikennevaloarvio painamalla nappia.',

    choose: 'Valitse',
    colors_all: 'Kaikki',
    colors_green: 'Vain vihreät',
    colors_yellow: 'Vain keltaiset',
    colors_red: 'Vain punaiset',
    colors_gray: 'Vain harmaat',
    answers: 'vastaukset',

    email: 'Sähköpostiosoite',
    cancel: 'Peruuta',
    edit: 'Muokkaa',
    delete: 'Poista',

    modifyLights: 'Muokkaa valoja',

    yearlyAssessment: 'Vuosiseuranta',
    evaluation: 'Katselmus',
    evaluationFaculty: 'Tiedekunnan katselmus',
    'degree-reform': 'Koulutuksen nykytila',
    'degree-reform-group': 'Koulutuksen nykytila - ohjelmat',
    'degree-reform-individual': 'Koulutuksen nykytila - yksilö',
    'read-more': 'Näytä lisää',
    'read-less': 'Näytä vähemmän',
    otherTextBox: 'Muu, mikä?',
    send: 'Lähetä',
    what: 'Mikä',
    chooseFaculty: 'Valitse tiedekunta',
    chooseForm: 'Valitse lomake',
    chooseProgramme: 'Valitse koulutusohjelma',
    showAll: 'Näytä kaikki',
    showLess: 'Näytä vähemmän',
    showAllProgrammes: 'Näytä kaikki koulutusohjelmat',
    showDataByProgramme: 'Koulutusohjelmien vastaukset tiedekunnittain',
    showAllFacultyProgrammes: 'Näytä myös yhteisohjelmat',
    formFilter: {
      evaluation: 'Koulutusohjelmien katselmus tiedekunnittain',
    },
    metaevaluation: 'Toimenpiteiden priorisointi koulutusohjelmissa',
    facultymonitoring: 'Toimenpiteiden toteutus ja seuranta tiedekunnissa',
    formCloses: 'Lomake sulkeutuu',
    questionAnswers: 'Vastaukset kysymyksittäin',
    noAnswers: 'Ei vastauksia',
    actionProposals: 'Toimenpide-ehdotukset',
    urgent: 'Toimenpide on kriittisen tärkeä koulutusohjelman tulevaisuuden kannalta',
    semiUrgent: 'Toimenpide on tärkeä ja parantaa koulutusohjelman toimivuutta merkittävästi',
    nonUrgent: 'Toimenpide on kannatettava, mutta ei kriittinen koulutusohjelman tulevaisuuden kannalta',
    irrelevant: 'Ei koske tätä koulutusohjelmaa',
    metaEvaluationAnswers: 'Kirjalliset vastaukset',
    bm: 'Kandiohjelmat & maisteriohjelmat',
    t: 'Tohtoriohjelmat',
    showBoth: 'Vastaukset & kommentit',
    showOnlyAnswers: 'Vain vastaukset',
    showOnlyComments: 'Vain kommentit',
    yearlyAssessmentText: '',
    evaluationText: '',
    degreeReformText: '',
    metaevaluationText: '',
    adminpageText: '',
    timesensitive: 'Ajankohtaista',
    timesensitiveDesc: 'Auki olevien lomakkeiden viimeinen täyttöpäivä',
    description: 'Helsingin yliopiston opetushallinnon tilannekuvalomake',
    noTimesensitive: 'Voit tarkastella eri lomakkeiden vastauksia sivun yläreunassa olevien linkkien avulla.',
    clock: 'Kello',
    comment: 'Kommentti',
    answer: 'Vastaus',
    overview: 'Yleiskatsaus',
    bachelorMasterToggle: 'Kandi- ja maisteriohjelmat',
    doctoralToggle: 'Tohtoriohjelmat',
    toFrontpage: 'Etusivulle',
    noSelections: 'Ei valittuja toimenpiteitä',
    startDateEndDateError: 'Alkamisaika ei voi olla arvioitua päättymisaikaa myöhemmin',
    confirmRemoveLight: 'Haluatko varmasti poistaa',
  },

  aboutPage: {
    title: 'Tietoa lomakkeesta',
    whatIsIt: 'Mikä tilannekuvalomake on?',
    whatIsItReply:
      'Tilannekuvalomake on koulutusohjelman johtoryhmässä käytävän tilannekuvakeskustelun asialista ja keskustelun dokumentoinnin väline. Lomaketta käytetään Helsingin yliopistossa.',
    howToFillTitle: 'Miten tilannekuvalomake täytetään?',
    howToFill: ` 
    Tilannekuvalomakkeen aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata. 
    Lomakkeelle kirjataan lyhyesti muistiin keskustelun pääkohdat. Lisäksi laaditaan toimenpidelista ohjelmalle itselleen ja erillinen toimenpidelista tiedekunnan suunnitelmia varten.
    Kustakin aihealueesta annetaan yleisarvio (liikennevalot). Liikennevaloarvio on tarkoitettu keskustelun herättämistä varten, eikä sen perusteella tehdä johtopäätöksiä toiminnan laadusta.`,
    whatElseTitle: 'Mitä muuta lomakkeella voi tehdä?',
    whatElse:
      'Voit lukea oman ja muiden koulutusohjelmien tilannekuvien kirjallisia dokumentaatioita.  Raportointityökaluilla voit vertailla oman koulutusohjelmasi tietoja muiden tietoihin. Voit myös muodostaa tiedoista kuvaajia.',
    contactInfo: 'Kysyttävää? Ota yhteys osoitteeseen ospa@helsinki.fi',
    broughtBy: 'Toteutus:',
  },

  landingPage: {
    title: 'Tilannekuvalomake',
    subTitle: 'Helsingin yliopiston koulutusohjelmien toiminnan seurannan ja arvioinnin alusta',
    yearlyAssessmentTitle: 'Vuosiseuranta',
    yearlyAssessmentSubtitles: ['Koulutusohjelmien vuosiseurannan lomakkeet ja yhteenvedot vuodesta 2019 lähtien'],
    evaluationTitle: 'Katselmus 2024',
    evaluationSubtitles: [
      'Katselmuksen lomakkeet ja yhteenvedot',
      'Toimenpiteiden toteutuksen ja seurannan lomakkeet sekä yhteenvedot',
    ],
    degreeReformTitle: 'Koulutusuudistuksen (Iso Pyörä 2015) arviointi',
    degreeReformSubtitles: ['Koulutuksen nykytila ja yhteenvedot 2024'],
  },

  comparison: {
    compare: 'Vastausten vertailu',
    reportHeader: {
      byFaculty: 'Vertaile ohjelmaa tiedekuntaan',
      byYear: 'Vertaile vastauksia vuosittain',
    },
    selectYears: 'Valitse vuodet, joita haluat tarkastella',
    filterFaculties: 'Vastaukset tiedekunnittain',
    selectQuestions: 'Vertailun kysymykset',
    writtenAnswers: 'Kirjalliset vastaukset vuosittain',
    chosenProgrammes: 'Valittu ohjelma',
    chooseProgramme: 'Valitse vertailtava ohjelma',
    compareFaculties: 'Vertaile tiedekunnittain',
    emptyAnswers: 'Ota mukaan koulutusohjelmat, jotka eivät ole vastanneet kysymykseen',
    university: 'Koko yliopisto',
    noAccessToAll: 'Huomioithan, että verrokkina näkyy vain niiden ohjelmien tiedot, joihin sinulla on lukuoikeus',
    labelOptions: 'Graafin yksikkö',
    percentage: 'Prosenttiosuudet',
    programmeAmount: 'Ohjelmien lukumäärä',
    facultyAmount: 'Tiedekuntien lukumäärä',
    programmes: 'Ohjelmaa',
    fullscreen: 'Koko näyttö',
    downloadPNG: 'Lataa PNG-kuvana',
    downloadSVG: 'Lataa SVG-kuvana',
    downloadPDF: 'Lataa PDF-tiedostona',
    chartExport: 'Tilannekuvalomakkeen_vuosivertailu',
  },

  formView: {
    formError: 'Ongelmia yhteydessä lomakkeeseen',
    formErrorButton: 'Paina tästä niin sivu ladataan uudelleen!',
    canChange: 'Voit muokata vastauksia tallentamisen jälkeen',
    title: 'KOULUTUSOHJELMAN TILANNEKUVAN DOKUMENTOINTI',
    metaSubtitle: 'Toimenpiteiden priorisointi koulutusohjelmissa',
    metaCommentLabel: 'Muita kommentteja',
    facultyActionsLabel: 'Kuvaus siitä mitä tiedekunta tekee',
    facultyEntitiesLabel: 'Vastuutahot',
    facultyContactLabel: 'Yhteyshenkilö / päävalmistelija',
    facultyResourcesLabel: 'Varatut resurssit',
    facultyScheduleLabel: 'Aikataulu',
    facultyStartLabel: 'Alkamisaika',
    facultyEndLabel: 'Arvioitu päättymisaika',
    info1:
      'Käykää koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista. Aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata.',
    info2: 'Antakaa yleisarvio kunkin aiheen kohdalla (liikennevalot):',
    infoMeta1:
      'Käykää koulutusohjelman johtoryhmässä keskustelu katselmuksen arviointiryhmän raportista. Keskustelkaa arviointiryhmän esittämistä toimenpiteistä, arvioikaa kunkin toimenpiteen toteutuksen tarvetta ja merkitystä koulutusohjelmanne tulevaisuuden kannalta. Kirjatkaa keskustelunne keskeisimmät sisällöt.',
    infoMeta2:
      'Arvioikaa kunkin toimenpiteen merkitystä ja tärkeyttä yleisarviolla (liikennevalot). Mikäli katsotte, että toimenpide ei koske koulutusohjelmaanne, kirjatkaa arvion perustelu.',
    infoMeta3:
      'Lisäksi voitte tarvittaessa kirjata muita kommentteja tiedekunnan ja yliopistotason valmistelua varten.',
    downloadCSV: 'Lataa vastaukset csv-tiedostona',
    downloadPDF: 'Tulosta vastaukset PDF-tiedostona',
    mandatory: 'pakollinen kenttä',
    saveFailed: 'Virhe: Viimeisen 10 sekunnin aikana tekemäsi muutokset eivät tallentuneet onnistuneesti!',
    saveFailedInstructions:
      'Jatkaaksesi lomakkeen täyttämistä, ole hyvä ja ota viimeiset muutoksesi talteen. Klikkaa sen jälkeen allaolevaa näppäintä ladataksesi sivu uudelleen.',
    reload: 'Lataa sivu uudelleen',
    status: {
      locked: 'Lomake on valitulta vuodelta lukittu, eikä sitä voi muokata.',
      open: 'vastaukset ovat avoinna muokattavaksi.',
      viewOnly: 'Sinulla ei ole oikeuksia muokata lomaketta. Voit kuitenkin tarkastella vastauksia.',
      canBeOpened: 'Lomakkeen omistaja voi vielä avata lomakkeen ennen sen eräpäivää',
      deadlinePassed: 'Lomakkeen täyttöaika on päättynyt.',
      ospaProcessing: 'OSPA käsittelee vastaukset.',
      prosessing: 'Vastaukset käsitellään.',
    },
    savingAnswers: 'Vastaukset tallentuvat automaattisesti tekstikenttiä lukuunottamatta. Viimeinen vastauspäivä:',
    noSystemsSelected: 'Ei valittuja palautejärjestelmiä.',
    selectSystems: 'Valitkaa järjestelmä klikkaamalla',
    mostUseful: 'Hyödyllisimmät palautejärjestelmät',
    developmentArea: 'Nimeä kehittämiskohde',
    actions: 'Toimenpide-ehdotukset',
    requiredActions: 'Tarvittavat toimenpiteet',
    addDevelopmentArea: 'Lisää kehittämiskohde',
    removeDevelopmentArea: 'Poista viimeinen kehittämiskohde',
    allYearlyAnswerYears: 'Kaikki vuosiseurannan vuodet',
    evaluationUniTopInfo:
      '<strong>HUOM!</strong> Yliopistotason kirjauksista sekä niiden valmistelusta vastaavat kandi- ja maisteriohjelmien osalta opintoasiainneuvosto (ONE) ja tohtoriohjelmien osalta tutkijakoulun johtokunta ja tieteellinen neuvosto (TINE).<br /><br />Toimikunnat tekevät kirjauksensa samaan lomakkeeseen, jota arviointiryhmä tulee käyttämään materiaalinaan. Myös arviointiryhmä tekee kirjauksensa tähän samaan lomakkeeseen.',
    evaluationInfo1:
      'Katselmuksessa tarkastellaan koulutusohjelman tilannetta laajemmin <strong>kolmen viime vuoden ajalta</strong>.',
    evaluationInfo2:
      'Keskustelkaa koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista. Huomaattehan, että vuoden <strong> 2023 vuosiseuranta tulee olla tehtynä ennen katselmuksen täyttämistä</strong>.',
    evaluationInfoUni: 'Katselmuksessa tarkastellaan yliopiston koulutuksen tilannetta kolmelta viime vuodelta.',
    selectApplicable: 'Valitkaa sopivat vaihtoehdot',
    addMissing: 'Kirjatkaa puuttuvat vaihtoehdot - Voitte kirjata useamman',
    progSummaryTitle: 'Teemaan liittyvien vuosiseurantakysymysten vastaukset tarkastelujaksolta',
    universitySummaryTitle: 'Tiedekunnat vastasivat seuraavasti:',
    facultySummaryTitle: 'Tiedekunnan koulutusohjelmien johtoryhmät vastasivat seuraavasti:',
    facultyActionSummaryTitle:
      'Koulutusohjelmien johtoryhmät kirjasivat kehittämiskohteensa ja niiden vaatimat toimenpiteet seuraavasti:',
    universityActionSummaryTitle:
      'Tiedekunnat kirjasivat kehittämiskohteensa ja niiden vaatimat toimenpiteet seuraavasti:',
    materials: 'Taustamateriaali',
    materialsProg:
      'Alla olevasta linkistä voitte tarkastella kootusti kaikkia vuosiseurannassa kirjattuja vastauksia.<br/> Lisäksi tässä lomakkeessa on usean kysymyksen yhteyteen lisätty tiivistelmä kolmelta viimeisimmältä vuodelta kyseiseen teemaan liittyvien vuosiseurantakysymysten vastauksista. <br/>Oodikoneseen on luotu näkymä katselmoinnin tueksi. Tähän näkymään on kerätty keskeisimpiä tilastoja koulutusohjelmanne ja tiedekuntanne opiskelijoista ja heidän opintojensa etenemisestä. Alla linkki sekä koulutusohjelma- että tiedekuntatason näkymään.',
    summaryLinkProg: 'Tarkastelkaa kaikkia aiempien vuosiseurontojen vastauksia',
    oodikoneProg: 'Tarkastelkaa koulutusohjelman tietoja Oodikoneessa',
    oodikoneFaculty: 'Tarkastelkaa tiedekunnan tietoja Oodikoneessa',
    oodikoneUniversity: 'Tiedot Oodikoneesta',
    rapo: 'Tarkastelkaa tohtoriohjelman tietoja Rapossa',
    metaPdfName: 'Katselmuksen arviointiryhmän arviot ja ehdotukset',
    metaPdfUrl:
      'https://www.helsinki.fi/assets/drupal/2024-05/Katselmuksen_arviointiryhman_arviot_ja_ehdotukset_15052024.pdf',
    toijo:
      'Toimintarakenteen ja johtamisjärjestelmän (TOIJO) itsearviointiraportti luettavissa <a href="https://workgroups.helsinki.fi/pages/viewpage.action?pageId=323688922&preview=/323688922/323688944/1_University%20of%20Helsinki%20TOIJO%20self-assessment%20report%20280823.pdf" target="_blank">täällä</a> (raportti englanniksi)',
    langCenterRaport:
      'Kielikeskuksen itsearviointiraportti luettavissa <a href="https://workgroups.helsinki.fi/display/KTKKT/Kielikeskuksen+taustamateriaali+koulutusohjelmien+katselmuksen+tueksi" target="_blank">täällä</a>',
    facultyInfo:
      'Katselmuksessa tarkastellaan <strong>tiedekunnan</strong> koulutusohjelmien tilannetta kolmelta viime vuodelta.',
    materialsUniversity:
      'Lomakkeessa on useimpien kysymyksien yhteyteen lisätty tiivistelmä tiedekuntien katselmuskysymysten vastauksista. <br/><br/>Oodikoneeseen on luotu näkymä katselmuksen tueksi. Tähän näkymään on kerätty keskeisimpiä tilastoja tiedekuntien opiskelijoista ja heidän opintojensa etenemisestä. Alla linkki yliopistotason näkymään.',
    materialsFaculty:
      'Lomakkeessa on useimpien kysymyksien yhteyteen lisätty tiivistelmä tiedekunnan koulutusohjelmien katselmuskysymysten vastauksista. <br/><br/>Oodikoneeseen on luotu näkymä katselmuksen tueksi. Tähän näkymään on kerätty keskeisimpiä tilastoja tiedekunnan opiskelijoista ja heidän opintojensa etenemisestä. Alla linkki tiedekuntatason näkymään.',
    yearlyAnswers: 'Vuosiseurantojen vastaukset',
    evaluationFacultyAnswers: 'Katselmuksen vastaukset koulutusohjelmissa',
    yearlyFacultyAnswers: 'Vuosiseurantojen vastaukset koulutusohjelmissa',
    fillAllRequiredFields: 'Vähintään kolme ensimmäistä kysymystä tulee olla vastattu, mikäli haluaa tallentaa',
    formReady: 'Vastaukset on tallennettu',
    sendNewForm: 'Täytä uusi lomake',
    modifyForm: 'Muokkaa vastauksia',
    modifyPlan: 'Muokkaa suunnitelmaa',
    sendForm: 'Tallenna vastaukset',
    sendSelection: 'Tallenna valinnat',
    sendPlan: 'Tallenna suunnitelma',
    selectQuestions: 'Valitse toimenpiteet',
    noQuestionsSelected: 'Ei valittuja toimenpiteitä. Valitse toimenpiteet yllä olevasta painikkeesta.',
    sendFormModalDescription: 'Haluatko lähettää toisen lomakkeen? Kaikkien lähetettyjen lomakkeiden tiedot säilyvät',
    sendFormModalHeader: 'Uuden koulutuksen nykytila -lomakkeen lähettäminen',
    stronglyDisagree: 'Täysin eri mieltä',
    partiallyDisagree: 'Osittain eri mieltä',
    neitherNor: 'Ei samaa eikä eri mieltä',
    partiallyAgree: 'Osittain samaa mieltä',
    stronglyAgree: 'Täysin samaa mieltä',
    doNotKnow: 'En osaa sanoa',
    noAnswer: 'Ei vastausta',
    average: 'Keskiarvo',
    showAnswers: 'Näytä vastaukset',
    hideAnswers: 'Piilota vastaukset',
    evaluationSummaryByProgramme: 'Tarkastelkaa tiedekunnan tietoja Koulutuksen tila -kyselyn tuloksista',
    evaluationSummaryUniversity: 'Koulutuksen tila -kyselyn tulokset',
    formNotReady: 'Lomake on vielä kehityksessä, avautuu 1.11.',
    overallActionSummaryTitle: 'Yleiset toimenpidesuositukset',
    bachelorUniForm: 'Kandiohjelmat\n(ONE kirjaa)',
    masterUniForm: 'Maisteriohjelmat\n(ONE kirjaa)',
    doctoralUniForm: 'Tohtoriohjelmat\n(Tutkijakoulun johtokunta ja TINE yhdessä kirjaavat)',
    monitoringTrackingLabel: 'Seuranta',
    monitoringActionsLabel: 'Kuvaus siitä mitä tiedekunta tekee',
    monitoringResponsibleLabel: 'Vastuutahot',
    monitoringContactLabel: 'Yhteyshenkilö / päävalmistelija',
    monitoringResourceLabel: 'Varatut resurssit',
    monitoringStartLabel: 'Alkamisaika',
    monitoringEndLabel: 'Arvioitu päättymisaika',
  },

  generic: {
    noData: 'yksittäisten kysymysten vastaukset eivät vielä saatavilla',
    facultyAvg: 'Tiedekunnan koulutusohjelmien keskiarvo',
    chosenFacultyAvg: 'Valittujen tiedekuntien koulutusohjelmien keskiarvo',
    chosenFaculties: 'Valitut tiedekunnat',
    universityAvg: 'Yliopiston koulutusohjelmien keskiarvo',
    individualAvg: 'Tiedekunnan yksittäisten vastaajien keskiarvo',
    individualTxt: 'Tiedekunnan yksittäisten vastaajien avovastaukset',
    individualAvgUni: 'Yliopiston kaikkien yksittäisten vastaajien keskiarvo',
    individualAvgUniSelected: 'Valittujen tiedekuntien yksittäisten vastaajien keskiarvo',
    noAnswerData: 'Kysymykseen ei vastauksia',
    kludgeButton: 'Tallenna tekstikenttä',
    kludgeButtonRelease: 'Lopeta tekstikentän muokkaus',
    degreeReformIndividualAnswers: 'Vastaukset',
    degreeReformIndividualForm: 'Lomake',
    companionFilter: 'Ota vastauksiin mukaan tiedekunnan yhteistyöohjelmat',
    isWriting: 'kirjoittaa',
    allDoctoralSchools: 'Kaikki tohtoriohjelmat',
    doctoralSchoolFilter: 'Tohtoriohjelmien vastaukset tutkijakouluittain',
    socialSchool: 'Humanistis-yhteiskuntatieteellinen tutkijakoulu',
    sciencesSchool: 'Luonnontieteellinen tutkijakoulu',
    healthSchool: 'Terveyden tutkimuksen tutkijakoulu',
    environmentalSchool: 'Ympäristö-, elintarvike- ja biotieteellinen tutkijakoulu',
    textAreaLabel: 'Keskustelun pääkohdat olivat',
    textAreaLabelQ12and13: 'Perustelkaa arvio',
    kludgedLabel: 'ARVIO',
    kludgedLabel2: 'KUVAUS',
    allFaculties: 'Kaikki tiedekunnat',
    collapseText: 'Piilota viime vuoden vastaukset',
    expandText: 'Näytä viime vuoden vastaukset',
    compareLevel: 'Vertaile koulutusasteittain',
    levelFilter: 'Vastaukset koulutusasteittain',
    measureLabel: 'Lisätkää 1-5 toimenpidettä.',
    noPermissions:
      'Sinulla ei ole käyttöoikeuksia näkymään {{requestedForm}}. Ota yhteyttä opetuksen strategisiin palveluihin tai koulutusohjelman johtajaan.',
    nowShowing: {
      programmes: 'VASTAUKSISSA MUKANA OLEVAT OHJELMAT:',
      faculties: 'VASTAUKSISSA MUKANA OLEVAT TIEDEKUNNAT:',
    },
    chooseMore: {
      programmes: 'VALITSE OHJELMAT RAPORTILLE:',
      faculties: 'VALITSE TIEDEKUNNAT RAPORTILLE:',
    },
    tooLongPaste:
      'Teksti jota yrität liittää (yhteensä {{newLength}} merkkiä) ei mahdu maksimimerkkimäärään ({{MAX_LENGTH}} merkkiä)',
    year: 'Valitse vuodet',
    pdfExportText: 'Tilannekuvalomakkeen_vastaukset',
    reportPage: 'Tilannekuvalomakkeen vastaukset',
    downloadPDF: 'Lataa vastaukset PDF-tiedostona',
    statusHeader: 'Vuoden {{year}} vastaukset ovat avoinna muokattaviksi.',
    statusMessage: 'Voit vaihtaa vuoden otsikon alla näkyvästä valikosta. Viimeinen vastauspäivä: ',

    csvFileformwritten: 'Tilannekuvalomake_kirjalliset_vastaukset',
    csvFileformcolors: 'Tilannekuvalomake_liikennevalovärit',
    csvFileoverviewwritten: 'Tilannekuvalomake_kaikki_ohjelmat_kirjalliset_vastaukset',
    csvFileoverviewcolors: 'Tilannekuvalomake_kaikki_ohjelmat_liikennevalovärit',
    colors: 'Lataa liikennevalovastaukset CSV-tiedostoina',
    written: 'Lataa kirjalliset vastaukset CSV-tiedostoina',
    level: {
      programmes: 'Koulutusohjelmataso',
      faculties: 'Tiedekuntataso',
      university: 'Yliopistotaso',
      committee: 'Arviointiryhmä',
      arviointi: 'Arviointiryhmä',
    },
    textUnsaved: 'Tekstiä on tallentamatta!',
    textUnsavedRelease: 'Vapauta kenttä muiden muokattavaksi painamalla nappia!',
  },

  overview: {
    betterThanLastYear: 'Parempi kuin viime vuonna',
    worseThanLastYear: 'Huonompi kuin viime vuonna',
    formLocked: 'Lomake on lukittu',
    formUnlocked: 'Lomaketta voi muokata',
    unlockForm: 'Poista lukitus',
    lockForm: 'Lukitse lomake',
    overviewPage: 'Lomake - Yleisnäkymä',
    accessRights: 'Käyttöoikeudet',
    selectYear: 'Valitse tarkasteltava vuosi',
    readAnswers: 'Lue vastauksia',
    compareAnswers: 'Vertaile vastauksia',
    toKatselmus: 'Katselmuksen yliopistotason yhteenvetoon',
    csvDownload: 'Lataa CSV',
    name: 'Nimi',
    view: 'Luku',
    edit: 'Vastaus',
    owner: 'Omistaja',
    noUsers: 'Ei käyttäjiä',
    userListJory: 'Lomakkeelle kirjautuneet käyttäjät, jotka kuuluvat koulutusohjelman johtoryhmään',
    userListOthers: 'Lomakkeelle kirjautuneet muut käyttäjät, joilla oikeus koulutusohjelmaan',
    greenModalAccordion: 'Tilanne hyvä',
    yellowModalAccordion: 'Tilanne neutraali',
    redModalAccordion: 'Tilanne huono',
    facultySummary: 'Koulutusohjelmien vastaukset',
    pcs: 'kpl',
    chooseFaculty: 'Rajaa näytettävät tiedekunnat',
    developmentTarget: 'KEHITTÄMISKOHDE JA TOIMENPITEET',
    universityOverview: 'Yliopistotason yhteenveto',
    uniAnswerLevels: {
      bachelor: 'Kandiohjelmat',
      master: 'Maisteriohjelmat',
      doctoral: 'Tohtoriohjelmat',
      overall: 'Yleiset arviot ja toimenpidesuositukset',
    },
    selectedLevels: {
      master: 'Kandi- ja maisteriohjelmat',
      doctoral: 'Tohtoriohjelmat',
      overall: 'Yleiset arviot ja toimenpidesuositukset',
    },
    uniTableHeaderHY: 'Helsingin yliopiston arvio ja toimenpide-ehdotukset',
    uniTableHeaderCommittee: 'Arviointiryhmän arvio ja toimenpide-ehdotukset',
    printingTopHeader: 'Helsingin yliopiston koulutusohjelmien katselmus',
    printingSubHeaderUpperLevel: {
      university: 'Yliopiston arviot 2024',
      arviointi: 'Arviointiryhmän arviot 2024',
    },
    printingUpperLevelTitle: {
      university: 'Yliopiston arvio',
      arviointi: 'Arviointiryhmän arvio',
    },
    printingPDF: {
      uniBachelorMaster: 'Kandi- ja maisteriohjelmat (yliopistotaso)',
      uniDoctoral: 'Tohtoriohjelmat (yliopistotaso)',
      arviointiBachelorMaster: 'Kandi- ja maisteriohjelmat (arviointiryhmä)',
      arviointiDoctoral: 'Tohtoriohjelmat (arviointiryhmä)',
    },
    colorBlindMode: 'Näytä värit tekstinä',
    print: 'Tulostettavat versiot',
  },

  report: {
    pdfNotification: 'Vain tähän valitut kysymykset ja vastaukset tulevat PDF-tulosteelle',
    facultyFilter: 'Vastaukset tiedekunnittain',
    reportPage: 'Tilannekuvalomakkeen vastaukset',
    selectQuestions: 'Suodata kysymyksiä',
    clickToCheck: 'Katso kirjalliset vastaukset',
    question: 'Kysymys',
    answered: 'Vastattu',
    all: 'Kaikki',
    filterBy: 'Rajaa vastauksia',
    improvementAreas: 'Kehittämiskohde',
    improvementActions: 'Toimenpide-ehdotus',
  },

  users: {
    nextDeadline: 'Lomakkeen viimeinen täyttöpäivä: ',
    answersSavedForYear: 'Vastaukset tallennetaan vuodelle: ',
    contactToska: 'Jos viimeiseen aukiolopäivään tulee muutoksia, otathan yhteyden Toskaan (grp-toska@helsinki.fi).',
    noDeadlineSet: 'Viimeistä aukiolopäivää ei tälle vuodelle ole vielä asetettu tai se on jo umpeutunut. ',
    selectNewDeadline: 'Valitse viimeinen aukiolopäivä',
    selectForm: 'Valitse lomake',
    openForms: 'Auki olevien lomakkeiden viimeiset täyttöpäivät',
    selectDraftYear: 'Valitse muokkausvuosi: ',
    deadlineWarning:
      'Lomake on jo auki toiselle vuodelle, lukitse lomake ennen uuden vuoden avaamista, jotta tiedot tallentuvat oikein',
    updateDeadline: 'Päivitä viimeinen aukiolopäivä',
    deleteThisDeadline: 'Lukitse lomake',
    noDraftYear: 'Ei valittua vastausvuotta',
    adminPage: 'Lomake - Ylläpito-sivu',
    users: 'Käyttäjät',
    iams: 'IAM-ryhmät',
    deadline: 'Lomakkeen aukioloaika',
    updateStudyprogrammes: 'Koulutusohjelmien päivittäminen',
    deadlineSettings: 'Lomakkeen aukiolon määritys',
    moreProgrammes_one: 'muu ohjelma',
    moreProgrammes_other: 'muuta ohjelmaa',
    special: {
      access_accessAllProgrammes: 'Kaikki ohjelmat',
      access_accessInternational2020: 'Kansainväliset maisteriohjelmat 2020 ->',
      access_accessInternational: 'Kansainväliset maisteriohjelmat',
      access_accessDoctoral: 'Kaikki tohtoriohjelmat',
      access_accessEvaluationFaculty: 'Katselmus - tiedekunta',
      access_accessEvaluationUniversity: 'Katselmus - Yliopistotaso',
    },
    basicUser: 'Peruskäyttäjä',
    superAdmin: 'Super-admin',
    searchByName: 'Etsi käyttäjiä nimellä',
    filterByAccess: 'Etsi koulutusohjelmien perusteella',
    name: 'Nimi',
    userId: 'Käyttäjätunnus',
    access: 'Oikeudet',
    userGroup: 'Käyttäjäryhmä',
    lastLogin: 'Kirjautunut viimeksi',
    specialGroup: 'Käyttöoikeusryhmät',
    role: 'Ensisijainen rooli',

    tempAccess: 'Oikeuksien hallinta',
    tempAccessMangement: 'Väliaikaisten oikeuksien hallinta',
    tempAccessInfo1:
      'Käyttäjälle voidaan tarvittaessa myöntää väliaikainen luku- tai kirjoitusoikeus tiettyyn koulutusohjelmaan.',
    tempAccessInfo2:
      'Oikeuden saajan tulee olla jo AIEMMIN KIRJAUTUNUT lomakkeelle. Oikeuden myöntämisestä lähetetään sähköposti-ilmoitus kyseisen koulutusohjelman johtajalle.',
    tempAccessNote:
      'Tämä toiminto on tarkoitettu vain poikkeustilanteisiin. Oikeuksien jaossa tulisi ensisijaisesti käyttää IAM-ryhmiä.',
    receiverEmail: 'Oikeuden saajan helsinki.fi-sähköpostiosoite',
    accessProgramme: 'Koulutusohjelma, johon oikeudet annetaan',
    endOfAccess: 'Käyttöoikeuden viimeinen voimassaolopäivä',
    kojoEmail: 'Koulutusohjelman johtajan sähköpostiosoite',
    giveWritingRights: 'Anna kirjoitusoikeudet',
    saveRight: 'Tallenna oikeus',
    tempAccesses: 'Annetut väliaikaiset oikeudet',
    expired: 'Näytä vanhentuneet',
    writingRight: 'Kirjoitusoikeus',
    endsIn: 'Päättyy',
    confirm: 'Poista käyttäjän {{firstname}} {{lastname}} väliaikainen oikeus ohjelmaan {{progName}}?',
  },
  facultyTracking: {
    facultyInfoHeader: 'Tiedekunnan toimenpiteiden valinta ja suunnittelu ',
    facultyInfo1:
      'Valitkaa toimenpiteistä tiedekuntanne kannalta tarpeellisimmat ja suunnitelkaa niiden toteutusta. Kirjatkaa tälle alustalle tiivis kuvaus siitä, mitä tiedekunta aikoo tehdä toimenpiteen edistämiseksi. Kirjatkaa toimenpiteen toteutukseen liittyvät resurssitarpeet, vastuutahot, yhteyshenkilö sekä aikataulu. ',
    facultyInfo2:
      'Mikäli olette jo tehneet joistakin toimenpiteistä kirjauksia TOPSUun (toimeenpanosuunnitelmaan 2025-2028), voitte kirjata samat tiedot tälle lomakkeelle. Mikäli Topsuun 2025-2028 ei vielä ole kirjattu toimenpiteeseen liittyen mitään, kirjaukset voitte tehdä TOPSUn päivityksen yhteydessä suunnittelukauden edetessä. ',
    facultyInfo3:
      'Voitte poistaa ja lisätä toimenpiteitä tarpeen mukaan ”Valitse toimenpiteet” -painikkeen näkymästä. Kaikki kokonaan tai osittain toteutuneet toimenpiteet on kuitenkin tärkeä jättää alustalle dokumentoiduiksi.',
    formInfoHeader: 'Tiedekunnan toimenpiteiden seuranta ',
    formInfo1:
      'Tässä lomakkeessa on liikennevalo, jota käytetään toimenpiteiden toteutuksen seurannassa. Ensimmäisen kerran seuranta tapahtuu joulukuussa 2024 opintoasiainneuvostossa (kandi- ja maisteriohjelmat) ja tutkijakoulun johtokunnassa (tohtoriohjelmat). Sitä ennen tiedekunnan tulee kirjata tähän lomakkeeseen kunkin toimenpiteen tilanne. Toimenpiteiden seurantaa jatketaan suunnittelukauden ajan tai tarvittaessa niin pitkään kuin toteutus jatkuu.',
    formInfo2:
      'Tässä lomakkeessa on käytössä toimenpiteen tilannetta kuvaava liikennevaloarvio. Liikennevalojen merkitykset ovat:',
    formInfo3: 'Liikennevaloarvion perään tulee kirjauksen päivämäärä automaattisesti. ',
    green: 'Toteutettu',
    yellow: 'Edennyt ja käynnissä',
    red: 'Ei ole edennyt',
    gray: 'Ei vastausta',
    bachelor: 'Kandiohjelmia',
    master: 'Maisteriohjelmia',
    both: 'Kandi- ja maisteriohjelmia',
    selectDegree: 'Mitä asteita toimenpide koskee',
  },
}
