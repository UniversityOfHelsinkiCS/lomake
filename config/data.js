const facultyMap = {
  teologinen: 'H10',
  oikeustieteellinen: 'H20',
  lääketieteellinen: 'H30',
  humanistinen: 'H40',
  'matemaattis-luonnontieteellinen': 'H50',
  farmasia: 'H55',
  'bio- ja ympäristötieteellinen': 'H57',
  kasvatustieteellinen: 'H60',
  valtiotieteellinen: 'H70',
  svenska: 'H74',
  'maatalous-metsätieteellinen': 'H80',
  eläinlääketieteellinen: 'H90',
}

const data = [
  {
    code: 'H10',
    name: 'Teologinen tiedekunta',
    programmes: [
      {
        key: 'KH10_001',
        name: {
          fi: 'Teologian ja uskonnontutkimuksen kandiohjelma',
          en: "Bachelor's Programme in Theology and Religious Studies",
          se: 'Kandidatsprogrammet i religionsforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'MH10_001',
        name: {
          en: "Master's Programme in Theology and Religious Studies",
          fi: 'Teologian ja uskonnontutkimuksen maisteriohjelma',
          se: 'Magisterprogrammet i teologi och religionsforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'T920101',
        name: {
          fi: 'Teologian ja uskonnontutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Theology and Religious Studies',
          se: 'Doktorandprogrammet i teologi och religionsforskning',
        },
        companionFaculties: ['kasvatustieteellinen', 'humanistinen'],
      },
    ],
  },
  {
    code: 'H20',
    name: 'Oikeustieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH20_001',
        name: {
          fi: 'Oikeusnotaarin koulutusohjelma',
          en: "Bachelor's Programme in Law",
          se: 'Utbildningsprogrammet för rättsnotarie',
        },
        companionFaculties: [],
      },
      {
        key: 'MH20_001',
        name: {
          fi: 'Oikeustieteen maisterin koulutusohjelma',
          en: "Master's Programme in Law",
          se: 'Magisterprogrammet i rättsvetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH20_002',
        name: {
          fi: 'Kansainvälisen liikejuridiikan maisteriohjelma (International Business Law)',
          en: "Master's Programme in International Business Law",
          se: 'Magisterprogrammet i internationell affärsjuridik',
        },
        companionFaculties: [],
      },
      {
        key: 'MH20_003',
        name: {
          fi: 'Globaalia hallintoa koskevan oikeuden maisteriohjelma',
          en: "Master's Programme in Global Governance Law",
          se: '',
        },
        companionFaculties: [],
      },
      {
        key: 'T920102',
        name: {
          fi: 'Oikeustieteen tohtoriohjelma',
          en: 'Doctoral Programme in Law',
          se: 'Doktorandprogrammet i juridik',
        },
        companionFaculties: [],
      },
    ],
  },
  {
    code: 'H30',
    name: 'Lääketieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH30_001',
        name: {
          fi: 'Psykologian kandiohjelma',
          en: "Bachelor's Programme in Psychology",
          se: 'Kandidatprogrammet i psykologi',
        },
        companionFaculties: [],
      },
      {
        key: 'KH30_002',
        name: {
          fi: 'Logopedian kandiohjelma',
          en: "Bachelor's Programme in Logopedics",
          se: 'Kandidatprogrammet i logopedi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH30_001',
        name: {
          fi: 'Lääketieteen koulutusohjelma',
          en: 'Degree Programme in Medicine',
          se: 'Utbildningsprogrammet i medicin',
        },
        companionFaculties: [],
      },
      {
        key: 'MH30_003',
        name: {
          fi: 'Hammaslääketieteen koulutusohjelma',
          en: 'Degree Programme in Dentistry',
          se: 'Utbildningsprogrammet för odontologi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH30_004',
        name: {
          fi: 'Psykologian maisteriohjelma',
          en: "Master's Programme in Psychology",
          se: 'Magisterprogrammet i psykologi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH30_005',
        name: {
          en: "Master's Programme in Logopedics",
          fi: 'Logopedian maisteriohjelma',
          se: 'Magistgerprogrammet i logopedi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH30_002',
        name: {
          fi: 'Translationaalisen lääketieteen maisteriohjelma (Translational Medicine)',
          en: "Master's Programme in Translational Medicine",
          se: 'Magisterprogrammet i translationell medicin',
        },
        companionFaculties: [],
      },
      {
        key: 'T921101',
        name: {
          fi: 'Biolääketieteellinen tohtoriohjelma',
          en: 'Doctoral Programme in Biomedicine',
          se: 'Doktorandprogrammet i biomedicin',
        },
        companionFaculties: ['farmasia'],
      },
      {
        key: 'T921102',
        name: {
          fi: 'Kliininen tohtoriohjelma',
          en: 'Doctoral Programme in Clinical Research',
          se: 'Doktorandprogrammet i klinisk forskning',
        },
        companionFaculties: [],
      },
      {
        key: 'T921104',
        name: {
          fi: 'Suun terveystieteen tohtoriohjelma',
          en: 'Doctoral Programme in Oral Sciences',
          se: 'Doktorandprogrammet i oral hälsovetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'T921103',
        name: {
          fi: 'Väestön terveyden tohtoriohjelma',
          en: 'Doctoral Programme in Population Health',
          se: 'Doktorandprogrammet i befolkningshälsan',
        },
        companionFaculties: ['maatalous-metsätieteellinen', 'farmasia', 'kasvatustieteellinen'],
      },
    ],
  },
  {
    code: 'H40',
    name: 'Humanistinen tiedekunta',
    programmes: [
      {
        key: 'KH40_001',
        name: {
          fi: 'Filosofian kandiohjelma',
          en: "Bachelor's Programme in Philosophy",
          se: 'Kandidatprogrammet i filosofi',
        },
        companionFaculties: ['valtiotieteellinen'],
      },
      {
        key: 'KH40_002',
        name: {
          fi: 'Taiteiden tutkimuksen kandiohjelma',
          en: "Bachelor's Programme in Art Studies",
          se: 'Kandidatprogrammet i konstforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'KH40_003',
        name: {
          fi: 'Kielten kandiohjelma',
          en: "Bachelor's Programme in Languages",
          se: 'Kandidatprogrammet i språk',
        },
        companionFaculties: [],
      },
      {
        key: 'KH40_004',
        name: {
          fi: 'Kotimaisten kielten ja kirjallisuuksien kandiohjelma',
          en: "Bachelor's Programme in the Languages and Literatures of Finland",
          se: 'Kandidatprogrammet i finskugriska och nordiska språk och litteraturer',
        },
        companionFaculties: [],
      },
      {
        key: 'KH40_005',
        name: {
          fi: 'Kulttuurien tutkimuksen kandiohjelma',
          en: "Bachelor's Programme in Cultural Studies",
          se: 'Kandidatprogrammet i kulturforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'KH40_006',
        name: {
          fi: 'Historian kandiohjelma',
          en: "Bachelor's Programme in History",
          se: 'Kandidatprogrammet i historia',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_001',
        name: {
          fi: 'Taiteiden tutkimuksen maisteriohjelma',
          en: "Master's Programme in Art Studies",
          se: 'Magisterprogrammet i konstforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_002',
        name: {
          fi: 'Kielten maisteriohjelma',
          en: "Master's Programme in Languages",
          se: 'Magisterprogrammet i språk',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_003',
        name: {
          fi: 'Englannin kielen ja kirjallisuuden maisteriohjelma',
          en: "Master's Programme in English Studies",
          se: 'Magisterprogrammet i engelska språket och litteraturen',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_004',
        name: {
          fi: 'Venäjän tutkimuksen maisteriohjelma',
          en: "Master's Programme in Russian Studies",
          se: 'Magisterprogrammet i ryska studier',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_005',
        name: {
          en: "Master's Programme Linguistic Diversity and Digital Humanities",
          fi: 'Kielellisen diversiteetin ja digitaalisten ihmistieteiden maisteriohjelma',
          se: 'Magisterprogrammet i språklig diversitet och digitala metoder',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_006',
        name: {
          fi: 'Kääntämisen ja tulkkauksen maisteriohjelma',
          en: "Master's Programme in Translation and Interpreting",
          se: 'Magisterprogrammet i översättning och tolkning',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_007',
        name: {
          fi: 'Suomen kielen ja suomalais-ugrilaisten kielten ja kulttuurien maisteriohjelma',
          en: "Master's Programme in Finnish and Finno-Ugrian Languages and Cultures",
          se: 'Magisterprogrammet i finska och finskugriska språk och kulturer',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_008',
        name: {
          en: "Master's Programme in Scandinavian Languages and Literatures",
          fi: 'Pohjoismaisten kielten ja kirjallisuuksien maisteriohjelma',
          se: 'Magisterprogrammet i nordiska språk och litteraturer',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_009',
        name: {
          fi: 'Kirjallisuudentutkimuksen maisteriohjelma',
          en: "Master's Programme in Literary Studies",
          se: 'Magisterprogrammet i litteraturvetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_010',
        name: {
          fi: 'Kulttuuriperinnön maisteriohjelma',
          en: "Master's Programme in Cultural Heritage",
          se: 'Magisterprogrammet i kulturarv',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_011',
        name: {
          fi: 'Kulttuurienvälisen vuorovaikutuksen maisteriohjelma',
          en: "Master's Programme in Intercultural Encounters",
          se: 'Magisterprogrammet i interkulturell växelverkan',
        },
        companionFaculties: ['teologinen'],
      },
      {
        key: 'MH40_012',
        name: {
          fi: 'Alue- ja kulttuurintutkimuksen maisteriohjelma',
          en: "Master's Programme in Area and Cultural Studies",
          se: 'Magisterprogrammet i region- och kulturstudier',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_015',
        name: {
          fi: 'Historian maisteriohjelma',
          en: "Master's Programme in History",
          se: 'Magisterprogrammet i historia',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_014',
        name: {
          fi: 'Sukupuolentutkimuksen maisteriohjelma',
          en: "Master's Programme in Gender Studies",
          se: 'Magisterprogrammet i genusvetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH40_013',
        name: {
          fi: 'Kulttuurin ja kommunikaation maisteriohjelma',
          en: "Master's Programme in Culture and Communication",
          se: 'Magisterprogrammet i kultur och kommunikation',
        },
        companionFaculties: [],
      },
      {
        key: 'T920103',
        name: {
          fi: 'Historian ja kulttuuriperinnön tohtoriohjelma',
          en: 'Doctoral Programme in History and Cultural Heritage',
          se: 'Doktorandprogrammet i historia och kulturarv',
        },
        companionFaculties: ['teologinen', 'kasvatustieteellinen', 'oikeustieteellinen'],
      },
      {
        key: 'T920104',
        name: {
          fi: 'Kielentutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Language Studies',
          se: 'Doktorandprogrammet i språkforskning',
        },
        companionFaculties: ['kasvatustieteellinen', 'valtiotieteellinen'],
      },
      {
        key: 'T920105',
        name: {
          fi: 'Sukupuolen, kulttuurin ja yhteiskunnan tutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Gender, Culture and Society',
          se: 'Doktorandprogrammet i genus, kultur och samhällsforskning',
        },
        companionFaculties: [
          'teologinen',
          'kasvatustieteellinen',
          'valtiotieteellinen',
          'oikeustieteellinen',
        ],
      },
      {
        key: 'T920111',
        name: {
          fi: 'Filosofian, taiteiden ja yhteiskunnan tutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Philosophy, Arts and Society',
          se: 'Doktorandprogrammet i filosofi, konstforskning och samhället',
        },
        companionFaculties: ['valtiotieteellinen'],
      },
    ],
  },
  {
    code: 'H50',
    name: 'Matemaattis-luonnontieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH50_001',
        name: {
          fi: 'Matemaattisten tieteiden kandiohjelma',
          en: "Bachelor's Programme in Mathematical Sciences",
          se: 'Kandidatsprogrammet i matematiska vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_002',
        name: {
          fi: 'Fysikaalisten tieteiden kandiohjelma',
          en: "Bachelor's Programme in Physical Sciences",
          se: 'Kandidatprogrammet i fysikaliska vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_003',
        name: {
          fi: 'Kemian kandiohjelma',
          en: "Bachelor's Programme in Chemistry",
          se: 'Kandidatprogrammet i kemi',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_004',
        name: {
          fi: 'Matematiikan, fysiikan ja kemian opettajan kandiohjelma',
          en: "Bachelor's Programme for Teachers of Mathematics, Physics and Chemistry",
          se: 'Kandidatprogrammet för ämneslärare i matematik, fysik och kemi',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_005',
        name: {
          fi: 'Tietojenkäsittelytieteen kandiohjelma',
          en: "Bachelor's Programme in Computer Science",
          se: 'Kandidatprogrammet i datavetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_007',
        name: {
          fi: 'Maantieteen kandiohjelma',
          en: "Bachelor's Programme in Geography",
          se: 'Kandidatprogrammet i geografi',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_008',
        name: {
          en: 'Bachelor’s Programme in Science',
          fi: 'Luonnontieteiden kandiohjelma',
          se: 'Kandidatprogrammet i naturvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH50_006',
        name: {
          fi: 'Geotieteiden kandiohjelma',
          en: "Bachelor's Programme in Geosciences",
          se: 'Kandidatsprogrammet i geovetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_001',
        name: {
          fi: 'Matematiikan ja tilastotieteen maisteriohjelma',
          en: "Master's Programme in Mathematics and Statistics",
          se: 'Magisterprogrammet i matematik och statistik',
        },
        companionFaculties: ['valtiotieteellinen'],
      },
      {
        key: 'MH50_002',
        name: {
          fi: 'Life Science Informatics -maisteriohjelma',
          en: "Master's Programme in Life Science Informatics",
          se: 'Magisterprogrammet i Life Science Informatics',
        },
        companionFaculties: ['bio- ja ympäristötieteellinen'],
      },
      {
        key: 'MH50_003',
        name: {
          fi: 'Teoreettisten ja laskennallisten menetelmien maisteriohjelma',
          en: "Master's Programme in Theoretical and Computational Methods",
          se: 'Magisterprogrammet i teoretiska och beräkningsmetoder',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_004',
        name: {
          fi: 'Alkeishiukkasfysiikan ja astrofysikaalisten tieteiden maisteriohjelma',
          en: "Master's Programme in Particle Physics and Astrophysical Sciences",
          se: 'Magisterprogrammet i elementarpartikelfysik och astrofysikaliska vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_005',
        name: {
          fi: 'Materiaalitutkimuksen maisteriohjelma',
          en: "Master's Programme in Materials Research",
          se: 'Magisterprogrammet i materialforskning',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_006',
        name: {
          fi: 'Ilmakehätieteiden maisteriohjelma',
          en: "Master's Programme in Atmospheric Sciences",
          se: 'Magisterprogrammet i atmosfärsvetenskaper',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'MH50_007',
        name: {
          fi: 'Kemian ja molekyylitieteiden maisteriohjelma',
          en: "Master's Programme in Chemistry and Molecular Sciences",
          se: 'Magisterprogrammet i kemi och molekylära vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_008',
        name: {
          fi: 'Matematiikan, fysiikan ja kemian opettajan maisteriohjelma',
          en: "Master's Programme for Teachers of Mathematics, Physics and Chemistry",
          se: 'Magisterprogrammet för ämneslärare i matematik, fysik och kemi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_009',
        name: {
          fi: 'Tietojenkäsittelytieteen maisteriohjelma',
          en: "Master's Programme in Computer Science",
          se: 'Magisterprogrammet i datavetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_010',
        name: {
          fi: 'Datatieteen maisteriohjelma',
          en: "Master's Programme in Data Science",
          se: 'Magisterprogrammet i data science',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_011',
        name: {
          fi: 'Geologian ja geofysiikan maisteriohjelma',
          en: "Master's Programme in Geology and Geophysics",
          se: 'Magisterprogrammet i geologi och geofysik',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_012',
        name: {
          fi: 'Maantieteen maisteriohjelma',
          en: "Master's Programme in Geography",
          se: 'Magisterprogrammet i geografi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH50_013',
        name: {
          fi: 'Kaupunkitutkimuksen ja suunnittelun maisteriohjelma',
          en: "Master's Programme in Urban Studies and Planning",
          se: 'Magisterprogrammet i urbana studier och planering',
        },
        companionFaculties: ['bio- ja ympäristötieteellinen', 'valtiotieteellinen', 'humanistinen'],
      },
      {
        key: 'T923102',
        name: {
          fi: 'Geotieteiden tohtoriohjelma',
          en: 'Doctoral Programme in Geosciences',
          se: 'Doktorandprogrammet i geovetenskap',
        },
        companionFaculties: ['humanistinen'],
      },
      {
        key: 'T923103',
        name: {
          fi: 'Ilmakehätieteiden tohtoriohjelma',
          en: 'Doctoral Programme in Atmospheric Sciences',
          se: 'Doktorandprogrammet i atmosfärvetenskap',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'T923104',
        name: {
          fi: 'Kemian ja molekyylitutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Chemistry and Molecular Research',
          se: 'Doktorandprogrammet i kemi och molekylära vetenskaper',
        },
        companionFaculties: ['farmasia'],
      },
      {
        key: 'T923105',
        name: {
          fi: 'Matematiikan ja tilastotieteen tohtoriohjelma',
          en: 'Doctoral Programme in Mathematics and Statistics',
          se: 'Doktorandprogrammet i matematik och statistik',
        },
        companionFaculties: [],
      },
      {
        key: 'T923106',
        name: {
          fi: 'Materiaalitutkimuksen ja nanotieteiden tohtoriohjelma',
          en: 'Doctoral Programme in Materials Research and Nanoscience',
          se: 'Doktorandprogrammet i materialforskning och nanovetenskap',
        },
        companionFaculties: ['farmasia'],
      },
      {
        key: 'T923107',
        name: {
          fi: 'Tietojenkäsittelytieteen tohtoriohjelma',
          en: 'Doctoral Programme in Computer Science',
          se: 'Doktorandprogrammet i datavetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'T923101',
        name: {
          fi: 'Alkeishiukkasfysiikan ja maailmankaikkeuden tutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Particle Physics and Universe Sciences',
          se: 'Doktorandprogrammet i elementarpartikelfysik och kosmologi',
        },
        companionFaculties: [],
      },
    ],
  },
  {
    code: 'H55',
    name: 'Farmasian tiedekunta',
    programmes: [
      {
        key: 'KH55_001',
        name: {
          fi: 'Farmaseutin koulutusohjelma',
          en: "Bachelor's Programme in Pharmacy",
          se: 'Utbildningsprogrammet för farmaceutexamen',
        },
        companionFaculties: [],
      },
      {
        key: 'MH55_001',
        name: {
          en: "Master's Programme in Pharmacy",
          fi: 'Proviisorin koulutusohjelma',
          se: 'Utbildningsprogrammet för provisorsexamen',
        },
        companionFaculties: [],
      },
      {
        key: 'T921105',
        name: {
          fi: 'Lääketutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Drug Research',
          se: 'Doktorandprogrammet i läkemedelsforskning',
        },
        companionFaculties: [
          'eläinlääketieteellinen',
          'lääketieteellinen',
          'matemaattis-luonnontieteellinen',
        ],
      },
    ],
  },
  {
    code: 'H57',
    name: 'Bio- ja ympäristötieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH57_001',
        name: {
          fi: 'Biologian kandiohjelma',
          en: "Bachelor's Programme in Biology",
          se: 'Kandidatsprogrammet i biologi',
        },
        companionFaculties: [],
      },
      {
        key: 'KH57_002',
        name: {
          fi: 'Molekyylibiotieteiden kandiohjelma',
          en: "Bachelor's Programme in Molecular Biosciences",
          se: 'Kandidatsprogrammet i molekylära biovetenskaper',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'KH57_003',
        name: {
          en: "Bachelor's Programme in Enviromental Sciences",
          fi: 'Ympäristötieteiden kandiohjelma',
          se: 'Kandidatprogrammet i miljövetenskaper',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'MH57_001',
        name: {
          fi: 'Ekologian ja evoluutiobiologian maisteriohjelma',
          en: "Master's Programme in Ecology and Evolutionary Biology",
          se: 'Magisterprogrammet i ekologi och evolutionsbiologi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH57_002',
        name: {
          fi: 'Kasvitieteen maisteriohjelma',
          en: "Master's Programme in Integrative Plant Sciences",
          se: 'Magisterprogrammet i botanik',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'MH57_003',
        name: {
          fi: 'Genetiikan ja molekulaaristen biotieteiden maisteriohjelma',
          en: "Master's Programme in Genetics and Molecular Biosciences",
          se: 'Magisterprogrammet i genetik och molekylära biovetenskaper',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'MH57_004',
        name: {
          fi: 'Neurotieteen maisteriohjelma',
          en: "Master's Programme in Neuroscience",
          se: 'Magisterprogrammet i neurovetenskap',
        },
        companionFaculties: [],
      },
      {
        key: 'MH57_005',
        name: {
          fi: 'Ympäristömuutoksen ja globaalin kestävyyden maisteriohjelma',
          en: "Master's Programme in Environmental Change and Global Sustainability",
          se: 'Magisterprogrammet i miljöförändringar och global hållbarhet',
        },
        companionFaculties: ['maatalous-metsätieteellinen', 'valtiotieteellinen'],
      },
      {
        key: 'T922101',
        name: {
          fi: 'Luonnonvaraisten eliöiden tutkimuksen tohtoriohjelma',
          en: 'Doctoral Programme in Wildlife Biology',
          se: 'Doktorandprogrammet i forskning om vilda organismer',
        },
        companionFaculties: ['maatalous-metsätieteellinen', 'matemaattis-luonnontieteellinen'],
      },
      {
        key: 'T922103',
        name: {
          fi: 'Ympäristöalan tieteidenvälinen tohtoriohjelma',
          en: 'Doctoral Programme in Interdisciplinary Environmental Sciences',
          se: 'Doktorandprogrammet i tvärvetenskaplig miljöforskning',
        },
        companionFaculties: [
          'maatalous-metsätieteellinen',
          'matemaattis-luonnontieteellinen',
          'kasvatustieteellinen',
          'valtiotieteellinen',
          'oikeustieteellinen',
          'humanistinen',
        ],
      },
      {
        key: 'T921107',
        name: {
          en: 'Doctoral Programme in Brain and Mind',
          fi: 'Aivot ja mieli tohtoriohjelma',
          se: 'Doktorandprogrammet i hjärn- och medvetandeforskning',
        },
        companionFaculties: [
          'eläinlääketieteellinen',
          'lääketieteellinen',
          'farmasia',
          'matemaattis-luonnontieteellinen',
          'kasvatustieteellinen',
          'humanistinen',
        ],
      },
      {
        key: 'T921106',
        name: {
          fi: 'Integroivien biotieteiden tohtoriohjelma',
          en: 'Doctoral Programme in Integrative Life Science',
          se: 'Doktorandprogrammet i integrerande biovetenskap',
        },
        companionFaculties: [
          'eläinlääketieteellinen',
          'maatalous-metsätieteellinen',
          'lääketieteellinen',
          'matemaattis-luonnontieteellinen',
        ],
      },
      {
        key: 'T922102',
        name: {
          fi: 'Kasvitieteen tohtoriohjelma',
          en: 'Doctoral Programme in Plant Sciences',
          se: 'Doktorandprogrammet i botanik',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
    ],
  },
  {
    code: 'H60',
    name: 'Kasvatustieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH60_001',
        name: {
          fi: 'Kasvatustieteiden kandiohjelma',
          en: "Bachelor's Programme in Education",
          se: 'Kandidatprogrammet i pedagogik',
        },
        companionFaculties: [],
      },
      {
        key: 'MH60_001',
        name: {
          fi: 'Kasvatustieteiden maisteriohjelma',
          en: "Master's Programme in Education",
          se: 'Magisterprogrammet i pedagogik',
        },
        companionFaculties: [],
      },
      {
        key: 'MH60_002',
        name: {
          fi: 'Muuttuvan kasvatuksen ja koulutuksen maisteriohjelma',
          en: "Master's Programme in Changing Education",
          se: '',
        },
        companionFaculties: [],
      },
      {
        key: 'T920109',
        name: {
          fi: 'Koulun, kasvatuksen, yhteiskunnan ja kulttuurin tohtoriohjelma',
          en: 'Doctoral Programme in School, Education, Society and Culture',
          se: 'Doktorandprogrammet i skola, fostran, samhälle och kultur',
        },
        companionFaculties: ['teologinen', 'humanistinen'],
      },
      {
        key: 'T920110',
        name: {
          fi: 'Psykologian, oppimisen ja kommunikaation tohtoriohjelma',
          en: 'Doctoral Programme in Psychology, Learning and Communication',
          se: 'Doktorandprogrammet i psykologi, lärande och kommunikation',
        },
        companionFaculties: [],
      },
    ],
  },
  {
    code: 'H70',
    name: 'Valtiotieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH70_001',
        name: {
          fi: 'Politiikan ja viestinnän kandiohjelma',
          en: "Bachelor's Programme in Politics, Media and Communication",
          se: 'Kandidatprogrammet i politik, medier och kommunikation',
        },
        companionFaculties: [],
      },
      {
        key: 'KH70_002',
        name: {
          fi: 'Yhteiskunnallisen muutoksen kandiohjelma',
          en: "Bachelor's Programme in Society and Change",
          se: 'Kandidatsprogrammet i samhälle förändrig',
        },
        companionFaculties: [],
      },
      {
        key: 'KH70_003',
        name: {
          fi: 'Sosiaalitieteiden kandiohjelma',
          en: "Bachelor's Programme in Social Research",
          se: 'Kandidatprogrammet i sociala vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH70_004',
        name: {
          fi: 'Taloustieteen kandiohjelma',
          en: "Bachelor's Programme in Economics",
          se: 'Kandidatprogrammet i ekonomi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_001',
        name: {
          fi: 'Filosofian maisteriohjelma',
          en: "Master's Programme in Philosophy",
          se: 'Magisterprogrammet i filosofi',
        },
        companionFaculties: ['humanistinen'],
      },
      {
        key: 'MH70_002',
        name: {
          en: "Master's Programme in Politics, Media and Communication",
          fi: 'Politiikan ja viestinnän maisteriohjelma',
          se: 'Magisterprogrammet i politik, medier och kommunikation',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_003',
        name: {
          fi: 'Globaalin politiikan ja kommunikaation maisteriohjelma',
          en: "Master's Programme in Global Politics and Communication",
          se: 'Magisterprogrammet i global politik och kommunikation',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_004',
        name: {
          en: "Master's Programme in Society and Change",
          fi: 'Yhteiskunnallisen muutoksen maisteriohjelma',
          se: 'Magisterprogrammet för samhälle i förändring',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_005',
        name: {
          fi: 'Nyky-yhteiskunnan tutkimuksen maisteriohjelma',
          en: "Master's Programme in Contemporary Societies",
          se: 'Magisterprogrammet i moderna samhällen',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_006',
        name: {
          fi: 'Euroopan ja pohjoismaiden tutkimuksen maisteriohjelma (European and Nordic Studies)',
          en: "Master's Programme in European and Nordic Studies",
          se: 'Magisterprogrammet i Europa- och Nordenstudier',
        },
        companionFaculties: ['humanistinen'],
      },
      {
        key: 'MH70_007',
        name: {
          fi: 'Yhteiskuntatieteiden maisteriohjelma',
          en: "Master's Programme in Social Sciences",
          se: 'Magisterprogrammet i samhällsvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_008',
        name: {
          fi: 'Sosiaalitieteiden maisteriohjelma',
          en: "Master's Programme in Social Research",
          se: 'Magisterprogrammet i sociala vetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_009',
        name: {
          fi: 'Taloustieteen maisteriohjelma',
          en: "Master's Programme in Economics",
          se: 'Magisterprogrammet i ekonomi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH70_011',
        name: {
          fi: 'Sosiaali- ja terveystutkimuksen ja johtamisen maisteriohjelma',
          en: "Master's programme in Social and Health Research and Management",
          se: 'Magisterprogrammet i social- och hälsoforskning och ledning',
        },
        companionFaculties: ['lääketieteellinen'],
      },
      {
        key: 'T920106',
        name: {
          fi: 'Sosiaalitieteiden tohtoriohjelma',
          en: 'Doctoral Programme in Social Sciences',
          se: 'Doktorandprogrammet i socialvetenskap',
        },
        companionFaculties: ['kasvatustieteellinen', 'matemaattis-luonnontieteellinen', 'teologinen'],
      },
      {
        key: 'T920107',
        name: {
          fi: 'Poliittisten, yhteiskunnallisten ja alueellisten muutosten tohtoriohjelma',
          en: 'Doctoral Programme in Political, Societal and Regional Changes',
          se: 'Doktorandprogrammet i politisk, samhällelig och regional förändring',
        },
        companionFaculties: ['maatalous-metsätieteellinen', 'kasvatustieteellinen', 'humanistinen'],
      },
      {
        key: 'T920108',
        name: {
          fi: 'Taloustieteen tohtoriohjelma',
          en: 'Doctoral Programme in Economics',
          se: 'Doktorandprogrammet i ekonomi',
        },
        companionFaculties: ['maatalous-metsätieteellinen', 'matemaattis-luonnontieteellinen'],
      },
    ],
  },
  {
    code: 'H74',
    name: 'Svenska social- och kommunalhögskolan',
    programmes: [
      {
        key: 'KH74_001',
        name: {
          en: "Bachelor's Programme in Social Sciences",
          fi: 'Kandidatprogrammet i samhällsvetenskaper',
          se: 'Kandidatprogrammet i samhällsvetenskaper',
        },
        companionFaculties: [],
      },
    ],
  },
  {
    code: 'H80',
    name: 'Maatalous-metsätieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH80_001',
        name: {
          fi: 'Maataloustieteiden kandiohjelma',
          en: "Bachelor's Programme in Agricultural Sciences",
          se: 'Kandidatprogrammet i lantbruksvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH80_002',
        name: {
          fi: 'Metsätieteiden kandiohjelma',
          en: "Bachelor's Programme in Forest Sciences",
          se: 'Kandidatprogrammet i skogsvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH80_003',
        name: {
          fi: 'Elintarviketieteiden kandiohjelma',
          en: "Bachelor's Programme in Food Sciences",
          se: 'Kandidatsprogrammet i livsmedelsvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'KH80_004',
        name: {
          en: "Bachelor's Programme in Enviromental and Food Economics",
          fi: 'Ympäristö- ja elintarviketalouden kandiohjelma',
          se: 'Kandidatprogrammet i miljö- och livsmedelsekonomi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_001',
        name: {
          en: "Master's Programme in Agricultural Sciences",
          fi: 'Maataloustieteiden maisteriohjelma',
          se: 'Magisterprogrammet i lantbruksvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_002',
        name: {
          fi: 'Maatalous-, ympäristö- ja luonnonvaraekonomian maisteriohjelma',
          en: "Master's Programme in Agricultural, Environmental and Resource Economics",
          se: 'Magisterprogrammet i lantbruks -, miljö- och naturresursekonomi',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_003',
        name: {
          fi: 'Metsätieteiden maisteriohjelma',
          en: "Master's Programme in Forest Sciences",
          se: 'Magisterprogrammet i skogsvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_004',
        name: {
          fi: 'Elintarviketieteiden maisteriohjelma',
          en: "Master's Programme in Food Sciences",
          se: 'Magisterprogrammet i livsmedelsvetenskaper',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_005',
        name: {
          en: "Master's Programme in Human Nutrition and Food-Related Behaviour",
          fi: 'Ihmisen ravitsemuksen ja ruokakäyttäytymisen maisteriohjelma',
          se: 'Magisterprogrammet i human nutrition och matbeteende',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_006',
        name: {
          en: "Master's Programme in Food Economy and Consumption",
          fi: 'Elintarviketalouden ja kulutuksen maisteriohjelma',
          se: 'Magisterprogrammet i livsmedelsekonomi och konsumtion',
        },
        companionFaculties: [],
      },
      {
        key: 'MH80_007',
        name: {
          fi: 'Mikrobiologian ja mikrobibiotekniikan maisteriohjelma',
          en: "Master's Programme in Microbiology and Microbial Biotechnology",
          se: 'Magisterprogrammet i mikrobiologi och mikrobiell bioteknik',
        },
        companionFaculties: ['bio- ja ympäristötieteellinen'],
      },
      {
        key: 'T922104',
        name: {
          fi: 'Uusiutuvien luonnonvarojen kestävän käytön tohtoriohjelma',
          en: 'Doctoral Programme in Sustainable Use of Renewable Natural Resources',
          se: 'Doktorandprogrammet i hållbart utnyttjande av förnybara naturresurser',
        },
        companionFaculties: [],
      },
      {
        key: 'T922105',
        name: {
          fi: 'Mikrobiologian ja biotekniikan tohtoriohjelma',
          en: 'Doctoral Programme in Microbiology and Biotechnology',
          se: 'Doktorandprogrammet i mikrobiologi och bioteknik',
        },
        companionFaculties: ['eläinlääketieteellinen', 'bio- ja ympäristötieteellinen'],
      },
    ],
  },
  {
    code: 'H90',
    name: 'Eläinlääketieteellinen tiedekunta',
    programmes: [
      {
        key: 'KH90_001',
        name: {
          fi: 'Eläinlääketieteen kandiohjelma',
          en: "Bachelor's Programme in Veterinary Medicine",
          se: 'Kandidatsprogrammet i veterinärmedicin',
        },
        companionFaculties: [],
      },
      {
        key: 'MH90_001',
        name: {
          fi: 'Eläinlääketieteen lisensiaatin koulutusohjelma',
          en: 'Degree Programme in Veterinary Medicine',
          se: 'Utbildningsprogrammet i veterinärmedicin',
        },
        companionFaculties: [],
      },
      {
        key: 'T921108',
        name: {
          fi: 'Kliinisen eläinlääketieteen tohtoriohjelma',
          en: 'Doctoral Programme in Clinical Veterinary Medicine',
          se: 'Doktorandprogrammet i klinisk veterinärmedicin',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
      {
        key: 'T922106',
        name: {
          fi: 'Ruokaketjun ja terveyden tohtoriohjelma',
          en: 'Doctoral Programme in Food Chain and Health',
          se: 'Doktorandprogrammet i livsmedelskedjan och hälsa',
        },
        companionFaculties: ['maatalous-metsätieteellinen'],
      },
    ],
  },
]

module.exports = {
  data,
  facultyMap,
}
