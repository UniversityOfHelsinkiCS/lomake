import { Op } from 'sequelize'
import moment from 'moment'
import db from '../models/index.js'
import KeyData from '../models/keyData.js'
import Report from '../models/reports.js'
import logger from '../util/logger.js'
import { testProgrammeCode, defaultYears } from '../util/common.js'
import { createDraftAnswers } from '../scripts/draftAndFinalAnswers.js'
import { facultyList } from '../../config/data.js'

// Validations
import {
  MetadataRawSchema,
  KandiohjelmatValuesSchema,
  MaisteriohjelmatValuesSchema,
  logZodError,
} from '../../shared/lib/validations.js'

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
      "Kynnysarvot": "0;3;6;9",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;20",
      "Määritelmä_fi": "Päähaun kakki hakemukset / Päähaun aloituspaikat",
      "Avainluvun nimi_en": "Application pressure",
      "Avainluvun nimi_fi": "Hakupaine",
      "Avainluvun nimi_se": "Ansökningstryck"
    },
    {
      "Kynnysarvot": "0;80;160;250",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;1000",
      "Määritelmä_fi": "Päähaun ensisijaiset hakijat",
      "Avainluvun nimi_en": "Primary applicants",
      "Avainluvun nimi_fi": "Ensisijaiset hakijat",
      "Avainluvun nimi_se": "Förstahandssökande"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;75;95;99",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "60;105",
      "Määritelmä_fi": "Päähaun paikan vastaanottaneet / Päähaun aloituspaikat",
      "Avainluvun nimi_en": "Filling the starting places",
      "Avainluvun nimi_fi": "Aloituspaikkojen täyttö",
      "Avainluvun nimi_se": "Fyllning av studieplatser"
    },
    {
      "Kynnysarvot": "0;30;50;70",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;150",
      "Määritelmä_fi": "Opinnot aloittaneet",
      "Avainluvun nimi_en": "Started students",
      "Avainluvun nimi_fi": "Opintonsa aloittaneet",
      "Avainluvun nimi_se": "Började studier"
    },
    {
      "Kynnysarvot": "0;20;35;50",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Tutkinnot lukumäärä",
      "Avainluvun nimi_en": "Degrees",
      "Avainluvun nimi_fi": "Tutkinnot",
      "Avainluvun nimi_se": "Examen"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;30;45;60",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan",
      "Avainluvun nimi_en": "Proportion within target time",
      "Avainluvun nimi_fi": "Tavoiteajassa valmistuminen",
      "Avainluvun nimi_se": "Andel inom måltiden"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;30;45;60",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Osuus ensimmäisenä lukuvuonna yli 50op. (oikeuteen kytketyt op.) suorittaneista opiskelijoista ",
      "Avainluvun nimi_en": "Progress of studies",
      "Avainluvun nimi_fi": "Opintojen eteneminen",
      "Avainluvun nimi_se": "Studiernas framsteg"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "100;25;20;15",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "20.9 läsnäolevista yli kolme lukuvuotta opiskelleet. Siirtyneet eivät mukana",
      "Avainluvun nimi_en": "Accumalation of students",
      "Avainluvun nimi_fi": "Läsnäolevien kasautuminen",
      "Avainluvun nimi_se": "Ansamling av studenter"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;40;60;75",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Osuus kandipalautteen \"voin hyvin yliopistossa\" vastauksista 4-5 ",
      "Avainluvun nimi_en": "Well-being indicator",
      "Avainluvun nimi_fi": "Opiskelijoiden hyvinvointi",
      "Avainluvun nimi_se": "Välmåendets indikator"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;20;40;50",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Osuus kandipalautteen \"sain tarpeeksi ohjausta\" vastauksista 4-5",
      "Avainluvun nimi_en": "Guidance indicator",
      "Avainluvun nimi_fi": "Opintojen ohjaus",
      "Avainluvun nimi_se": "Vägledningsindikator"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;40;60;80",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Osuus kandipalautteen \"opetus pääosin laadukasta\" vastauksista 4-5",
      "Avainluvun nimi_en": "Quality of teaching",
      "Avainluvun nimi_fi": "Opetuksen laatu",
      "Avainluvun nimi_se": "Kvaliteten på undervisningen"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;50;65;80",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Kandi",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Kandipalautteeseen vastanneiden osuus",
      "Avainluvun nimi_en": "Proportion of respondents",
      "Avainluvun nimi_fi": "Palauteaktiivisuus",
      "Avainluvun nimi_se": "Andel av respondenter"
    },
    {
      "Kynnysarvot": "0;10;40;80",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;200",
      "Määritelmä_fi": "Hakukelpoiset hakijat (kv) tai kaikki hakijat (kotimaiset kielet)",
      "Avainluvun nimi_en": "Eligible applicants for Master's application",
      "Avainluvun nimi_fi": "Hakijat",
      "Avainluvun nimi_se": "Behöriga sökande till magisteransökan"
    },
    {
      "Kynnysarvot": "0;1;2;4",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;10",
      "Määritelmä_fi": "Maisterihaun hakukelpoiset hakijat/ aloituspaikat",
      "Avainluvun nimi_en": "Master's application pressure",
      "Avainluvun nimi_fi": "Hakupaine",
      "Avainluvun nimi_se": "Magisteransökningstryck"
    },
    {
      "Kynnysarvot": "0;20;30;40",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Aloituspaikat (opiskelikavalinta + jatkavat)",
      "Avainluvun nimi_en": "Total intake",
      "Avainluvun nimi_fi": "Aloituspaikat",
      "Avainluvun nimi_se": "Totalt intag"
    },
    {
      "Kynnysarvot": "0;20;30;40",
      "Liikennevalo": true,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Opinnot aloittaneet",
      "Avainluvun nimi_en": "Started students",
      "Avainluvun nimi_fi": "Opintonsa aloittaneet",
      "Avainluvun nimi_se": "Började studier"
    },
    {
      "Kynnysarvot": "0;15;25;35",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Tutkinnot lukumäärä",
      "Avainluvun nimi_en": "Degrees",
      "Avainluvun nimi_fi": "Tutkinnot",
      "Avainluvun nimi_se": "Examen"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;15;30;40",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan",
      "Avainluvun nimi_en": "Graduation within the target time",
      "Avainluvun nimi_fi": "Tavoiteajassa valmistuminen",
      "Avainluvun nimi_se": "Utexaminera inom målsatt tid"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "100;60;40;20",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "Yli vuosi tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan",
      "Avainluvun nimi_en": "Graduation after the target time",
      "Avainluvun nimi_fi": "Valmistuminen tavoiteajan jälkeen",
      "Avainluvun nimi_se": "Utexaminera efter målsatt tid"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "100;35;25;15",
      "Liikennevalo": true,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "20.9 läsnäolevista yli viisi (kandi+maisteri) tai kaksi (maisteri) lukuvuotta opiskelleet. Siirtyneet eivät mukana",
      "Avainluvun nimi_en": "Accumalation of students",
      "Avainluvun nimi_fi": "Läsnäolevien kasautuminen",
      "Avainluvun nimi_se": "Ansamling av studenter"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;20;40;60",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "HUL3. Osuus ulottuvuuden arvoista välillä 4-5",
      "Avainluvun nimi_en": "HUL3 Constructive alignment of teaching",
      "Avainluvun nimi_fi": "Opetuksen linjakkuus",
      "Avainluvun nimi_se": "HUL3 Konstruktivt samordnad undervisning"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;15;30;50",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "HUL3. Osuus ulottuvuuden arvoista välillä 4-5",
      "Avainluvun nimi_en": "HUL3 Constructive feedback",
      "Avainluvun nimi_fi": "Oppimista edistävä palaute",
      "Avainluvun nimi_se": "HUL3 Respons som stöd för lärande"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;30;50;70",
      "Liikennevalo": true,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "0;100",
      "Määritelmä_fi": "HUL3. Osuus ulottuvuuden arvoista välillä 4-5",
      "Avainluvun nimi_en": "HUL3 Interest and relevance",
      "Avainluvun nimi_fi": "Opintojen kiinnostavuus",
      "Avainluvun nimi_se": "HUL3 Hur engagerande är undervisningen?"
    },
    {
      "Yksikkö": "%",
      "Kynnysarvot": "0;80;90;95",
      "Liikennevalo": false,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Maisteri",
      "Mittarin rajat": "50;100",
      "Määritelmä_fi": "Työllistyminen vuosi valmistumisen jälkeen osuus",
      "Avainluvun nimi_en": "Employment",
      "Avainluvun nimi_fi": "Työllistyminen",
      "Avainluvun nimi_se": "Sysselsättning"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Resurssien käyttö",
      "Ohjelman taso": "Kandi",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Resurssien käyttö",
      "Ohjelman taso": "Maisteri",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Vetovoimaisuus",
      "Ohjelman taso": "Tohtori",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Opintojen sujuvuus ja valmistuminen",
      "Ohjelman taso": "Tohtori",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Palaute ja työllistyminen",
      "Ohjelman taso": "Tohtori",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    },
    {
      "Liikennevalo": false,
      "Arviointialue": "Resurssien käyttö",
      "Ohjelman taso": "Tohtori",
      "Määritelmä_fi": "Tulossa 2026",
      "Avainluvun nimi_en": "Coming in 2026",
      "Avainluvun nimi_fi": "Tulossa 2026",
      "Avainluvun nimi_se": "Kommer 2026"
    }
  ],
  Kandiohjelmat: [
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_005',
      'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 3.0,
      'Ensisijaiset hakijat': 100,
      'Aloituspaikkojen täyttö': 0.5,
      'Opintonsa aloittaneet': 25,
      Tutkinnot: 10,
      'Tavoiteajassa valmistuminen': 0.25,
      'Opintojen eteneminen': 0.25,
      'Läsnäolevien kasautuminen': 0.25,
      'Opiskelijoiden hyvinvointi': 0,
      'Opintojen ohjaus': 0,
      'Opetuksen laatu': 0,

      // Liikennevalot
      Vetovoimaisuus: 'Punainen',
      'Opintojen sujuvuus ja valmistuminen': 'Punainen',
      'Palaute ja työllistyminen': 'Punainen',
      'Resurssien käyttö': 'Ei arviota',

      // Muut
      Vuosi: 2024,
    },
  ],
  Maisteriohjelmat: [
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'MH50_009',
      'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen maisteriohjelma',

      // Maisteriohjelman avainluvut
      Hakijat: 5,
      Hakupaine: 0.5,
      Aloituspaikat: 25,
      'Opintonsa aloittaneet': 10,
      Tutkinnot: 10,
      'Tavoiteajassa valmistuminen': 0.1,
      'Valmistuminen tavoiteajan jälkeen': 0.1,
      'Läsnäolevien kasautuminen': 0,
      'Opetuksen linjakkuus': 0.1,
      'Oppimista edistävä palaute': 0.1,
      'Opintojen kiinnostavuus': 0.1,
      Työllistyminen: 0,

      // Liikennevalot
      Vetovoimaisuus: 'Punainen',
      'Opintojen sujuvuus ja valmistuminen': 'Punainen',
      'Palaute ja työllistyminen': 'Punainen',
      'Resurssien käyttö': 'Ei arviota',

      // Muut
      Vuosi: 2024,
    },
  ],
}

const initKeyData = async (_req, res) => {
  try {
    try {
      // Validate the data
      KandiohjelmatValuesSchema.array().parse(initData.Kandiohjelmat)
      MaisteriohjelmatValuesSchema.array().parse(initData.Maisteriohjelmat)
      MetadataRawSchema.array().parse(initData.metadata)
    } catch (zodError) {
      logZodError(zodError)
      throw new Error('Invalid KeyData format')
    }

    await KeyData.create({
      data: initData,
      active: true,
    })

    return res.status(200).json({ message: 'Keydata initialized' })
  } catch (err) {
    return res.status(500).json({ error: `Datatbase error: ${err}` })
  }
}

export default { seed, createAnswers, createFacultyAnswers, initKeyData }
