const formKeys = {
  YEARLY_ASSESSMENT: 1,
  DEGREE_REFORM_PROGRAMMES: 2,
  DEGREE_REFORM_INDIVIDUALS: 3,
  EVALUATION_PROGRAMMES: 4,
  EVALUATION_FACULTIES: 5,
  EVALUATION_COMMTTEES: 6,
  META_EVALUATION: 7,
  FACULTY_MONITORING: 8,
}

const forms = [
  {
    key: 1,
    name: 'Vuosiseuranta 2019 - 2023',
    type: 'yearlyAssessment',
  },
  {
    key: 2,
    name: 'Koulutusuudistusarviointi - koulutusohjelmat',
    type: 'degree-reform',
  },
  {
    key: 3,
    name: 'Koulutusuudistusarviointi - yksilöt',
    type: 'degree-reform',
  },
  {
    key: 4,
    name: 'Katselmus - koulutusohjelmat',
    type: 'evaluation',
  },
  {
    key: 5,
    name: 'Katselmus - tiedekunnat',
    type: 'evaluation',
  },
  {
    key: 6,
    name: 'Katselmus - yliopisto',
    type: 'evaluation',
  },
  {
    key: 7,
    name: 'Katselmus - toimeenpano',
    type: 'evaluation',
  },
  {
    key: 8,
    name: 'Toimenpiteiden toteutus ja seuranta tiedekunnissa',
    type: 'evaluation',
  },
  {
    key: 10,
    name: 'Vuosiseuranta - UUSI',
    type: 'yearlyAssessment',
  },
]

const facultyList = [
  {
    code: 'H10',
    name: {
      fi: 'Teologinen tiedekunta',
      en: 'Faculty of Theology',
      se: 'Teologiska fakulteten',
    },
  },
  {
    code: 'H20',
    name: {
      fi: 'Oikeustieteellinen tiedekunta',
      en: 'Faculty of Law',
      se: 'Juridiska fakulteten',
    },
  },
  {
    code: 'H30',
    name: {
      fi: 'Lääketieteellinen tiedekunta',
      en: 'Faculty of Medicine',
      se: 'Medicinska fakulteten',
    },
  },
  {
    code: 'H40',
    name: {
      fi: 'Humanistinen tiedekunta',
      en: 'Faculty of Arts',
      se: 'Humanistiska fakulteten',
    },
  },
  {
    code: 'H50',
    name: {
      fi: 'Matemaattis-luonnontieteellinen tiedekunta',
      en: 'Faculty of Science',
      se: 'Matematisk-naturvetenskapliga fakulteten',
    },
  },
  {
    code: 'H55',
    name: {
      fi: 'Farmasian tiedekunta',
      en: 'Faculty of Pharmacy',
      se: 'Farmaceutiska fakulteten',
    },
  },
  {
    code: 'H57',
    name: {
      fi: 'Bio- ja ympäristötieteellinen tiedekunta',
      en: 'Faculty of Biological and Environmental Sciences',
      se: 'Biologiska och miljövetenskapliga fakulteten',
    },
  },
  {
    code: 'H60',
    name: {
      fi: 'Kasvatustieteellinen tiedekunta',
      en: 'Faculty of Educational Sciences',
      se: 'Pedagogiska fakulteten',
    },
  },
  {
    code: 'H70',
    name: {
      fi: 'Valtiotieteellinen tiedekunta',
      en: 'Faculty of Social Sciences',
      se: 'Statsvetenskapliga fakulteten',
    },
  },
  {
    code: 'H74',
    name: {
      fi: 'Svenska social- och kommunalhögskolan',
      en: 'Swedish School of Social Science',
      se: 'Svenska social- och kommunalhögskolan',
    },
  },
  {
    code: 'H80',
    name: {
      fi: 'Maatalous-metsätieteellinen tiedekunta',
      en: 'Faculty of Agriculture and Forestry',
      se: 'Agrikultur-forstvetenskapliga fakulteten',
    },
  },
  {
    code: 'H90',
    name: {
      fi: 'Eläinlääketieteellinen tiedekunta',
      en: 'Faculty of Veterinary Medicine',
      se: 'Veterinärmedicinska fakulteten',
    },
  },
]

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
  testauksellinen: 'HTEST',
}

const committeeList = [
  {
    code: 'UNI',
    name: {
      fi: 'Yliopistotaso',
      en: 'University level',
      se: 'Universitetsnivå',
    },
  },
  {
    code: 'UNI_EN',
    name: {
      fi: 'Yliopistotaso',
      en: 'University level',
      se: 'Universitetsnivå',
    },
  },
  {
    code: 'UNI_SE',
    name: {
      fi: 'Yliopistotaso',
      en: 'University level',
      se: 'Universitetsnivå',
    },
  },
]

export { forms, formKeys, facultyMap, committeeList, facultyList }
