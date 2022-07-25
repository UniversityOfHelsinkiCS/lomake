export default {
  // default namespace, can be used without prefix, ie. t('logOut')
  common: {
    logOut: 'Kirjaudu ulos',
    chosenLanguage: 'Suomi',
    form: 'Lomake',
    positive: 'Kunnossa',
    neutral: 'Haasteet tiedossa ja niiden kehittäminen työn alla',
    negative: 'Vaatii merkittäviä toimenpiteitä / kehittämiskohteita ei ole tarkennettu',
    EMPTY: 'Ei vastausta',
    OK: 'Vastattu',
    lastSaved: 'Viimeksi tallennettu',
  },

  // other namespaces, use requires prefix, eg. t('aboutPage:title')

  aboutPage: {
    title: 'Tietoa lomakkeesta',
    whatIsIt: 'Mikä tilannekuvalomake on?',
    whatIsItReply:
      'Tilannekuvalomake on koulutusohjelman johtoryhmässä käytävän tilannekuvakeskustelun asialista ja keskustelun dokumentoinnin väline. Lomaketta käytetään Helsingin yliopistossa.',
    howToFillTitle: 'Miten tilannekuvalomake täytetään?',
    howToFill: ` 
    Tilannekuvalomakkeen aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata. 
    Lomakkeelle kirjataan lyhyesti muistiin keskustelun pääkohdat. Lisäksi laaditaan toimenpidelista ohjelmalle itselleen ja erillinen toimenpidelista tiedekunnan suunnitelmia varten.
    Kustakin aihealueesta annetaan yleisarvio (liikennevalot). ”Missä mennään?” -liikennevaloarvio on tarkoitettu keskustelun herättämistä varten, eikä sen perusteella tehdä johtopäätöksiä toiminnan laadusta.`,
    whatElseTitle: 'Mitä muuta lomakkeella voi tehdä?',
    whatElse:
      'Voit lukea oman ja muiden koulutusohjelmien tilannekuvien kirjallisia dokumentaatioita.  Raportointityökaluilla voit vertailla oman koulutusohjelmasi tietoja muiden tietoihin. Voit myös muodostaa tiedoista kuvaajia.',
    contactInfo: 'Kysyttävää? Ota yhteys osoitteeseen ospa@helsinki.fi',
    broughtBy: 'Touteutus:',
  },

  formView: {
    title: 'KOULUTUSOHJELMAN TILANNEKUVAN DOKUMENTOINTI',
    info1:
      'Käykää koulutusohjelman johtoryhmässä keskustelua seuraavista aiheista. Aiheisiin liittyvät kysymykset on tarkoitettu keskustelua virittäviksi, eikä niihin sellaisenaan ole tarkoitus vastata.',
    info2: 'Antakaa yleisarvio ”Missä mennään?” -kunkin aiheen kohdalla (liikennevalot):',
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
      canBeOpened: 'Lomakkeen omistaja voi vielä avata lomakkeen ennen sen eräpäivää',
      deadlinePassed: 'Lomakeen täyttöaika on päättynyt.',
      ospaProcessing: 'OSPA käsittelee vastaukset.',
    },
    savingAnswers: 'Vastaukset tallentuvat automaattisesti. Viimeinen vastauspäivä:',
  },
}
