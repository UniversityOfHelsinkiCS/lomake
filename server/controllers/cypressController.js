import { Op } from 'sequelize'
import moment from 'moment'
import db from '../models/index.js'
import KeyData from '../models/keyData.js'
import Report from '../models/reports.js'
import logger from '../util/logger.js'
import { testProgrammeCode, defaultYears } from '../util/common.js'
import { createDraftAnswers } from '../scripts/draftAndFinalAnswers.js'
import { facultyList } from '../../config/data.js'

const getFakeYearlyAnswers = year => {
  const fields = [
    'feedback_text',
    'guidance_text',
    'feedback_light',
    'guidance_light',
    'curriculum_text',
    'management_text',
    'measures_1_text',
    'measures_2_text',
    'resourcing_text',
    'curriculum_light',
    'management_light',
    'resourcing_light',
    'employability_text',
    'employability_light',
    'teacher_skills_text',
    'teacher_skills_light',
    'student_feedback_text',
    'learning_outcomes_text',
    'learning_outcomes_light',
    'programme_identity_text',
    'student_admissions_text',
    'teaching_resources_text',
    'community_wellbeing_text',
    'cooperation_success_text',
    'programme_identity_light',
    'student_admissions_light',
    'teaching_resources_light',
    'community_wellbeing_light',
    'cooperation_success_light',
    'language_environment_text',
    'language_environment_light',
    'recruitment_influence_text',
    'recruitment_influence_light',
    'wellbeing_information_used_text',
    'wellbeing_information_needed_text',
    'overall_status_information_used_text',
    'successes_and_development_needs_text',
    'joint_programme_information_used_text',
    'overall_status_information_needed_text',
    'joint_programme_information_needed_text',
    'review_of_last_years_situation_report_text',
    'sufficient_resources_information_used_text',
    'review_of_last_years_situation_report_light',
    'sufficient_resources_information_needed_text',
  ]

  return fields.reduce((pre, cur) => {
    return {
      ...pre,
      [cur]: cur.includes('light') ? 'green' : `Hello from ${year}`,
    }
  }, {})
}

