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
  MetadataSchema,
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
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Hakupaine',
      avainluvunNimi: {
        fi: 'Hakupaine',
        se: 'Ansökningstryck',
        en: 'Application pressure',
      },
      maaritelma: {
        fi: 'Päähaun kakki hakemukset / Päähaun aloituspaikat',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;3;6;9',
      liikennevalo: true,
      mittarinRajat: '0;20',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Ensisijaiset hakijat',
      avainluvunNimi: {
        fi: 'Ensisijaiset hakijat',
        se: 'Förstahandssökande',
        en: 'Primary applicants',
      },
      maaritelma: {
        fi: 'Päähaun ensisijaiset hakijat',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;80;160;250',
      liikennevalo: true,
      mittarinRajat: '0;1000',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Aloituspaikkojen täyttö',
      avainluvunNimi: {
        fi: 'Aloituspaikkojen täyttö',
        se: 'Fyllning av studieplatser',
        en: 'Filling the starting places',
      },
      maaritelma: {
        fi: 'Päähaun paikan vastaanottaneet / Päähaun aloituspaikat',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;75;95;99',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '60;105',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Opintonsa aloittaneet',
      avainluvunNimi: {
        fi: 'Opintonsa aloittaneet',
        se: 'Började studier',
        en: 'Started students',
      },
      maaritelma: {
        fi: 'Opinnot aloittaneet',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;30;50;70',
      liikennevalo: true,
      mittarinRajat: '0;150',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Tutkinnot',
      avainluvunNimi: {
        fi: 'Tutkinnot',
        se: 'Examen',
        en: 'Degrees',
      },
      maaritelma: {
        fi: 'Tutkinnot lukumäärä',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;20;35;50',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Tavoiteajassa valmistuminen',
      avainluvunNimi: {
        fi: 'Tavoiteajassa valmistuminen',
        se: 'Andel inom måltiden',
        en: 'Proportion within target time',
      },
      maaritelma: {
        fi: 'Tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;30;45;60',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Opintojen eteneminen',
      avainluvunNimi: {
        fi: 'Opintojen eteneminen',
        se: 'Studiernas framsteg',
        en: 'Progress of studies',
      },
      maaritelma: {
        fi: 'Osuus ensimmäisenä lukuvuonna yli 50op. (oikeuteen kytketyt op.) suorittaneista opiskelijoista ',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;30;45;60',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Läsnäolevien kasautuminen',
      avainluvunNimi: {
        fi: 'Läsnäolevien kasautuminen',
        se: 'Ansamling av studenter',
        en: 'Accumalation of students',
      },
      maaritelma: {
        fi: '20.9 läsnäolevista yli kolme lukuvuotta opiskelleet. Siirtyneet eivät mukana',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '100;25;20;15',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Opiskelijoiden hyvinvointi',
      avainluvunNimi: {
        fi: 'Opiskelijoiden hyvinvointi',
        se: 'Välmåendets indikator',
        en: 'Well-being indicator',
      },
      maaritelma: {
        fi: 'Osuus kandipalautteen "voin hyvin yliopistossa" vastauksista 4-5 ',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;40;60;75',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Opintojen ohjaus',
      avainluvunNimi: {
        fi: 'Opintojen ohjaus',
        se: 'Vägledningsindikator',
        en: 'Guidance indicator',
      },
      maaritelma: {
        fi: 'Osuus kandipalautteen "sain tarpeeksi ohjausta" vastauksista 4-5',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;20;40;50',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Opetuksen laatu',
      avainluvunNimi: {
        fi: 'Opetuksen laatu',
        se: 'Kvaliteten på undervisningen',
        en: 'Quality of teaching',
      },
      maaritelma: {
        fi: 'Osuus kandipalautteen "opetus pääosin laadukasta" vastauksista 4-5',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;40;60;80',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Palauteaktiivisuus',
      avainluvunNimi: {
        fi: 'Palauteaktiivisuus',
        se: 'Andel av respondenter',
        en: 'Proportion of respondents',
      },
      maaritelma: {
        fi: 'Kandipalautteeseen vastanneiden osuus',
      },
      ohjelmanTaso: 'Kandi',
      kynnysarvot: '0;50;65;80',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Hakijat',
      avainluvunNimi: {
        fi: 'Hakijat',
        se: 'Behöriga sökande till magisteransökan',
        en: "Eligible applicants for Master's application",
      },
      maaritelma: {
        fi: 'Hakukelpoiset hakijat (kv) tai kaikki hakijat (kotimaiset kielet)',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;10;40;80',
      liikennevalo: true,
      mittarinRajat: '0;200',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Hakupaine',
      avainluvunNimi: {
        fi: 'Hakupaine',
        se: 'Magisteransökningstryck',
        en: "Master's application pressure",
      },
      maaritelma: {
        fi: 'Maisterihaun hakukelpoiset hakijat/ aloituspaikat',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;1;2;4',
      liikennevalo: true,
      mittarinRajat: '0;10',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Aloituspaikat',
      avainluvunNimi: {
        fi: 'Aloituspaikat',
        se: 'Totalt intag',
        en: 'Total intake',
      },
      maaritelma: {
        fi: 'Aloituspaikat (opiskelikavalinta + jatkavat)',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;20;30;40',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Opintonsa aloittaneet',
      avainluvunNimi: {
        fi: 'Opintonsa aloittaneet',
        se: 'Började studier',
        en: 'Started students',
      },
      maaritelma: {
        fi: 'Opinnot aloittaneet',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;20;30;40',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Tutkinnot',
      avainluvunNimi: {
        fi: 'Tutkinnot',
        se: 'Examen',
        en: 'Degrees',
      },
      maaritelma: {
        fi: 'Tutkinnot lukumäärä',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;15;25;35',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Tavoiteajassa valmistuminen',
      avainluvunNimi: {
        fi: 'Tavoiteajassa valmistuminen',
        se: 'Utexaminera inom målsatt tid',
        en: 'Graduation within the target time',
      },
      maaritelma: {
        fi: 'Tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;15;30;40',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Valmistuminen tavoiteajan jälkeen',
      avainluvunNimi: {
        fi: 'Valmistuminen tavoiteajan jälkeen',
        se: 'Utexaminera efter målsatt tid',
        en: 'Graduation after the target time',
      },
      maaritelma: {
        fi: 'Yli vuosi tavoiteajassa valmistuneiden osuus kaikista valmistuneista. OKM-rahoitusmallin määritelmän mukaan',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '100;60;40;20',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Läsnäolevien kasautuminen',
      avainluvunNimi: {
        fi: 'Läsnäolevien kasautuminen',
        se: 'Ansamling av studenter',
        en: 'Accumalation of students',
      },
      maaritelma: {
        fi: '20.9 läsnäolevista yli viisi (kandi+maisteri) tai kaksi (maisteri) lukuvuotta opiskelleet. Siirtyneet eivät mukana',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '100;35;25;15',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Opetuksen linjakkuus',
      avainluvunNimi: {
        fi: 'Opetuksen linjakkuus',
        se: 'HUL3 Konstruktivt samordnad undervisning',
        en: 'HUL3 Constructive alignment of teaching',
      },
      maaritelma: {
        fi: 'HUL3. Osuus ulottuvuuden arvoista välillä 4-5',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;20;40;60',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Oppimista edistävä palaute',
      avainluvunNimi: {
        fi: 'Oppimista edistävä palaute',
        se: 'HUL3 Respons som stöd för lärande',
        en: 'HUL3 Constructive feedback',
      },
      maaritelma: {
        fi: 'HUL3. Osuus ulottuvuuden arvoista välillä 4-5',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;15;30;50',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Opintojen kiinnostavuus',
      avainluvunNimi: {
        fi: 'Opintojen kiinnostavuus',
        se: 'HUL3 Hur engagerande är undervisningen?',
        en: 'HUL3 Interest and relevance',
      },
      maaritelma: {
        fi: 'HUL3. Osuus ulottuvuuden arvoista välillä 4-5',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;30;50;70',
      yksikko: '%',
      liikennevalo: true,
      mittarinRajat: '0;100',
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Työllistyminen',
      avainluvunNimi: {
        fi: 'Työllistyminen',
        se: 'Sysselsättning',
        en: 'Employment',
      },
      maaritelma: {
        fi: 'Työllistyminen vuosi valmistumisen jälkeen osuus',
      },
      ohjelmanTaso: 'Maisteri',
      kynnysarvot: '0;80;90;95',
      yksikko: '%',
      liikennevalo: false,
      mittarinRajat: '50;100',
    },
    {
      arviointialue: 'Resurssien käyttö',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Kandi',
      liikennevalo: false,
    },
    {
      arviointialue: 'Resurssien käyttö',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Maisteri',
      liikennevalo: false,
    },
    {
      arviointialue: 'Vetovoimaisuus',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Tohtori',
      liikennevalo: false,
    },
    {
      arviointialue: 'Opintojen sujuvuus ja valmistuminen',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Tohtori',
      liikennevalo: false,
    },
    {
      arviointialue: 'Palaute ja työllistyminen',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Tohtori',
      liikennevalo: false,
    },
    {
      arviointialue: 'Resurssien käyttö',
      avainluvunArvo: 'Tulossa 2026',
      avainluvunNimi: {
        fi: 'Tulossa 2026',
        se: 'Kommer 2026',
        en: 'Coming in 2026',
      },
      maaritelma: {
        fi: 'Tulossa 2026',
      },
      ohjelmanTaso: 'Tohtori',
      liikennevalo: false,
    },
  ],
  Kandiohjelmat: [
    {
      // TODO: OLD VALUES TEST, delete if not needed
      // Hakupaine: 3.0,
      // Resurssit: 'Ei arviota',
      // Tutkinnot: 10,
      // Vetovoimaisuus: 'Punainen',
      // Ohjausindikaattori: 0.15,
      // 'Opinnot aloittaneet': 25,
      // 'Tavoiteajassa osuus': 0.25,
      // 'Ensisijaiset hakijat': 100,
      // 'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen kandiohjelma',
      // 'Koulutusohjelman koodi': 'KH50_005',
      // 'Hyvinvointi-indikaattori': 0.25,
      // 'Läsnäolevat / tutkinnot': 10,
      // 'Aloituspaikkojen täyttyminen': 0.5,
      // 'Läpivirtaus ja valmistuminen': 'Punainen',
      // 'Opiskelijapalaute ja työllistyminen': 'Punainen',
      // 'Norppa-palautteeseen vastanneiden osuus': 0.05,
      // 'Vuosikurssin 23-24 tavoiteajassa etenevät': 0.05,

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
      // TODO: OLD VALUES TEST, delete if not needed
      // Resurssit: 'Ei arviota',
      // Tutkinnot: 10,
      // Aloituspaikat: 25,
      // Vetovoimaisuus: 'Punainen',
      // 'HUL3 Linjakkuus': 0.1,
      // 'Opinnot aloittaneet': 10,
      // 'Tavoiteajassa osuus': 0.1,
      // 'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen maisteriohjelma',
      // 'HUL3 vastaajamäärä ': 1,
      // 'Koulutusohjelman koodi': 'MH50_009',
      // 'Maisterihaun hakupaine': 0.5,
      // 'Läsnäolevat / tutkinnot': 0,
      // 'Maisterihaun aloituspaikat': 45,
      // 'HUL3 Opintojen kiinnostavuus': 0.1,
      // 'Läpivirtaus ja valmistuminen': 'Punainen',
      // 'HUL3 oppimista edistävä palaute': 0.1,
      // 'Maisterihaun hakukelpoiset hakijat': 5,
      // 'Opiskelijapalaute ja työllistyminen': 'Punainen',

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
      MetadataSchema.array().parse(initData.metadata)
    } catch (zodError) {
      logZodError(zodError)
      throw new Error('Invalid KeyData format')
    }

    await KeyData.create({
      data: initData,
    })

    return res.status(200).json({ message: 'Keydata initialized' })
  } catch (err) {
    return res.status(500).json({ error: `Datatbase error: ${err}` })
  }
}

export default { seed, createAnswers, createFacultyAnswers, initKeyData }
