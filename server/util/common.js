const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const programmes = [
  {
    id: 0,
    key: 'KH50_004',
    name: {
      fi: 'Matematiikan, fysiikan ja kemian opettajan kandiohjelma',
      en: "Bachelor's Programme for Teachers of Mathematics, Physics and Chemistry",
      se: 'Kandidatprogrammet för ämneslärare i matematik, fysik och kemi',
    },
  },
  {
    id: 1,
    key: 'KH80_001',
    name: {
      fi: 'Maataloustieteiden kandiohjelma',
      en: "Bachelor's Programme in Agricultural Sciences",
      se: 'Kandidatprogrammet i lantbruksvetenskaper',
    },
  },
  {
    id: 2,
    key: 'KH40_002',
    name: {
      fi: 'Taiteiden tutkimuksen kandiohjelma',
      en: "Bachelor's Programme in Art Studies",
      se: 'Kandidatprogrammet i konstforskning',
    },
  },
  {
    id: 3,
    key: 'KH57_001',
    name: {
      fi: 'Biologian kandiohjelma',
      en: "Bachelor's Programme in Biology",
      se: 'Kandidatsprogrammet i biologi',
    },
  },
  {
    id: 4,
    key: 'KH50_003',
    name: {
      fi: 'Kemian kandiohjelma',
      en: "Bachelor's Programme in Chemistry",
      se: 'Kandidatprogrammet i kemi',
    },
  },
  {
    id: 5,
    key: 'KH50_005',
    name: {
      fi: 'Tietojenkäsittelytieteen kandiohjelma',
      en: "Bachelor's Programme in Computer Science",
      se: 'Kandidatprogrammet i datavetenskap',
    },
  },
  {
    id: 6,
    key: 'KH40_005',
    name: {
      fi: 'Kulttuurien tutkimuksen kandiohjelma',
      en: "Bachelor's Programme in Cultural Studies",
      se: 'Kandidatprogrammet i kulturforskning',
    },
  },
  {
    id: 7,
    key: 'KH70_004',
    name: {
      fi: 'Taloustieteen kandiohjelma',
      en: "Bachelor's Programme in Economics",
      se: 'Kandidatprogrammet i ekonomi',
    },
  },
  {
    id: 8,
    key: 'KH60_001',
    name: {
      fi: 'Kasvatustieteiden kandiohjelma',
      en: "Bachelor's Programme in Education",
      se: 'Kandidatprogrammet i pedagogik',
    },
  },
  {
    id: 9,
    key: 'KH80_004',
    name: {
      en: "Bachelor's Programme in Enviromental and Food Economics",
      fi: 'Ympäristö- ja elintarviketalouden kandiohjelma',
      se: 'Kandidatprogrammet i miljö- och livsmedelsekonomi',
    },
  },
  {
    id: 10,
    key: 'KH57_003',
    name: {
      en: "Bachelor's Programme in Enviromental Sciences",
      fi: 'Ympäristötieteiden kandiohjelma',
      se: 'Kandidatprogrammet i miljövetenskaper',
    },
  },
  {
    id: 11,
    key: 'KH80_003',
    name: {
      fi: 'Elintarviketieteiden kandiohjelma',
      en: "Bachelor's Programme in Food Sciences",
      se: 'Kandidatsprogrammet i livsmedelsvetenskaper',
    },
  },
  {
    id: 12,
    key: 'KH80_002',
    name: {
      fi: 'Metsätieteiden kandiohjelma',
      en: "Bachelor's Programme in Forest Sciences",
      se: 'Kandidatprogrammet i skogsvetenskaper',
    },
  },
  {
    id: 13,
    key: 'KH50_007',
    name: {
      fi: 'Maantieteen kandiohjelma',
      en: "Bachelor's Programme in Geography",
      se: 'Kandidatprogrammet i geografi',
    },
  },
  {
    id: 14,
    key: 'KH50_006',
    name: {
      fi: 'Geotieteiden kandiohjelma',
      en: "Bachelor's Programme in Geosciences",
      se: 'Kandidatsprogrammet i geovetenskap',
    },
  },
  {
    id: 15,
    key: 'KH40_006',
    name: {
      fi: 'Historian kandiohjelma',
      en: "Bachelor's Programme in History",
      se: 'Kandidatprogrammet i historia',
    },
  },
  {
    id: 16,
    key: 'KH40_003',
    name: {
      fi: 'Kielten kandiohjelma',
      en: "Bachelor's Programme in Languages",
      se: 'Kandidatprogrammet i språk',
    },
  },
  {
    id: 17,
    key: 'KH20_001',
    name: {
      fi: 'Oikeusnotaarin koulutusohjelma',
      en: "Bachelor's Programme in Law",
      se: 'Utbildningsprogrammet för rättsnotarie',
    },
  },
  {
    id: 18,
    key: 'KH30_002',
    name: {
      fi: 'Logopedian kandiohjelma',
      en: "Bachelor's Programme in Logopedics",
      se: 'Kandidatprogrammet i logopedi',
    },
  },
  {
    id: 19,
    key: 'KH50_001',
    name: {
      fi: 'Matemaattisten tieteiden kandiohjelma',
      en: "Bachelor's Programme in Mathematical Sciences",
      se: 'Kandidatsprogrammet i matematiska vetenskaper',
    },
  },
  {
    id: 20,
    key: 'KH57_002',
    name: {
      fi: 'Molekyylibiotieteiden kandiohjelma',
      en: "Bachelor's Programme in Molecular Biosciences",
      se: 'Kandidatsprogrammet i molekylära biovetenskaper',
    },
  },
  {
    id: 21,
    key: 'KH55_001',
    name: {
      fi: 'Farmaseutin koulutusohjelma',
      en: "Bachelor's Programme in Pharmacy",
      se: 'Utbildningsprogrammet för farmaceutexamen',
    },
  },
  {
    id: 22,
    key: 'KH40_001',
    name: {
      fi: 'Filosofian kandiohjelma',
      en: "Bachelor's Programme in Philosophy",
      se: 'Kandidatprogrammet i filosofi',
    },
  },
  {
    id: 23,
    key: 'KH50_002',
    name: {
      fi: 'Fysikaalisten tieteiden kandiohjelma',
      en: "Bachelor's Programme in Physical Sciences",
      se: 'Kandidatprogrammet i fysikaliska vetenskaper',
    },
  },
  {
    id: 24,
    key: 'KH70_001',
    name: {
      fi: 'Politiikan ja viestinnän kandiohjelma',
      en: "Bachelor's Programme in Politics, Media and Communication",
      se: 'Kandidatprogrammet i politik, medier och kommunikation',
    },
  },
  {
    id: 25,
    key: 'KH30_001',
    name: {
      fi: 'Psykologian kandiohjelma',
      en: "Bachelor's Programme in Psychology",
      se: 'Kandidatprogrammet i psykologi',
    },
  },
  {
    id: 26,
    key: 'KH70_003',
    name: {
      fi: 'Sosiaalitieteiden kandiohjelma',
      en: "Bachelor's Programme in Social Research",
      se: 'Kandidatprogrammet i sociala vetenskaper',
    },
  },
  {
    id: 27,
    key: 'KH70_002',
    name: {
      fi: 'Yhteiskunnallisen muutoksen kandiohjelma',
      en: "Bachelor's Programme in Society and Change",
      se: 'Kandidatsprogrammet i samhälle förändrig',
    },
  },
  {
    id: 28,
    key: 'KH40_004',
    name: {
      fi: 'Kotimaisten kielten ja kirjallisuuksien kandiohjelma',
      en: "Bachelor's Programme in the Languages and Literatures of Finland",
      se: 'Kandidatprogrammet i finskugriska och nordiska språk och litteraturer',
    },
  },
  {
    id: 29,
    key: 'KH10_001',
    name: {
      fi: 'Teologian ja uskonnontutkimuksen kandiohjelma',
      en: "Bachelor's Programme in Theology and Religious Studies",
      se: 'Kandidatsprogrammet i religionsforskning',
    },
  },
  {
    id: 30,
    key: 'KH90_001',
    name: {
      fi: 'Eläinlääketieteen kandiohjelma',
      en: "Bachelor's Programme in Veterinary Medicine",
      se: 'Kandidatsprogrammet i veterinärmedicin',
    },
  },
  {
    id: 31,
    key: 'KH50_008',
    name: {
      en: 'Bachelor’s Programme in Science',
      fi: 'Luonnontieteiden kandiohjelma',
      se: 'Kandidatprogrammet i naturvetenskaper',
    },
  },
  {
    id: 32,
    key: '320002',
    name: {
      fi: 'Hammaslääketieteen koulutusohjelma',
      en: 'Degree Programme in Dentistry',
      se: 'Utbildningsprogrammet för odontologi',
    },
  },
  {
    id: 33,
    key: 'MH30_001',
    name: {
      fi: 'Lääketieteen koulutusohjelma',
      en: 'Degree Programme in Medicine',
      se: 'Utbildningsprogrammet i medicin',
    },
  },
  {
    id: 34,
    key: 'MH90_001',
    name: {
      fi: 'Eläinlääketieteen lisensiaatin koulutusohjelma',
      en: 'Degree Programme in Veterinary Medicine',
      se: 'Utbildningsprogrammet i veterinärmedicin',
    },
  },
  {
    id: 35,
    key: 'T921107',
    name: {
      en: 'Doctoral Programme in Brain and Mind',
      fi: 'Aivot ja mieli tohtoriohjelma',
      se: 'Doktorandprogrammet i hjärn- och medvetandeforskning',
    },
  },
  {
    id: 36,
    key: 'T923103',
    name: {
      fi: 'Ilmakehätieteiden tohtoriohjelma',
      en: 'Doctoral Programme in Atmospheric Sciences',
      se: 'Doktorandprogrammet i atmosfärvetenskap',
    },
  },
  {
    id: 37,
    key: 'T921101',
    name: {
      fi: 'Biolääketieteellinen tohtoriohjelma',
      en: 'Doctoral Programme in Biomedicine',
      se: 'Doktorandprogrammet i biomedicin',
    },
  },
  {
    id: 38,
    key: 'T923104',
    name: {
      fi: 'Kemian ja molekyylitutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Chemistry and Molecular Research',
      se: 'Doktorandprogrammet i kemi och molekylära vetenskaper',
    },
  },
  {
    id: 39,
    key: 'T921102',
    name: {
      fi: 'Kliininen tohtoriohjelma',
      en: 'Doctoral Programme in Clinical Research',
      se: 'Doktorandprogrammet i klinisk forskning',
    },
  },
  {
    id: 40,
    key: 'T921108',
    name: {
      fi: 'Kliinisen eläinlääketieteen tohtoriohjelma',
      en: 'Doctoral Programme in Clinical Veterinary Medicine',
      se: 'Doktorandprogrammet i klinisk veterinärmedicin',
    },
  },
  {
    id: 41,
    key: 'T923107',
    name: {
      fi: 'Tietojenkäsittelytieteen tohtoriohjelma',
      en: 'Doctoral Programme in Computer Science',
      se: 'Doktorandprogrammet i datavetenskap',
    },
  },
  {
    id: 42,
    key: 'T921105',
    name: {
      fi: 'Lääketutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Drug Research',
      se: 'Doktorandprogrammet i läkemedelsforskning',
    },
  },
  {
    id: 43,
    key: 'T920108',
    name: {
      fi: 'Taloustieteen tohtoriohjelma',
      en: 'Doctoral Programme in Economics',
      se: 'Doktorandprogrammet i ekonomi',
    },
  },
  {
    id: 44,
    key: 'T922106',
    name: {
      fi: 'Ruokaketjun ja terveyden tohtoriohjelma',
      en: 'Doctoral Programme in Food Chain and Health',
      se: 'Doktorandprogrammet i livsmedelskedjan och hälsa',
    },
  },
  {
    id: 45,
    key: 'T920105',
    name: {
      fi: 'Sukupuolen, kulttuurin ja yhteiskunnan tutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Gender, Culture and Society',
      se: 'Doktorandprogrammet i genus, kultur och samhällsforskning',
    },
  },
  {
    id: 46,
    key: 'T923102',
    name: {
      fi: 'Geotieteiden tohtoriohjelma',
      en: 'Doctoral Programme in Geosciences',
      se: 'Doktorandprogrammet i geovetenskap',
    },
  },
  {
    id: 47,
    key: 'T920103',
    name: {
      fi: 'Historian ja kulttuuriperinnön tohtoriohjelma',
      en: 'Doctoral Programme in History and Cultural Heritage',
      se: 'Doktorandprogrammet i historia och kulturarv',
    },
  },
  {
    id: 48,
    key: 'T921106',
    name: {
      fi: 'Integroivien biotieteiden tohtoriohjelma',
      en: 'Doctoral Programme in Integrative Life Science',
      se: 'Doktorandprogrammet i integrerande biovetenskap',
    },
  },
  {
    id: 49,
    key: 'T922103',
    name: {
      fi: 'Ympäristöalan tieteidenvälinen tohtoriohjelma',
      en: 'Doctoral Programme in Interdisciplinary Environmental Sciences',
      se: 'Doktorandprogrammet i tvärvetenskaplig miljöforskning',
    },
  },
  {
    id: 50,
    key: 'T920104',
    name: {
      fi: 'Kielentutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Language Studies',
      se: 'Doktorandprogrammet i språkforskning',
    },
  },
  {
    id: 51,
    key: 'T920102',
    name: {
      fi: 'Oikeustieteen tohtoriohjelma',
      en: 'Doctoral Programme in Law',
      se: 'Doktorandprogrammet i juridik',
    },
  },
  {
    id: 52,
    key: 'T923106',
    name: {
      fi: 'Materiaalitutkimuksen ja nanotieteiden tohtoriohjelma',
      en: 'Doctoral Programme in Materials Research and Nanoscience',
      se: 'Doktorandprogrammet i materialforskning och nanovetenskap',
    },
  },
  {
    id: 53,
    key: 'T923105',
    name: {
      fi: 'Matematiikan ja tilastotieteen tohtoriohjelma',
      en: 'Doctoral Programme in Mathematics and Statistics',
      se: 'Doktorandprogrammet i matematik och statistik',
    },
  },
  {
    id: 54,
    key: 'T922105',
    name: {
      fi: 'Mikrobiologian ja biotekniikan tohtoriohjelma',
      en: 'Doctoral Programme in Microbiology and Biotechnology',
      se: 'Doktorandprogrammet i mikrobiologi och bioteknik',
    },
  },
  {
    id: 55,
    key: 'T921104',
    name: {
      fi: 'Suun terveystieteen tohtoriohjelma',
      en: 'Doctoral Programme in Oral Sciences',
      se: 'Doktorandprogrammet i oral hälsovetenskap',
    },
  },
  {
    id: 56,
    key: 'T923101',
    name: {
      fi: 'Alkeishiukkasfysiikan ja maailmankaikkeuden tutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Particle Physics and Universe Sciences',
      se: 'Doktorandprogrammet i elementarpartikelfysik och kosmologi',
    },
  },
  {
    id: 57,
    key: 'T920111',
    name: {
      fi: 'Filosofian, taiteiden ja yhteiskunnan tutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Philosophy, Arts and Society',
      se: 'Doktorandprogrammet i filosofi, konstforskning och samhället',
    },
  },
  {
    id: 58,
    key: 'MH57_002',
    name: {
      fi: 'Kasvitieteen tohtoriohjelma',
      en: 'Doctoral Programme in Plant Sciences',
      se: 'Doktorandprogrammet i botanik',
    },
  },
  {
    id: 59,
    key: 'T920107',
    name: {
      fi: 'Poliittisten, yhteiskunnallisten ja alueellisten muutosten tohtoriohjelma',
      en: 'Doctoral Programme in Political, Societal and Regional Changes',
      se: 'Doktorandprogrammet i politisk, samhällelig och regional förändring',
    },
  },
  {
    id: 60,
    key: 'T921103',
    name: {
      fi: 'Väestön terveyden tohtoriohjelma',
      en: 'Doctoral Programme in Population Health',
      se: 'Doktorandprogrammet i befolkningshälsan',
    },
  },
  {
    id: 61,
    key: 'T920110',
    name: {
      fi: 'Psykologian, oppimisen ja kommunikaation tohtoriohjelma',
      en: 'Doctoral Programme in Psychology, Learning and Communication',
      se: 'Doktorandprogrammet i psykologi, lärande och kommunikation',
    },
  },
  {
    id: 62,
    key: 'T920109',
    name: {
      fi: 'Koulun, kasvatuksen, yhteiskunnan ja kulttuurin tohtoriohjelma',
      en: 'Doctoral Programme in School, Education, Society and Culture',
      se: 'Doktorandprogrammet i skola, fostran, samhälle och kultur',
    },
  },
  {
    id: 63,
    key: 'T920106',
    name: {
      fi: 'Sosiaalitieteiden tohtoriohjelma',
      en: 'Doctoral Programme in Social Sciences',
      se: 'Doktorandprogrammet i socialvetenskap',
    },
  },
  {
    id: 64,
    key: 'T922104',
    name: {
      fi: 'Uusiutuvien luonnonvarojen kestävän käytön tohtoriohjelma',
      en: 'Doctoral Programme in Sustainable Use of Renewable Natural Resources',
      se: 'Doktorandprogrammet i hållbart utnyttjande av förnybara naturresurser',
    },
  },
  {
    id: 65,
    key: 'T920101',
    name: {
      fi: 'Teologian ja uskonnontutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Theology and Religious Studies',
      se: 'Doktorandprogrammet i teologi och religionsforskning',
    },
  },
  {
    id: 66,
    key: 'T922101',
    name: {
      fi: 'Luonnonvaraisten eliöiden tutkimuksen tohtoriohjelma',
      en: 'Doctoral Programme in Wildlife Biology',
      se: 'Doktorandprogrammet i forskning om vilda organismer',
    },
  },
  {
    id: 67,
    key: 'KH74_001',
    name: {
      en: "Bachelor's Programme in Social Sciences",
      fi: 'Kandidatprogrammet i samhällsvetenskaper',
      se: 'Kandidatprogrammet i samhällsvetenskaper',
    },
  },
  {
    id: 68,
    key: 'MH50_008',
    name: {
      fi: 'Matematiikan, fysiikan ja kemian opettajan maisteriohjelma',
      en: "Master's Programme for Teachers of Mathematics, Physics and Chemistry",
      se: 'Magisterprogrammet för ämneslärare i matematik, fysik och kemi',
    },
  },
  {
    id: 69,
    key: 'MH80_001',
    name: {
      en: "Master's Programme in Agricultural Sciences",
      fi: 'Maataloustieteiden maisteriohjelma',
      se: 'Magisterprogrammet i lantbruksvetenskaper',
    },
  },
  {
    id: 70,
    key: 'MH80_002',
    name: {
      fi: 'Maatalous-, ympäristö- ja luonnonvaraekonomian maisteriohjelma',
      en: "Master's Programme in Agricultural, Environmental and Resource Economics",
      se: 'Magisterprogrammet i lantbruks -, miljö- och naturresursekonomi',
    },
  },
  {
    id: 71,
    key: 'MH40_012',
    name: {
      fi: 'Alue- ja kulttuurintutkimuksen maisteriohjelma',
      en: "Master's Programme in Area and Cultural Studies",
      se: 'Magisterprogrammet i region- och kulturstudier',
    },
  },
  {
    id: 72,
    key: 'MH40_001',
    name: {
      fi: 'Taiteiden tutkimuksen maisteriohjelma',
      en: "Master's Programme in Art Studies",
      se: 'Magisterprogrammet i konstforskning',
    },
  },
  {
    id: 73,
    key: 'MH50_006',
    name: {
      fi: 'Ilmakehätieteiden maisteriohjelma',
      en: "Master's Programme in Atmospheric Sciences",
      se: 'Magisterprogrammet i atmosfärsvetenskaper',
    },
  },
  {
    id: 74,
    key: 'MH50_007',
    name: {
      fi: 'Kemian ja molekyylitieteiden maisteriohjelma',
      en: "Master's Programme in Chemistry and Molecular Sciences",
      se: 'Magisterprogrammet i kemi och molekylära vetenskaper',
    },
  },
  {
    id: 75,
    key: 'MH50_009',
    name: {
      fi: 'Tietojenkäsittelytieteen maisteriohjelma',
      en: "Master's Programme in Computer Science",
      se: 'Magisterprogrammet i datavetenskap',
    },
  },
  {
    id: 76,
    key: 'MH70_005',
    name: {
      fi: 'Nyky-yhteiskunnan tutkimuksen maisteriohjelma',
      en: "Master's Programme in Contemporary Societies",
      se: 'Magisterprogrammet i moderna samhällen',
    },
  },
  {
    id: 77,
    key: 'MH40_010',
    name: {
      fi: 'Kulttuuriperinnön maisteriohjelma',
      en: "Master's Programme in Cultural Heritage",
      se: 'Magisterprogrammet i kulturarv',
    },
  },
  {
    id: 78,
    key: 'MH40_013',
    name: {
      fi: 'Kulttuurin ja kommunikaation maisteriohjelma',
      en: "Master's Programme in Culture and Communication",
      se: 'Magisterprogrammet i kultur och kommunikation',
    },
  },
  {
    id: 79,
    key: 'MH50_010',
    name: {
      fi: 'Datatieteen maisteriohjelma',
      en: "Master's Programme in Data Science",
      se: 'Magisterprogrammet i data science',
    },
  },
  {
    id: 80,
    key: 'MH57_001',
    name: {
      fi: 'Ekologian ja evoluutiobiologian maisteriohjelma',
      en: "Master's Programme in Ecology and Evolutionary Biology",
      se: 'Magisterprogrammet i ekologi och evolutionsbiologi',
    },
  },
  {
    id: 81,
    key: 'MH70_009',
    name: {
      en: "Master's Programme in Economics",
      fi: 'Taloustieteen maisteriohjelma',
      se: 'Magisterprogrammet i ekonomi',
    },
  },
  {
    id: 82,
    key: 'MH40_003',
    name: {
      fi: 'Englannin kielen ja kirjallisuuden maisteriohjelma',
      en: "Master's Programme in English Studies",
      se: 'Magisterprogrammet i engelska språket och litteraturen',
    },
  },
  {
    id: 83,
    key: 'MH57_005',
    name: {
      fi: 'Ympäristömuutoksen ja globaalin kestävyyden maisteriohjelma',
      en: "Master's Programme in Environmental Change and Global Sustainability",
      se: 'Magisterprogrammet i miljöförändringar och global hållbarhet',
    },
  },
  {
    id: 84,
    key: 'MH70_006',
    name: {
      fi: 'Euroopan ja pohjoismaiden tutkimuksen maisteriohjelma (European and Nordic Studies)',
      en: "Master's Programme in European and Nordic Studies",
      se: 'Magisterprogrammet i Europa- och Nordenstudier',
    },
  },
  {
    id: 85,
    key: 'MH40_007',
    name: {
      fi: 'Suomen kielen ja suomalais-ugrilaisten kielten ja kulttuurien maisteriohjelma',
      en: "Master's Programme in Finnish and Finno-Ugrian Languages and Cultures",
      se: 'Magisterprogrammet i finska och finskugriska språk och kulturer',
    },
  },
  {
    id: 86,
    key: 'MH80_004',
    name: {
      fi: 'Elintarviketieteiden maisteriohjelma',
      en: "Master's Programme in Food Sciences",
      se: 'Magisterprogrammet i livsmedelsvetenskaper',
    },
  },
  {
    id: 87,
    key: 'MH40_014',
    name: {
      fi: 'Sukupuolentutkimuksen maisteriohjelma',
      en: "Master's Programme in Gender Studies",
      se: 'Magisterprogrammet i genusvetenskap',
    },
  },
  {
    id: 88,
    key: 'MH57_003',
    name: {
      fi: 'Genetiikan ja molekulaaristen biotieteiden maisteriohjelma',
      en: "Master's Programme in Genetics and Molecular Biosciences",
      se: 'Magisterprogrammet i genetik och molekylära biovetenskaper',
    },
  },
  {
    id: 89,
    key: 'MH50_012',
    name: {
      fi: 'Maantieteen maisteriohjelma',
      en: "Master's Programme in Geography",
      se: 'Magisterprogrammet i geografi',
    },
  },
  {
    id: 90,
    key: 'MH50_011',
    name: {
      fi: 'Geologian ja geofysiikan maisteriohjelma',
      en: "Master's Programme in Geology and Geophysics",
      se: 'Magisterprogrammet i geologi och geofysik',
    },
  },
  {
    id: 91,
    key: 'MH70_003',
    name: {
      fi: 'Globaalin politiikan ja kommunikaation maisteriohjelma',
      en: "Master's Programme in Global Politics and Communication",
      se: 'Magisterprogrammet i global politik och kommunikation',
    },
  },
  {
    id: 92,
    key: 'MH40_015',
    name: {
      fi: 'Historian maisteriohjelma',
      en: "Master's Programme in History",
      se: 'Magisterprogrammet i historia',
    },
  },
  {
    id: 93,
    key: 'MH80_005',
    name: {
      en: "Master's Programme in Human Nutrition and Food-Related Behaviour",
      fi: 'Ihmisen ravitsemuksen ja ruokakäyttäytymisen maisteriohjelma',
      se: 'Magisterprogrammet i human nutrition och matbeteende',
    },
  },
  {
    id: 94,
    key: 'MH40_011',
    name: {
      fi: 'Kulttuurienvälisen vuorovaikutuksen maisteriohjelma',
      en: "Master's Programme in Intercultural Encounters",
      se: 'Magisterprogrammet i interkulturell växelverkan',
    },
  },
  {
    id: 95,
    key: 'MH20_002',
    name: {
      fi: 'Kansainvälisen liikejuridiikan maisteriohjelma (International Business Law)',
      en: "Master's Programme in International Business Law",
      se: 'Magisterprogrammet i internationell affärsjuridik',
    },
  },
  {
    id: 96,
    key: 'MH40_002',
    name: {
      fi: 'Kielten maisteriohjelma',
      en: "Master's Programme in Languages",
      se: 'Magisterprogrammet i språk',
    },
  },
  {
    id: 97,
    key: 'MH20_001',
    name: {
      fi: 'Oikeustieteen maisterin koulutusohjelma',
      en: "Master's Programme in Law",
      se: 'Magisterprogrammet i rättsvetenskap',
    },
  },
  {
    id: 98,
    key: 'MH50_002',
    name: {
      fi: 'Life Science Informatics -maisteriohjelma',
      en: "Master's Programme in Life Science Informatics",
      se: 'Magisterprogrammet i Life Science Informatics',
    },
  },
  {
    id: 99,
    key: 'MH40_009',
    name: {
      fi: 'Kirjallisuudentutkimuksen maisteriohjelma',
      en: "Master's Programme in Literary Studies",
      se: 'Magisterprogrammet i litteraturvetenskap',
    },
  },
  {
    id: 100,
    key: 'MH30_005',
    name: {
      en: "Master's Programme in Logopedics",
      fi: 'Logopedian maisteriohjelma',
      se: 'Magistgerprogrammet i logopedi',
    },
  },
  {
    id: 101,
    key: 'MH50_005',
    name: {
      fi: 'Materiaalitutkimuksen maisteriohjelma',
      en: "Master's Programme in Materials Research",
      se: 'Magisterprogrammet i materialforskning',
    },
  },
  {
    id: 102,
    key: 'MH50_001',
    name: {
      fi: 'Matematiikan ja tilastotieteen maisteriohjelma',
      en: "Master's Programme in Mathematics and Statistics",
      se: 'Magisterprogrammet i matematik och statistik',
    },
  },
  {
    id: 103,
    key: 'MH57_004',
    name: {
      fi: 'Neurotieteen maisteriohjelma',
      en: "Master's Programme in Neuroscience",
      se: 'Magisterprogrammet i neurovetenskap',
    },
  },
  {
    id: 104,
    key: 'MH50_004',
    name: {
      fi: 'Alkeishiukkasfysiikan ja astrofysikaalisten tieteiden maisteriohjelma',
      en: "Master's Programme in Particle Physics and Astrophysical Sciences",
      se: 'Magisterprogrammet i elementarpartikelfysik och astrofysikaliska vetenskaper',
    },
  },
  {
    id: 105,
    key: 'MH55_001',
    name: {
      en: "Master's Programme in Pharmacy",
      fi: 'Proviisorin koulutusohjelma',
      se: 'Utbildningsprogrammet för provisorsexamen',
    },
  },
  {
    id: 106,
    key: 'MH57_002',
    name: { 
      fi: 'Kasvitieteen maisteriohjelma', 
      en: "Master's Programme in Integrative Plant Sciences", 
      se: 'Magisterprogrammet i botanik' 
    },
  },
  {
    id: 107,
    key: 'T922102',
    name: {
      en: "Master's Programme in Politics, Media and Communication",
      fi: 'Politiikan ja viestinnän maisteriohjelma',
      se: 'Magisterprogrammet i politik, medier och kommunikation',
    },
  },
  {
    id: 108,
    key: 'MH30_004',
    name: {
      fi: 'Psykologian maisteriohjelma',
      en: "Master's Programme in Psychology",
      se: 'Magisterprogrammet i psykologi',
    },
  },
  {
    id: 109,
    key: 'MH40_004',
    name: {
      fi: 'Venäjän tutkimuksen maisteriohjelma',
      en: "Master's Programme in Russian Studies",
      se: 'Magisterprogrammet i ryska studier',
    },
  },
  {
    id: 110,
    key: 'MH40_008',
    name: {
      en: "Master's Programme in Scandinavian Languages and Literatures",
      fi: 'Pohjoismaisten kielten ja kirjallisuuksien maisteriohjelma',
      se: 'Magisterprogrammet i nordiska språk och litteraturer',
    },
  },
  {
    id: 111,
    key: 'MH70_008',
    name: {
      en: "Master's Programme in Social Research",
      fi: 'Sosiaalitieteiden maisteriohjelma',
      se: 'Magisterprogrammet i sociala vetenskaper',
    },
  },
  {
    id: 112,
    key: 'MH70_007',
    name: {
      fi: 'Yhteiskuntatieteiden maisteriohjelma',
      en: "Master's Programme in Social Sciences",
      se: 'Magisterprogrammet i samhällsvetenskaper',
    },
  },
  {
    id: 113,
    key: 'MH70_004',
    name: {
      en: "Master's Programme in Society and Change",
      fi: 'Yhteiskunnallisen muutoksen maisteriohjelma',
      se: 'Magisterprogrammet för samhälle i förändring',
    },
  },
  {
    id: 114,
    key: 'MH10_001',
    name: {
      en: "Master's Programme in Theology and Religious Studies",
      fi: 'Teologian ja uskonnontutkimuksen maisteriohjelma',
      se: 'Magisterprogrammet i teologi och religionsforskning',
    },
  },
  {
    id: 115,
    key: 'MH50_003',
    name: {
      fi: 'Teoreettisten ja laskennallisten menetelmien maisteriohjelma',
      en: "Master's Programme in Theoretical and Computational Methods",
      se: 'Magisterprogrammet i teoretiska och beräkningsmetoder',
    },
  },
  {
    id: 116,
    key: 'MH40_006',
    name: {
      fi: 'Kääntämisen ja tulkkauksen maisteriohjelma',
      en: "Master's Programme in Translation and Interpreting",
      se: 'Magisterprogrammet i översättning och tolkning',
    },
  },
  {
    id: 117,
    key: 'MH30_002',
    name: {
      fi: 'Translationaalisen lääketieteen maisteriohjelma (Translational Medicine)',
      en: "Master's Programme in Translational Medicine",
      se: 'Magisterprogrammet i translationell medicin',
    },
  },
  {
    id: 118,
    key: 'MH50_013',
    name: {
      fi: 'Kaupunkitutkimuksen ja suunnittelun maisteriohjelma',
      en: "Master's Programme in Urban Studies and Planning",
      se: 'Magisterprogrammet i urbana studier och planering',
    },
  },
  {
    id: 119,
    key: 'MH80_006',
    name: {
      en: "Master's Programme in Food Economy and Consumption",
      fi: 'Elintarviketalouden ja kulutuksen maisteriohjelma',
      se: 'Magisterprogrammet i livsmedelsekonomi och konsumtion',
    },
  },
  {
    id: 120,
    key: 'MH40_005',
    name: {
      en: "Master's Programme Linguistic Diversity in the Digital Age",
      fi: 'Kielellisen diversiteetin ja digitaalisten menetelmien maisteriohjelma',
      se: 'Magisterprogrammet i språklig diversitet och digitala metoder',
    },
  },
  {
    id: 121,
    key: 'msc_changing_education_(2020_lähtien)',
    name: {
      fi: '',
      en: 'Master´s Programme in Changing Education (2020 lähtien)',
      se: '',
    },
  },
  {
    id: 122,
    key: 'MH60_001',
    name: {
      fi: 'Kasvatustieteiden maisteriohjelma',
      en: 'Master´s Programme in Education',
      se: 'Magisterprogrammet i pedagogik',
    },
  },
  {
    id: 123,
    key: 'MH80_003',
    name: {
      fi: 'Metsätieteiden maisteriohjelma',
      en: 'Master´s Programme in Forest Sciences',
      se: 'Magisterprogrammet i skogsvetenskaper',
    },
  },
  {
    id: 124,
    key: 'msc_global_governance_law_(2020_lähtien)',
    name: {
      fi: '',
      en: 'Master´s Programme in Global Governance Law (2020 lähtien)',
      se: '',
    },
  },
  {
    id: 125,
    key: 'MH80_007',
    name: {
      fi: 'Mikrobiologian ja mikrobibiotekniikan maisteriohjelma',
      en: 'Master´s Programme in Microbiology and Microbial Biotechnology',
      se: 'Magisterprogrammet i mikrobiologi och mikrobiell bioteknik',
    },
  },
  {
    id: 126,
    key: 'MH70_001',
    name: {
      fi: 'Filosofian maisteriohjelma',
      en: 'Master´s Programme in Philosophy',
      se: 'Magisterprogrammet i filosofi',
    },
  },
]

module.exports = {
  ...common,
  DB_URL,
  PORT,
  programmes,
}
