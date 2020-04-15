const common = require('@root/config/common')

const DB_URL = process.env.DB_URL || ''
const PORT = process.env.PORT || 8000

const programmes = [
  {
    id: 0,
    key: 'bsc_teachers_of_mathematics_physics_and_chemistry',
    name: {
      fi: '',
      en: "Bachelor's Programme for Teachers of Mathematics, Physics and Chemistry",
      se: '',
    },
  },
  {
    id: 1,
    key: 'bsc_agricultural_sciences',
    name: {
      fi: '',
      en: "Bachelor's Programme in Agricultural Sciences",
      se: '',
    },
  },
  {
    id: 2,
    key: 'bsc_art_studies',
    name: { fi: '', en: "Bachelor's Programme in Art Studies", se: '' },
  },
  {
    id: 3,
    key: 'bsc_biology',
    name: { fi: '', en: "Bachelor's Programme in Biology", se: '' },
  },
  {
    id: 4,
    key: 'bsc_chemistry',
    name: { fi: '', en: "Bachelor's Programme in Chemistry", se: '' },
  },
  {
    id: 5,
    key: 'bsc_computer_science',
    name: { fi: '', en: "Bachelor's Programme in Computer Science", se: '' },
  },
  {
    id: 6,
    key: 'bsc_cultural_studies',
    name: { fi: '', en: "Bachelor's Programme in Cultural Studies", se: '' },
  },
  {
    id: 7,
    key: 'bsc_economics',
    name: { fi: '', en: "Bachelor's Programme in Economics", se: '' },
  },
  {
    id: 8,
    key: 'bsc_education',
    name: { fi: '', en: "Bachelor's Programme in Education", se: '' },
  },
  {
    id: 9,
    key: 'bsc_environmental_and_food_economics',
    name: {
      fi: '',
      en: "Bachelor's Programme in Environmental and Food Economics",
      se: '',
    },
  },
  {
    id: 10,
    key: 'bsc_environmental_sciences',
    name: {
      fi: '',
      en: "Bachelor's Programme in Environmental Sciences",
      se: '',
    },
  },
  {
    id: 11,
    key: 'bsc_food_sciences',
    name: { fi: '', en: "Bachelor's Programme in Food Sciences", se: '' },
  },
  {
    id: 12,
    key: 'bsc_forest_sciences',
    name: { fi: '', en: "Bachelor's Programme in Forest Sciences", se: '' },
  },
  {
    id: 13,
    key: 'bsc_geography',
    name: { fi: '', en: "Bachelor's Programme in Geography", se: '' },
  },
  {
    id: 14,
    key: 'bsc_geosciences',
    name: { fi: '', en: "Bachelor's Programme in Geosciences", se: '' },
  },
  {
    id: 15,
    key: 'bsc_history',
    name: { fi: '', en: "Bachelor's Programme in History", se: '' },
  },
  {
    id: 16,
    key: 'bsc_languages',
    name: { fi: '', en: "Bachelor's Programme in Languages", se: '' },
  },
  {
    id: 17,
    key: 'bsc_law',
    name: { fi: '', en: "Bachelor's Programme in Law", se: '' },
  },
  {
    id: 18,
    key: 'bsc_logopedics',
    name: { fi: '', en: "Bachelor's Programme in Logopedics", se: '' },
  },
  {
    id: 19,
    key: 'bsc_mathematical_sciences',
    name: {
      fi: '',
      en: "Bachelor's Programme in Mathematical Sciences",
      se: '',
    },
  },
  {
    id: 20,
    key: 'bsc_molecular_biosciences',
    name: {
      fi: '',
      en: "Bachelor's Programme in Molecular Biosciences",
      se: '',
    },
  },
  {
    id: 21,
    key: 'bsc_pharmacy',
    name: { fi: '', en: "Bachelor's Programme in Pharmacy", se: '' },
  },
  {
    id: 22,
    key: 'bsc_philosophy',
    name: { fi: '', en: "Bachelor's Programme in Philosophy", se: '' },
  },
  {
    id: 23,
    key: 'bsc_physical_sciences',
    name: { fi: '', en: "Bachelor's Programme in Physical Sciences", se: '' },
  },
  {
    id: 24,
    key: 'bsc_politics_media_and_communication',
    name: {
      fi: '',
      en: "Bachelor's Programme in Politics, Media and Communication",
      se: '',
    },
  },
  {
    id: 25,
    key: 'bsc_psychology',
    name: { fi: '', en: "Bachelor's Programme in Psychology", se: '' },
  },
  {
    id: 26,
    key: 'bsc_social_research',
    name: { fi: '', en: "Bachelor's Programme in Social Research", se: '' },
  },
  {
    id: 27,
    key: 'bsc_society_and_change',
    name: {
      fi: '',
      en: "Bachelor's Programme in Society and Change",
      se: '',
    },
  },
  {
    id: 28,
    key: 'bsc_the_languages_and_literatures_of_finland',
    name: {
      fi: '',
      en: "Bachelor's Programme in the Languages and Literatures of Finland",
      se: '',
    },
  },
  {
    id: 29,
    key: 'bsc_theology_and_religious_studies',
    name: {
      fi: '',
      en: "Bachelor's Programme in Theology and Religious Studies",
      se: '',
    },
  },
  {
    id: 30,
    key: 'bsc_veterinary_medicine',
    name: {
      fi: '',
      en: "Bachelor's Programme in Veterinary Medicine",
      se: '',
    },
  },
  {
    id: 31,
    key: 'bsc_science',
    name: {
      fi: '',
      en: 'Bachelor´s Programme in Science (since 2019)',
      se: '',
    },
  },
  {
    id: 32,
    key: 'dp_dentistry',
    name: { fi: '', en: 'Degree Programme in Dentistry', se: '' },
  },
  {
    id: 33,
    key: 'dp_medicine',
    name: { fi: '', en: 'Degree Programme in Medicine', se: '' },
  },
  {
    id: 34,
    key: 'dp_veterinary_medicine',
    name: { fi: '', en: 'Degree Programme in Veterinary Medicine', se: '' },
  },
  {
    id: 35,
    key: 'dp_brain_mind',
    name: { fi: '', en: 'Doctoral Programme Brain & Mind', se: '' },
  },
  {
    id: 36,
    key: 'phd_atmospheric_sciences',
    name: {
      fi: '',
      en: 'Doctoral Programme in Atmospheric Sciences',
      se: '',
    },
  },
  {
    id: 37,
    key: 'phd_biomedicine',
    name: { fi: '', en: 'Doctoral Programme in Biomedicine', se: '' },
  },
  {
    id: 38,
    key: 'phd_chemistry_and_molecular_sciences',
    name: {
      fi: '',
      en: 'Doctoral Programme in Chemistry and Molecular Sciences',
      se: '',
    },
  },
  {
    id: 39,
    key: 'phd_clinical_research',
    name: { fi: '', en: 'Doctoral Programme in Clinical Research', se: '' },
  },
  {
    id: 40,
    key: 'phd_clinical_veterinary_medicine',
    name: {
      fi: '',
      en: 'Doctoral Programme in Clinical Veterinary Medicine',
      se: '',
    },
  },
  {
    id: 41,
    key: 'phd_computer_science',
    name: { fi: '', en: 'Doctoral Programme in Computer Science', se: '' },
  },
  {
    id: 42,
    key: 'phd_drug_research',
    name: { fi: '', en: 'Doctoral Programme in Drug Research', se: '' },
  },
  {
    id: 43,
    key: 'phd_economics',
    name: { fi: '', en: 'Doctoral Programme in Economics', se: '' },
  },
  {
    id: 44,
    key: 'phd_food_chain_and_health',
    name: {
      fi: '',
      en: 'Doctoral Programme in Food Chain and Health',
      se: '',
    },
  },
  {
    id: 45,
    key: 'phd_gender_culture_and_society',
    name: {
      fi: '',
      en: 'Doctoral Programme in Gender, Culture and Society',
      se: '',
    },
  },
  {
    id: 46,
    key: 'phd_geosciences',
    name: { fi: '', en: 'Doctoral Programme in Geosciences', se: '' },
  },
  {
    id: 47,
    key: 'phd_history_and_cultural_heritage',
    name: {
      fi: '',
      en: 'Doctoral Programme in History and Cultural Heritage',
      se: '',
    },
  },
  {
    id: 48,
    key: 'phd_integrative_life_science',
    name: {
      fi: '',
      en: 'Doctoral Programme in Integrative Life Science',
      se: '',
    },
  },
  {
    id: 49,
    key: 'phd_interdisciplinary_environmental_sciences',
    name: {
      fi: '',
      en: 'Doctoral Programme in Interdisciplinary Environmental Sciences',
      se: '',
    },
  },
  {
    id: 50,
    key: 'phd_language_studies',
    name: { fi: '', en: 'Doctoral Programme in Language Studies', se: '' },
  },
  {
    id: 51,
    key: 'phd_law',
    name: { fi: '', en: 'Doctoral Programme in Law', se: '' },
  },
  {
    id: 52,
    key: 'phd_materials_research_and_nanoscience',
    name: {
      fi: '',
      en: 'Doctoral Programme in Materials Research and Nanoscience',
      se: '',
    },
  },
  {
    id: 53,
    key: 'phd_mathematics_and_statistics',
    name: {
      fi: '',
      en: 'Doctoral Programme in Mathematics and Statistics',
      se: '',
    },
  },
  {
    id: 54,
    key: 'phd_microbiology_and_biotechnology',
    name: {
      fi: '',
      en: 'Doctoral Programme in Microbiology and Biotechnology',
      se: '',
    },
  },
  {
    id: 55,
    key: 'phd_oral_sciences',
    name: { fi: '', en: 'Doctoral Programme in Oral Sciences', se: '' },
  },
  {
    id: 56,
    key: 'phd_particle_physics_and_universe_sciences',
    name: {
      fi: '',
      en: 'Doctoral Programme in Particle Physics and Universe Sciences',
      se: '',
    },
  },
  {
    id: 57,
    key: 'phd_philosophy_arts_and_society',
    name: {
      fi: '',
      en: 'Doctoral Programme in Philosophy, Arts and Society',
      se: '',
    },
  },
  {
    id: 58,
    key: 'phd_plant_sciences',
    name: { fi: '', en: 'Doctoral Programme in Plant Sciences', se: '' },
  },
  {
    id: 59,
    key: 'phd_political_societal_and_regional_changes',
    name: {
      fi: '',
      en: 'Doctoral Programme in Political, Societal and Regional Changes',
      se: '',
    },
  },
  {
    id: 60,
    key: 'phd_population_health',
    name: { fi: '', en: 'Doctoral Programme in Population Health', se: '' },
  },
  {
    id: 61,
    key: 'phd_psychology_learning_and_communication',
    name: {
      fi: '',
      en: 'Doctoral Programme in Psychology, Learning and Communication',
      se: '',
    },
  },
  {
    id: 62,
    key: 'phd_school_education_society_and_culture',
    name: {
      fi: '',
      en: 'Doctoral Programme in School, Education, Society and Culture',
      se: '',
    },
  },
  {
    id: 63,
    key: 'phd_social_sciences',
    name: { fi: '', en: 'Doctoral Programme in Social Sciences', se: '' },
  },
  {
    id: 64,
    key: 'phd_sustainable_use_of_renewable_natural_resources',
    name: {
      fi: '',
      en: 'Doctoral Programme in Sustainable Use of Renewable Natural Resources',
      se: '',
    },
  },
  {
    id: 65,
    key: 'phd_theology_and_religious_studies',
    name: {
      fi: '',
      en: 'Doctoral Programme in Theology and Religious Studies',
      se: '',
    },
  },
  {
    id: 66,
    key: 'phd_wildlife_biology',
    name: { fi: '', en: 'Doctoral Programme in Wildlife Biology', se: '' },
  },
  {
    id: 67,
    key: 'phd_samhallvetenskaper',
    name: { fi: '', en: 'Kandidatprogrammet i samhällsvetenskaper', se: '' },
  },
  {
    id: 68,
    key: 'msc_teachers_of_mathematics_physics_chemistry',
    name: {
      fi: '',
      en: "Master's Programme for Teachers of Mathematics, Physics and Chemistry",
      se: '',
    },
  },
  {
    id: 69,
    key: 'msc_agricultural_sciences',
    name: {
      fi: '',
      en: "Master's Programme in Agricultural Sciences",
      se: '',
    },
  },
  {
    id: 70,
    key: 'msc_agricultural_environmental_and_resource_economics',
    name: {
      fi: '',
      en: "Master's Programme in Agricultural, Environmental and Resource Economics",
      se: '',
    },
  },
  {
    id: 71,
    key: 'msc_area_and_cultural_studies',
    name: {
      fi: '',
      en: "Master's Programme in Area and Cultural Studies",
      se: '',
    },
  },
  {
    id: 72,
    key: 'msc_art_studies',
    name: { fi: '', en: "Master's Programme in Art Studies", se: '' },
  },
  {
    id: 73,
    key: 'msc_atmospheric_sciences',
    name: {
      fi: '',
      en: "Master's Programme in Atmospheric Sciences",
      se: '',
    },
  },
  {
    id: 74,
    key: 'msc_chemistry_and_molecular_sciences',
    name: {
      fi: '',
      en: "Master's Programme in Chemistry and Molecular Sciences",
      se: '',
    },
  },
  {
    id: 75,
    key: 'msc_computer_science',
    name: { fi: '', en: "Master's Programme in Computer Science", se: '' },
  },
  {
    id: 76,
    key: 'msc_contemporary_societies',
    name: {
      fi: '',
      en: "Master's Programme in Contemporary Societies",
      se: '',
    },
  },
  {
    id: 77,
    key: 'msc_cultural_heritage',
    name: { fi: '', en: "Master's Programme in Cultural Heritage", se: '' },
  },
  {
    id: 78,
    key: 'msc_culture_and_communication_(in_swedish)',
    name: {
      fi: '',
      en: "Master's Programme in Culture and Communication (in Swedish)",
      se: '',
    },
  },
  {
    id: 79,
    key: 'msc_data_science',
    name: { fi: '', en: "Master's Programme in Data Science", se: '' },
  },
  {
    id: 80,
    key: 'msc_ecology_and_evolutionary_biology',
    name: {
      fi: '',
      en: "Master's Programme in Ecology and Evolutionary Biology",
      se: '',
    },
  },
  {
    id: 81,
    key: 'msc_economics',
    name: { fi: '', en: "Master's Programme in Economics", se: '' },
  },
  {
    id: 82,
    key: 'msc_english_studies',
    name: { fi: '', en: "Master's Programme in English Studies", se: '' },
  },
  {
    id: 83,
    key: 'msc_environmental_change_and_global_sustainability',
    name: {
      fi: '',
      en: "Master's Programme in Environmental Change and Global Sustainability",
      se: '',
    },
  },
  {
    id: 84,
    key: 'msc_european_and_nordic_studies',
    name: {
      fi: '',
      en: "Master's Programme in European and Nordic Studies",
      se: '',
    },
  },
  {
    id: 85,
    key: 'msc_finnish_and_finno-ugrian_languages_and_cultures',
    name: {
      fi: '',
      en: "Master's Programme in Finnish and Finno-Ugrian Languages and Cultures",
      se: '',
    },
  },
  {
    id: 86,
    key: 'msc_food_sciences',
    name: { fi: '', en: "Master's Programme in Food Sciences", se: '' },
  },
  {
    id: 87,
    key: 'msc_gender_studies',
    name: { fi: '', en: "Master's Programme in Gender Studies", se: '' },
  },
  {
    id: 88,
    key: 'msc_genetics_and_molecular_biosciences',
    name: {
      fi: '',
      en: "Master's Programme in Genetics and Molecular Biosciences",
      se: '',
    },
  },
  {
    id: 89,
    key: 'msc_geography',
    name: { fi: '', en: "Master's Programme in Geography", se: '' },
  },
  {
    id: 90,
    key: 'msc_geology_and_geophysics',
    name: {
      fi: '',
      en: "Master's Programme in Geology and Geophysics",
      se: '',
    },
  },
  {
    id: 91,
    key: 'msc_global_politics_and_communication',
    name: {
      fi: '',
      en: "Master's Programme in Global Politics and Communication",
      se: '',
    },
  },
  {
    id: 92,
    key: 'msc_history',
    name: { fi: '', en: "Master's Programme in History", se: '' },
  },
  {
    id: 93,
    key: 'msc_human_nutrition_and_food_behaviour',
    name: {
      fi: '',
      en: "Master's Programme in Human Nutrition and Food Behaviour",
      se: '',
    },
  },
  {
    id: 94,
    key: 'msc_intercultural_encounters',
    name: {
      fi: '',
      en: "Master's Programme in Intercultural Encounters",
      se: '',
    },
  },
  {
    id: 95,
    key: 'msc_international_business_law',
    name: {
      fi: '',
      en: "Master's Programme in International Business Law",
      se: '',
    },
  },
  {
    id: 96,
    key: 'msc_languages',
    name: { fi: '', en: "Master's Programme in Languages", se: '' },
  },
  {
    id: 97,
    key: 'msc_law',
    name: { fi: '', en: "Master's Programme in Law", se: '' },
  },
  {
    id: 98,
    key: 'msc_life_science_informatics',
    name: {
      fi: '',
      en: "Master's Programme in Life Science Informatics",
      se: '',
    },
  },
  {
    id: 99,
    key: 'msc_literary_studies',
    name: { fi: '', en: "Master's Programme in Literary Studies", se: '' },
  },
  {
    id: 100,
    key: 'msc_logopedics',
    name: { fi: '', en: "Master's Programme in Logopedics", se: '' },
  },
  {
    id: 101,
    key: 'msc_materials_research',
    name: { fi: '', en: "Master's Programme in Materials Research", se: '' },
  },
  {
    id: 102,
    key: 'msc_mathematics_and_statistics',
    name: {
      fi: '',
      en: "Master's Programme in Mathematics and Statistics",
      se: '',
    },
  },
  {
    id: 103,
    key: 'msc_neuroscience',
    name: { fi: '', en: "Master's Programme in Neuroscience", se: '' },
  },
  {
    id: 104,
    key: 'msc_particle_physics_and_astrophysical_sciences',
    name: {
      fi: '',
      en: "Master's Programme in Particle Physics and Astrophysical Sciences",
      se: '',
    },
  },
  {
    id: 105,
    key: 'msc_pharmacy',
    name: { fi: '', en: "Master's Programme in Pharmacy", se: '' },
  },
  {
    id: 106,
    key: 'msc_plant_biology',
    name: { fi: '', en: "Master's Programme in Plant Biology", se: '' },
  },
  {
    id: 107,
    key: 'msc_politics_media_and_communication',
    name: {
      fi: '',
      en: "Master's Programme in Politics, Media and Communication",
      se: '',
    },
  },
  {
    id: 108,
    key: 'msc_psychology',
    name: { fi: '', en: "Master's Programme in Psychology", se: '' },
  },
  {
    id: 109,
    key: 'msc_russian_studies',
    name: { fi: '', en: "Master's Programme in Russian Studies", se: '' },
  },
  {
    id: 110,
    key: 'msc_scandinavian_languages_and_literature',
    name: {
      fi: '',
      en: "Master's Programme in Scandinavian Languages and Literature",
      se: '',
    },
  },
  {
    id: 111,
    key: 'msc_social_research',
    name: { fi: '', en: "Master's Programme in Social Research", se: '' },
  },
  {
    id: 112,
    key: 'msc_social_sciences_(in_swedish)',
    name: {
      fi: '',
      en: "Master's Programme in Social Sciences (in Swedish)",
      se: '',
    },
  },
  {
    id: 113,
    key: 'msc_society_and_change',
    name: { fi: '', en: "Master's Programme in Society and Change", se: '' },
  },
  {
    id: 114,
    key: 'msc_theology_and_religious_studies',
    name: {
      fi: '',
      en: "Master's Programme in Theology and Religious Studies",
      se: '',
    },
  },
  {
    id: 115,
    key: 'msc_theoretical_and_computational_methods',
    name: {
      fi: '',
      en: "Master's Programme in Theoretical and Computational Methods",
      se: '',
    },
  },
  {
    id: 116,
    key: 'msc_translation_and_interpreting',
    name: {
      fi: '',
      en: "Master's Programme in Translation and Interpreting",
      se: '',
    },
  },
  {
    id: 117,
    key: 'msc_translational_medicine',
    name: {
      fi: '',
      en: "Master's Programme in Translational Medicine",
      se: '',
    },
  },
  {
    id: 118,
    key: 'msc_urban_studies_and_planning',
    name: {
      fi: '',
      en: "Master's Programme in Urban Studies and Planning",
      se: '',
    },
  },
  {
    id: 119,
    key: 'msc_food_economy_and_consumption',
    name: {
      fi: '',
      en: 'Master’s Program in Food Economy and Consumption',
      se: '',
    },
  },
  {
    id: 120,
    key: 'msc_linguistic_diversity_in_the_digital_age',
    name: {
      fi: '',
      en: 'Master’s programme Linguistic Diversity in the Digital Age',
      se: '',
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
    key: 'msc_education',
    name: { fi: '', en: 'Master´s Programme in Education', se: '' },
  },
  {
    id: 123,
    key: 'msc_forest_sciences',
    name: { fi: '', en: 'Master´s Programme in Forest Sciences', se: '' },
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
    key: 'msc_microbiology_and_microbial_biotechnology',
    name: {
      fi: '',
      en: 'Master´s Programme in Microbiology and Microbial Biotechnology',
      se: '',
    },
  },
  {
    id: 126,
    key: 'msc_philosophy',
    name: { fi: '', en: 'Master´s Programme in Philosophy', se: '' },
  },
]

module.exports = {
  ...common,
  DB_URL,
  PORT,
  programmes,
}