const resetForm = async () => {
  try {
    logger.info('Cypress::resetForm')

    await db.tempAnswer.destroy({
      where: {
        programme: testProgrammeCode,
      },
    })
    // clean individual user test inputs
    await db.tempAnswer.destroy({
      where: {
        [Op.or]: [
          { programme: { [Op.startsWith]: 'cypressSuperAdminUser' } },
          { programme: 'cypressSuperAdminUser' },
          { programme: 'cypressUser' },
          { programme: 'cypressNoRightsUser' },
        ],
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetAnswers = async () => {
  try {
    logger.info('Cypress::clearAnswers')

    await db.answer.destroy({
      where: {
        programme: testProgrammeCode,
      },
    })
    // clean individual user test inputs
    await db.answer.destroy({
      where: {
        [Op.or]: [
          { programme: { [Op.startsWith]: 'cypressSuperAdminUser' } },
          { programme: 'cypressSuperAdminUser' },
          { programme: { [Op.startsWith]: 'cypressUser' } },
          { programme: { [Op.startsWith]: 'cypressNoRightsUser' } },
        ],
      },
    })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetDeadlines = async () => {
  const deadline = moment().add(7, 'days')
  const draftYear = defaultYears[0]
  const form = 1

  try {
    // Unlock all programmes
    await db.studyprogramme.update(
      {
        locked: false,
        lockedForms: { evaluation: false, yearly: false, 'degree-reform': false, 'evaluation-faculty': false },
      },
      { where: {} },
    )

    // Close all deadlines and create new for yearly form
    await db.deadline.destroy({
      truncate: true,
    })
    await db.deadline.create({
      date: deadline,
      form,
    })

    // Create new or update old draft year
    const existingDraftYears = await db.draftYear.findAll({})
    if (existingDraftYears.length === 0) {
      await db.draftYear.create({
        year: draftYear,
      })
    } else {
      existingDraftYears[0].year = draftYear
      await existingDraftYears[0].save()
    }

    await createDraftAnswers(draftYear, form)
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetKeyData = async () => {
  try {
    logger.info('Cypress::resetKeyData')

    await KeyData.destroy({ where: {} })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const resetReports = async () => {
  try {
    logger.info('Cypress::resetReports')

    await Report.destroy({ where: {} })
  } catch (error) {
    logger.error(`Database error: ${error}`)
  }
}

const seed = async (_, res) => {
  try {
    logger.info('Cypress::seeding database')

    await resetAnswers()
    await resetForm()
    await resetDeadlines()
    await resetKeyData()
    await resetReports()

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createAnswers = async (req, res) => {
  const form = req.params.form || 1
  try {
    logger.info('Cypress::creating answers')

    await db.answer.destroy({ where: {} })
    await db.tempAnswer.destroy({ where: {} })

    const programmes = await db.studyprogramme.findAll({})

    defaultYears.forEach(async year => {
      const fakeanswers = getFakeYearlyAnswers(year)
      const currentYear = new Date().getFullYear()

      programmes.forEach(async prog => {
        if (year !== currentYear) {
          await db.answer.create({
            programme: prog.key,
            data: fakeanswers,
            year,
            form,
            submittedBy: 'cypressFakeTest',
          })
        }
        await db.tempAnswer.create({
          data: {},
          programme: prog.key,
          year,
          form,
        })
      })
    })

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const createFacultyAnswers = async (req, res) => {
  const form = req.params.form || 8
  try {
    logger.info('Cypress::creating answers')

    await db.tempAnswer.destroy({ where: {} })

    const promises = facultyList.map(async faculty => {
      const facultyPromises = []
      const answerData = { selectedQuestionIds: [] }

      for (let i = 1; i <= 30; i++) {
        answerData[`${i}_modal`] = ''
        answerData[`${i}_actions_text`] = `Action text for ${i}`
        answerData[`${i}_degree_radio`] = 'both'
        answerData[`${i}_end_date_text`] = new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString() // Example end date
        answerData[`${i}_lights_history`] = [
          {
            date: new Date().toISOString(),
            color: 'green',
            value: 1,
          },
        ]
        answerData[`${i}_resources_text`] = `Resource text for ${i}`
        answerData[`${i}_start_date_text`] = new Date(Date.now() + (i - 1) * 24 * 60 * 60 * 1000).toISOString() // Example start date
        answerData[`${i}_contact_person_text`] = `Contact person for ${i}`
        answerData[`${i}_responsible_entities_text`] = `Responsible entity for ${i}`
        answerData.selectedQuestionIds.push(i.toString())
      }
      // Create a promise for inserting answerData into the database
      const insertPromise = db.tempAnswer.create({
        programme: faculty.code,
        data: answerData,
        year: 2024,
        form,
      })

      facultyPromises.push(insertPromise)
      await Promise.all(facultyPromises)
    })
    await Promise.all(promises)

    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
}

const initData = {
  metadata: [
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;4;8',
      Liikennevalo: true,
      Määritelmä: 'Päähaun kakki hakijat / Päähaun aloituspaikat',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Application pressure',
      'Kriteerin nimi_fi': 'Hakupaine',
      'Kriteerin nimi_se': 'Ansökningstryck',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;100;200',
      Liikennevalo: true,
      Määritelmä: 'Päähaun ensisijaiset hakijat',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Primary applicants',
      'Kriteerin nimi_fi': 'Ensisijaiset hakijat',
      'Kriteerin nimi_se': 'Förstahandssökande',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;0,80;0,95',
      Liikennevalo: true,
      Määritelmä: 'Päähaun paikan vastaanottaneet / Päähaun aloituspaikat',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Filling the starting places',
      'Kriteerin nimi_fi': 'Aloituspaikkojen täyttyminen',
      'Kriteerin nimi_se': 'Fyllning av studieplatser',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;30;50',
      Liikennevalo: true,
      Määritelmä: 'Opinnot aloittaneet (oodikone)',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Started students',
      'Kriteerin nimi_fi': 'Opinnot aloittaneet',
      'Kriteerin nimi_se': 'Började studier',
    },
    {
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '0;30;50',
      Liikennevalo: true,
      Määritelmä: 'Tutkinnot lukumäärä',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Degrees',
      'Kriteerin nimi_fi': 'Tutkinnot',
      'Kriteerin nimi_se': 'Examen',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '0;0,40;0,50',
      Liikennevalo: true,
      Määritelmä: 'OKM-rahoitusmallin määritelmän mukaan',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Proportion within target time',
      'Kriteerin nimi_fi': 'Tavoiteajassa osuus',
      'Kriteerin nimi_se': 'Andel inom måltiden',
    },
    {
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '10;6;0',
      Liikennevalo: true,
      Määritelmä: 'Syyskuun läsnäolijat / kalenterivuoden tutkinnot',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Present students / degrees',
      'Kriteerin nimi_fi': 'Läsnäolevat / tutkinnot',
      'Kriteerin nimi_se': 'Närvarande studenter / examen',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '0;0,10;0,20',
      Liikennevalo: true,
      Määritelmä: 'Vuosikurssin 23-24 opiskelijoista 60op suorittaneita (1.8.2024 tilanne)',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Students of the academic year 23-24 progressing within target time',
      'Kriteerin nimi_fi': 'Vuosikurssin 23-24 tavoiteajassa etenevät',
      'Kriteerin nimi_se': 'Studenter under läsåret 23-24 som fortskrider inom måltiden',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,40;0,60',
      Liikennevalo: true,
      Määritelmä: 'Osuus kandipalautteen "voin hyvin yliopistossa" vastauksista 4-5 ',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Well-being indicator',
      'Kriteerin nimi_fi': 'Hyvinvointi-indikaattori',
      'Kriteerin nimi_se': 'Välmåendets indikator',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,20;0,40',
      Liikennevalo: true,
      Määritelmä: 'Osuus kandipalautteen "sain tarpeeksi ohjausta" vastauksista 4-5',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Guidance indicator',
      'Kriteerin nimi_fi': 'Ohjausindikaattori',
      'Kriteerin nimi_se': 'Vägledningsindikator',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,10;0,20',
      Liikennevalo: true,
      Määritelmä: 'Norppa-palautteeseen vastanneiden osuus',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Proportion of respondents to Norppa',
      'Kriteerin nimi_fi': 'Norppa-palautteeseen vastanneiden osuus',
      'Kriteerin nimi_se': 'Andel av respondenter till Norppa',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;10;50',
      Liikennevalo: true,
      Määritelmä: 'Hakukelpoiset hakijat (kv) tai kaikki hakijat (kotimaiset kielet)',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': "Eligible applicants for Master's application",
      'Kriteerin nimi_fi': 'Maisterihaun hakukelpoiset hakijat',
      'Kriteerin nimi_se': 'Behöriga sökande till magisteransökan',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Liikennevalo: false,
      Määritelmä: 'Maisterihaun aloituspaikat',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': "Intake of master's application",
      'Kriteerin nimi_fi': 'Maisterihaun aloituspaikat',
      'Kriteerin nimi_se': 'Intag av magisteransökan',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;1;5',
      Liikennevalo: true,
      Määritelmä: 'Maisterihaun hakukelpoiset hakijat/ aloituspaikat',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': "Master's application pressure",
      'Kriteerin nimi_fi': 'Maisterihaun hakupaine',
      'Kriteerin nimi_se': 'Magisteransökningstryck',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;30;50',
      Liikennevalo: true,
      Määritelmä: 'Aloituspaikat yhteensä (sisäänotto + jatkavat)',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Total intake',
      'Kriteerin nimi_fi': 'Aloituspaikat',
      'Kriteerin nimi_se': 'Totalt intag',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Kynnysarvot: '0;20;40',
      Liikennevalo: true,
      Määritelmä: 'Ohjelmassa aloittaneiden opiskelijoiden lukumäärä',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Started students',
      'Kriteerin nimi_fi': 'Opinnot aloittaneet',
      'Kriteerin nimi_se': 'Började studier',
    },
    {
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '0;20;40',
      Liikennevalo: true,
      Määritelmä: 'Tutkinnot lukumäärä',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Degrees',
      'Kriteerin nimi_fi': 'Tutkinnot',
      'Kriteerin nimi_se': 'Examen',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '0;0,15;0,30',
      Liikennevalo: true,
      Määritelmä: 'OKM-rahoitusmallin määritelmän mukaan',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Proportion within target time',
      'Kriteerin nimi_fi': 'Tavoiteajassa osuus',
      'Kriteerin nimi_se': 'Andel inom måltiden',
    },
    {
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Kynnysarvot: '10;5;0',
      Liikennevalo: true,
      Määritelmä: 'Syyskuun läsnäolijat / kalenterivuoden tutkinnot',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Present students / degrees',
      'Kriteerin nimi_fi': 'Läsnäolevat / tutkinnot',
      'Kriteerin nimi_se': 'Närvarande studenter / examen',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,20;0,50',
      Liikennevalo: true,
      Määritelmä: 'Osuus ulottuvuuden arvoista välillä 4-5',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'HUL3 Constructive alignment of teaching',
      'Kriteerin nimi_fi': 'HUL3 Linjakkuus',
      'Kriteerin nimi_se': 'HUL3 Konstruktivt samordnad undervisning',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,10;0,30',
      Liikennevalo: true,
      Määritelmä: 'Osuus ulottuvuuden arvoista välillä 4-5',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'HUL3 Constructive feedback',
      'Kriteerin nimi_fi': 'HUL3 Oppimista edistävä palaute',
      'Kriteerin nimi_se': 'HUL3 Respons som stöd för lärande',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Kynnysarvot: '0;0,20;0,50',
      Liikennevalo: true,
      Määritelmä: 'Osuus ulottuvuuden arvoista välillä 4-5',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'HUL3 Interest and relevance',
      'Kriteerin nimi_fi': 'HUL3 Opintojen kiinnostavuus',
      'Kriteerin nimi_se': 'HUL3 Hur engagerande är undervisningen?',
    },
    {
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Liikennevalo: false,
      Määritelmä: 'HUL3-kyselyyn vastanneiden lukumäärä',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'HUL3 respondents',
      'Kriteerin nimi_fi': 'HUL3 vastaajamäärä',
      'Kriteerin nimi_se': 'HUL3 respondenter',
    },
    {
      Yksikkö: '%',
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Liikennevalo: false,
      Määritelmä: 'Työllistyminen vuosi valmistumisen jälkeen',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Employment one year after graduation',
      'Kriteerin nimi_fi': 'Työllistyminen vuosi valmistumisen jälkeen',
      'Kriteerin nimi_se': 'Anställning ett år efter examen',
    },
    {
      Avainluku: 'Resurssit',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Kandi',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
    {
      Avainluku: 'Resurssit',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Maisteri',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
    {
      Avainluku: 'Vetovoimaisuus',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Tohtori',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
    {
      Avainluku: 'Läpivirtaus ja valmistuminen',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Tohtori',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
    {
      Avainluku: 'Opiskelijapalaute ja työllistyminen',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Tohtori',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
    {
      Avainluku: 'Resurssit',
      Liikennevalo: false,
      Määritelmä: 'Tulossa 2026',
      'Ohjelman taso': 'Tohtori',
      'Kriteerin nimi_en': 'Coming in 2026',
      'Kriteerin nimi_fi': 'Tulossa 2026',
      'Kriteerin nimi_se': 'Kommer 2026',
    },
  ],
  Kandiohjelmat: [
    {
      Hakupaine: 3.0,
      Resurssit: 'Ei arviota',
      Tutkinnot: 10,
      Vetovoimaisuus: 'Punainen',
      Ohjausindikaattori: 0.15,
      'Opinnot aloittaneet': 25,
      'Tavoiteajassa osuus': 0.25,
      'Ensisijaiset hakijat': 100,
      'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen kandiohjelma',
      'Koulutusohjelman koodi': 'KH50_005',
      'Hyvinvointi-indikaattori': 0.25,
      'Läsnäolevat / tutkinnot': 10,
      'Aloituspaikkojen täyttyminen': 0.5,
      'Läpivirtaus ja valmistuminen': 'Punainen',
      'Opiskelijapalaute ja työllistyminen': 'Punainen',
      'Norppa-palautteeseen vastanneiden osuus': 0.05,
      'Vuosikurssin 23-24 tavoiteajassa etenevät': 0.05,
    },
  ],
  Maisteriohjelmat: [
    {
      Resurssit: 'Ei arviota',
      Tutkinnot: 10,
      Aloituspaikat: 25,
      Vetovoimaisuus: 'Punainen',
      'HUL3 Linjakkuus': 0.1,
      'Opinnot aloittaneet': 10,
      'Tavoiteajassa osuus': 0.1,
      'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen maisteriohjelma',
      'HUL3 vastaajamäärä ': 1,
      'Koulutusohjelman koodi': 'MH50_009',
      'Maisterihaun hakupaine': 0.5,
      'Läsnäolevat / tutkinnot': 0,
      'Maisterihaun aloituspaikat': 45,
      'HUL3 Opintojen kiinnostavuus': 0.1,
      'Läpivirtaus ja valmistuminen': 'Punainen',
      'HUL3 oppimista edistävä palaute': 0.1,
      'Maisterihaun hakukelpoiset hakijat': 5,
      'Opiskelijapalaute ja työllistyminen': 'Punainen',
    },
  ],
}

const initKeyData = async (_req, res) => {
  try {
    await KeyData.create({
      data: initData,
    })
    return res.status(200).json({ message: 'Keydata initialized' })
  } catch (err) {
    return res.status(500).json({ error: `Datatbase error: ${err}` })
  }
}

export default { seed, createAnswers, createFacultyAnswers, initKeyData }
