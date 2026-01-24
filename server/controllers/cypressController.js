import { Op } from 'sequelize'
import moment from 'moment'
import db from '../models/index.js'
import KeyData from '../models/keyData.js'
import Report from '../models/reports.js'
import Document from '../models/document.js'
import logger from '../util/logger.js'
import { testProgrammeCode, defaultYears } from '../util/common.js'
import { createDraftAnswers } from '../scripts/draftAndFinalAnswers.js'
import { facultyList } from '../../config/data.js'
import { ARCHIVE_LAST_YEAR } from '../../config/common.js'

// Validations
import {
  MetadataRawSchema,
  KandiohjelmatValuesSchema,
  MaisteriohjelmatValuesSchema,
  logZodError,
} from '../../shared/validators/index.js'
import Studyprogramme from '../models/studyprogramme.js'

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
    await Studyprogramme.update(
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

    const programmes = await Studyprogramme.findAll({})

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
        year: ARCHIVE_LAST_YEAR,
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
      Kynnysarvot: '0;3;6;9',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;20',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en:
        'All applications in the main application procedure / Study places in the main application procedure',
      Määritelmä_fi: 'Päähaun kaikki hakemukset / päähaun aloituspaikat',
      Määritelmä_se: 'Sökande / nybörjarplatser  i gemensamma ansökan',
      'Avainluvun nimi_en': 'Applications per student place',
      'Avainluvun nimi_fi': 'Hakupaine',
      'Avainluvun nimi_se': 'Ansökningstryck',
    },
    {
      Kynnysarvot: '0;80;160;250',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;1000',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: 'Primary applicants of the main application procedure',
      Määritelmä_fi: 'Päähaun ensisijaiset hakijat',
      Määritelmä_se: 'Förstahandssökande i gemensamma ansökan',
      'Avainluvun nimi_en': 'Primary applicants',
      'Avainluvun nimi_fi': 'Ensisijaiset hakijat',
      'Avainluvun nimi_se': 'Förstahandssökande',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;75;95;99',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '60;105',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en:
        'Number of applicants accepting the UH study place/ number of study places of the main application procedure',
      Määritelmä_fi: 'Päähaun paikan vastaanottaneet / päähaun aloituspaikat',
      Määritelmä_se: 'Antagna som tagit emot studieplatsen/ nybörjarplatser',
      'Avainluvun nimi_en': 'Filling rate of intake',
      'Avainluvun nimi_fi': 'Aloituspaikkojen täyttö',
      'Avainluvun nimi_se': 'Påfyllningsgrad för nybörjarplatser',
    },
    {
      Kynnysarvot: '0;30;50;70',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;150',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: 'Number of new students',
      Määritelmä_fi: 'Opintonsa aloittaneiden määrä',
      Määritelmä_se: 'Antal nya studenter',
      'Avainluvun nimi_en': 'Number of new students',
      'Avainluvun nimi_fi': 'Opintonsa aloittaneet',
      'Avainluvun nimi_se': 'Antal nya studerande',
    },
    {
      Kynnysarvot: '0;20;35;50',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en: "Number of bachelor's degrees completed during the calendar year",
      Määritelmä_fi: 'Kalenverivuoden aikana suoritettujen alempien korkeakoulututkintojen lukumäärä',
      Määritelmä_se: 'Antal avlagda kandidatexamina under kalenderåret',
      'Avainluvun nimi_en': 'Degrees',
      'Avainluvun nimi_fi': 'Tutkinnot',
      'Avainluvun nimi_se': 'Examen',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;30;45;60',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        'Percentage of graduates within target time of all graduates, as defined in the Ministry of Education and Culture´s funding model',
      Määritelmä_fi:
        'Tavoiteajassa valmistuneiden osuus kaikista valmistuneista, OKM:n rahoitusmallin määritelmän mukaan',
      Määritelmä_se:
        'Andelen utexaminerade inom måltiden av alla utexaminerade, enligt undervisnings- och kulturministeriets definition av finansieringsmodellen',
      'Avainluvun nimi_en': 'Graduation within target time',
      'Avainluvun nimi_fi': 'Tavoiteajassa valmistuminen',
      'Avainluvun nimi_se': 'Utexaminering inom målsatt tid',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;30;45;60',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        'Percentage of students who completed more than 50 credits in the first academic year, including only those studies linked to this study right',
      Määritelmä_fi:
        'Ensimmäisenä lukuvuonna yli 50 opintopistettä suorittaneiden opiskelijoiden osuus, mukana vain tähän opinto-oikeuteen kytketyt opinnot',
      Määritelmä_se:
        'Andel studenter som läst mer än 50 högskolepoäng under det första läsåret, inklusive endast de studier som är kopplade till denna studierätt',
      'Avainluvun nimi_en': 'Progress of studies',
      'Avainluvun nimi_fi': 'Opintojen eteneminen',
      'Avainluvun nimi_se': 'Studieavancemang',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '100;25;20;15',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        'Share of students who have registered for more than three academic years. Date of review 20.9. Students who began their studies before 1 August 2017 will not be taken into consideration.',
      Määritelmä_fi:
        'Läsnäolevaksi ilmoittautuneista opiskelijoista yli kolme lukuvuotta opiskelleiden osuus. Tarkastelupäivämäärä 20.9. Siirtyneet eivät mukana.',
      Määritelmä_se:
        'Andel studenter som har varit registrerade i mer än tre läsår. Datum för granskning 20.9. Studenter som påbörjat sina studier före den 1 augusti 2017 kommer inte att beaktas.',
      'Avainluvun nimi_en': 'Accumalation of students',
      'Avainluvun nimi_fi': 'Läsnäolevien kasautuminen',
      'Avainluvun nimi_se': 'Ackumulering av antalet studenter',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;40;60;75',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en:
        "Well-being indicator: percentage of answers 4 or 5 to the feedback question 'I feel comfortable at my university.' in the Finnish Bachelor’s Graduate Survey (Kandipalaute)",
      Määritelmä_fi: 'Hyvinvointi-indikaattori: Osuus kandipalautteen ”Voin hyvin yliopistossani” vastauksista 4-5',
      Määritelmä_se:
        'Indikator för välbefinnande: Andel som svarat 4 eller 5 på feedbackfrågan ”Jag mår bra på mitt universitet” i Kandidatrespons (Kandipalaute)',
      'Avainluvun nimi_en': 'Student well-being',
      'Avainluvun nimi_fi': 'Opiskelijoiden hyvinvointi',
      'Avainluvun nimi_se': 'Studenternas välbefinnande',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;20;40;50',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en:
        "Guidance indicator: percentage of answers 4 or 5 to the feedback question 'There has been sufficient guidance available for the organisation of my studies.' in the Finnish Bachelor’s Graduate Survey (Kandipalaute)",
      Määritelmä_fi:
        'Ohjausindikaattori: Osuus kandipalautteen ”Tarjolla on ollut riittävästi ohjausta opintojen suunnitteluun” vastauksista 4-5',
      Määritelmä_se:
        'Indikator för handledning: Andel som svarat 4 eller 5 på feedbackfrågan ”Det har erbjudits tillräckligt med handledning för planeringen av studierna” i Kandidatrespons (Kandipalaute)',
      'Avainluvun nimi_en': 'Guidance',
      'Avainluvun nimi_fi': 'Opintojen ohjaus',
      'Avainluvun nimi_se': 'Studiehandledning',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;40;60;80',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en:
        "Percentage of answers 4 or 5 to the feedback question 'The teaching has been, to a large extent, of good quality.' in the Finnish Bachelor’s Graduate Survey (Kandipalaute)",
      Määritelmä_fi: 'Osuus kandipalautteen ”Opetus on ollut mielestäni pääosin laadukasta” vastauksista 4-5',
      Määritelmä_se:
        'Andel som svarat 4 eller 5 på feedbackfrågan ”Undervisningen har i huvudsak varit av god kvalitet.” i Kandidatrespons (Kandipalaute)',
      'Avainluvun nimi_en': 'Quality of teaching',
      'Avainluvun nimi_fi': 'Opetuksen laatu',
      'Avainluvun nimi_se': 'Kvaliteten på undervisningen',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;50;65;80',
      Liikennevalo: true,
      'Ohjelman taso': 'Kandi',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'Percentage of respondents to the Finnish Bachelor’s Graduate Survey (Kandipalaute)',
      Määritelmä_fi: 'Kandipalautteeseen vastanneiden osuus',
      Määritelmä_se: 'Procentuell andel som svarat på',
      'Avainluvun nimi_en': 'Feedback activity',
      'Avainluvun nimi_fi': 'Palauteaktiivisuus',
      'Avainluvun nimi_se': 'Responsaktivitet',
    },
    {
      Kynnysarvot: '0;10;40;80',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;200',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en:
        'Eligible applicants (Candidates with a foreign language) or all applicants (National language studies)',
      Määritelmä_fi: 'Hakukelpoiset hakijat (kv) tai kaikki hakijat (kotimaiskieliset koulutukset)',
      Määritelmä_se:
        'Andelen behöriga sökande (internationella magisterprogram) eller alla sökande (finsk- och svenskspråkiga magisterprogram)',
      'Avainluvun nimi_en': "Eligible applicants for Master's application",
      'Avainluvun nimi_fi': 'Hakijat',
      'Avainluvun nimi_se': 'Sökande',
    },
    {
      Kynnysarvot: '0;1;2;4',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;10',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: "Eligible applicants for the master's programmes/ student places",
      Määritelmä_fi: 'Maisterihaun hakukelpoiset hakijat/ aloituspaikat',
      Määritelmä_se: 'Andelen behöriga sökande till internationella magisterprogram / nybörjarplatser',
      'Avainluvun nimi_en': 'Applications per student place',
      'Avainluvun nimi_fi': 'Hakupaine',
      'Avainluvun nimi_se': 'Ansökningstryck',
    },
    {
      Kynnysarvot: '0;20;30;40',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: 'Intake (both admissions and students transferring from the bachelor’s programmes)',
      Määritelmä_fi: 'Aloituspaikat (opiskelijavalinta + jatkavat)',
      Määritelmä_se: 'Nybörjarplatser (både antagna och studenter som byter från kandidatprogrammen)',
      'Avainluvun nimi_en': 'Intake',
      'Avainluvun nimi_fi': 'Aloituspaikat',
      'Avainluvun nimi_se': 'Totalt intag',
    },
    {
      Kynnysarvot: '0;20;30;40',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: 'Number of new students',
      Määritelmä_fi: 'Opintonsa aloittaneiden määrä',
      Määritelmä_se: 'Antal nya studenter',
      'Avainluvun nimi_en': 'Number of new students',
      'Avainluvun nimi_fi': 'Opintonsa aloittaneet',
      'Avainluvun nimi_se': 'Antal nya studerande',
    },
    {
      Kynnysarvot: '0;15;25;35',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en: "Number of master's degrees completed during the calendar year",
      Määritelmä_fi: 'Kalenverivuoden aikana suoritettujen ylempien korkeakoulututkintojen lukumäärä',
      Määritelmä_se: 'Antal avlagda högskoleexamina under kalenderåret',
      'Avainluvun nimi_en': 'Degrees',
      'Avainluvun nimi_fi': 'Tutkinnot',
      'Avainluvun nimi_se': 'Examen',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;15;30;40',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        'Percentage of graduates within target time of all graduates, as defined in the Ministry of Education and Culture´s funding model.',
      Määritelmä_fi:
        'Tavoiteajassa valmistuneiden osuus kaikista valmistuneista, OKM-rahoitusmallin määritelmän mukaan',
      Määritelmä_se:
        'Andelen utexaminerade inom måltiden av alla utexaminerade, enligt undervisnings- och kulturministeriets definition av finansieringsmodellen',
      'Avainluvun nimi_en': 'Graduation within target time',
      'Avainluvun nimi_fi': 'Tavoiteajassa valmistuminen',
      'Avainluvun nimi_se': 'Utexaminering inom målsatt tid',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '100;60;40;20',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        'Percentage of all graduates graduating more than one year after the target time, as defined in the Ministry of Education and Culture´s funding model.',
      Määritelmä_fi:
        'Yli vuosi tavoiteajassa valmistuneiden osuus kaikista valmistuneista, OKM:n rahoitusmallin määritelmän mukaan',
      Määritelmä_se:
        'Andel av alla utexaminerade som avlagt examen mer än ett år efter måltiden, enligt utbildnings- och kulturministeriets finansieringsmodell.',
      'Avainluvun nimi_en': 'Graduation after target time',
      'Avainluvun nimi_fi': 'Valmistuminen tavoiteajan jälkeen',
      'Avainluvun nimi_se': 'Utexaminering efter målsatt tid',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '100;35;25;15',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en:
        "Share of students who have registered for more than five academic years (bachelor and master's study right) or two academic years (only  master's study right). Date of review 20.9. Students who began their studies before 1 August 2017 will not be taken into consideration.",
      Määritelmä_fi:
        'Läsnäolevaksi ilmoittautuneista yli viisi (kandi+maisteri) tai kaksi (maisteri) lukuvuotta opiskelleiden osuus. Tarkastelupäivämäärä 20.9. Siirtyneet eivät mukana.',
      Määritelmä_se:
        'Andel studenter som har registrerat sig för mer än fem läsår (kandidat- och magisterstudierätt) eller två läsår (endast magisterstudierätt). Datum för granskning 20.9. Studenter som påbörjat sina studier före den 1 augusti 2017 kommer inte att beaktas.',
      'Avainluvun nimi_en': 'Accumalation of students',
      'Avainluvun nimi_fi': 'Läsnäolevien kasautuminen',
      'Avainluvun nimi_se': 'Ackumulering av antalet studenter',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;20;40;60',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'HowULearn 3 survey: Share of dimensional values between 4 and 5',
      Määritelmä_fi: 'HowULearn 3 kysely: Osuus ulottuvuuden arvoista välillä 4-5',
      Määritelmä_se: 'HowULearn 3 enkät: andel dimensionsvärden mellan 4-5',
      'Avainluvun nimi_en': 'Constructive alignment of teaching',
      'Avainluvun nimi_fi': 'Opetuksen linjakkuus',
      'Avainluvun nimi_se': 'Konstruktivt samordnad undervisning',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;15;30;50',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'HowULearn 3 survey: Share of dimensional values between 4 and 5',
      Määritelmä_fi: 'HowULearn 3 kysely: Osuus ulottuvuuden arvoista välillä 4-5',
      Määritelmä_se: 'HowULearn 3 enkät: andel dimensionsvärden mellan 4-5',
      'Avainluvun nimi_en': 'Constructive feedback',
      'Avainluvun nimi_fi': 'Oppimista edistävä palaute',
      'Avainluvun nimi_se': 'Respons som stöd för lärande',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;30;50;70',
      Liikennevalo: true,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '0;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'HowULearn 3 survey: Share of dimensional values between 4 and 5',
      Määritelmä_fi: 'HowULearn 3 kysely: Osuus ulottuvuuden arvoista välillä 4-5',
      Määritelmä_se: 'HowULearn 3 enkät: andel dimensionsvärden mellan 4-5',
      'Avainluvun nimi_en': 'Interest and relevance of studies',
      'Avainluvun nimi_fi': 'Opintojen kiinnostavuus',
      'Avainluvun nimi_se': 'Hur engagerande är undervisningen?',
    },
    {
      Yksikkö: '%',
      Kynnysarvot: '0;80;90;95',
      Liikennevalo: false,
      'Ohjelman taso': 'Maisteri',
      'Mittarin rajat': '50;100',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'Employment one year after graduation, percentage',
      Määritelmä_fi: 'Työllistyminen vuosi valmistumisen jälkeen, osuus',
      Määritelmä_se: 'Sysselsättning ett år efter utexaminering',
      'Avainluvun nimi_en': 'Employment',
      'Avainluvun nimi_fi': 'Työllistyminen',
      'Avainluvun nimi_se': 'Sysselsättning',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Kandi',
      Arviointialue_en: 'Use of resources',
      Arviointialue_fi: 'Resurssien käyttö',
      Arviointialue_se: 'Resursanvändning',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Maisteri',
      Arviointialue_en: 'Use of resources',
      Arviointialue_fi: 'Resurssien käyttö',
      Arviointialue_se: 'Resursanvändning',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Tohtori',
      Arviointialue_en: 'Attractiveness',
      Arviointialue_fi: 'Vetovoimaisuus',
      Arviointialue_se: 'Attraktionskraft',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Tohtori',
      Arviointialue_en: 'Smooth progress of studies and graduation',
      Arviointialue_fi: 'Opintojen sujuvuus ja valmistuminen',
      Arviointialue_se: 'Smidiga studier och utexaminering',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Tohtori',
      Arviointialue_en: 'Feedback and employment',
      Arviointialue_fi: 'Palaute ja työllistyminen',
      Arviointialue_se: 'Feedback och sysselsättning',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
    {
      Liikennevalo: false,
      'Ohjelman taso': 'Tohtori',
      Arviointialue_en: 'Use of resources',
      Arviointialue_fi: 'Resurssien käyttö',
      Arviointialue_se: 'Resursanvändning',
      Määritelmä_en: 'Coming in 2026',
      Määritelmä_fi: 'Tulossa 2026',
      Määritelmä_se: 'Kommer 2026',
      'Avainluvun nimi_en': 'Coming in 2026',
      'Avainluvun nimi_fi': 'Tulossa 2026',
      'Avainluvun nimi_se': 'Kommer 2026',
    },
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
      Palauteaktiivisuus: 0.9,
      // Muut
      Vuosi: 2023,
    },

    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_006',
      'Koulutusohjelman nimi': 'Geotieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 0,
      'Ensisijaiset hakijat': 1,
      'Aloituspaikkojen täyttö': 0.1,
      'Opintonsa aloittaneet': 1,
      Tutkinnot: 100,
      'Tavoiteajassa valmistuminen': 0.8,
      'Opintojen eteneminen': 0.8,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': 0.8,
      'Opintojen ohjaus': 0.8,
      'Opetuksen laatu': 0.8,
      Palauteaktiivisuus: 0.6,

      // Muut
      Vuosi: 2023, // testing year cap is 2024 so the keydata year has to be 2024-1
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_005',
      'Koulutusohjelman nimi': 'Tietojenkäsittelytieteen kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 9.0,
      'Ensisijaiset hakijat': 250,
      'Aloituspaikkojen täyttö': 0.99,
      'Opintonsa aloittaneet': 70,
      Tutkinnot: 10,
      'Tavoiteajassa valmistuminen': 0.25,
      'Opintojen eteneminen': 0.25,
      'Läsnäolevien kasautuminen': 0.25,
      'Opiskelijoiden hyvinvointi': 0,
      'Opintojen ohjaus': 0,
      'Opetuksen laatu': 0,
      Palauteaktiivisuus: 0.9,
      // Muut
      Vuosi: 2024,
    },

    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_006',
      'Koulutusohjelman nimi': 'Geotieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 0,
      'Ensisijaiset hakijat': 1,
      'Aloituspaikkojen täyttö': 0.1,
      'Opintonsa aloittaneet': 1,
      Tutkinnot: 100,
      'Tavoiteajassa valmistuminen': 0.8,
      'Opintojen eteneminen': 0.8,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': 0.8,
      'Opintojen ohjaus': 0.8,
      'Opetuksen laatu': 0.8,
      Palauteaktiivisuus: 0.6,

      // Muut
      Vuosi: 2024, // testing year cap is 2024 so the keydata year has to be 2024-1
    },

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
      Palauteaktiivisuus: 0.9,
      // Muut
      Vuosi: 2025,
    },

    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_006',
      'Koulutusohjelman nimi': 'Geotieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 0,
      'Ensisijaiset hakijat': 1,
      'Aloituspaikkojen täyttö': 0.1,
      'Opintonsa aloittaneet': 1,
      Tutkinnot: 100,
      'Tavoiteajassa valmistuminen': 0.8,
      'Opintojen eteneminen': 0.8,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': 0.8,
      'Opintojen ohjaus': 0.8,
      'Opetuksen laatu': 0.8,
      Palauteaktiivisuus: 0.6,

      // Muut
      Vuosi: 2025, // testing year cap is 2024 so the keydata year has to be 2024-1
    },
    // KH50_002 is used for color history tests; please don't modify these values or the tests will break
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_002',
      'Koulutusohjelman nimi': 'Fysikaalisten tieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 0, // red
      'Ensisijaiset hakijat': 150, // yellow
      'Aloituspaikkojen täyttö': 0.97, // lightgreen
      'Opintonsa aloittaneet': 80, // green
      Tutkinnot: undefined,
      'Tavoiteajassa valmistuminen': 0,
      'Opintojen eteneminen': undefined,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': 0.1,
      'Opintojen ohjaus': 0,
      'Opetuksen laatu': 0,
      Palauteaktiivisuus: 0,

      // Muut
      Vuosi: 2022,
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_002',
      'Koulutusohjelman nimi': 'Fysikaalisten tieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 6,
      'Ensisijaiset hakijat': 200,
      'Aloituspaikkojen täyttö': 1,
      'Opintonsa aloittaneet': 80,
      Tutkinnot: undefined,
      'Tavoiteajassa valmistuminen': undefined,
      'Opintojen eteneminen': 0.6,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': undefined,
      'Opintojen ohjaus': undefined,
      'Opetuksen laatu': undefined,
      Palauteaktiivisuus: undefined,

      // Muut
      Vuosi: 2023,
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_002',
      'Koulutusohjelman nimi': 'Fysikaalisten tieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 6,
      'Ensisijaiset hakijat': 200,
      'Aloituspaikkojen täyttö': 1,
      'Opintonsa aloittaneet': 80,
      Tutkinnot: 80,
      'Tavoiteajassa valmistuminen': 0.6,
      'Opintojen eteneminen': 0.6,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': undefined,
      'Opintojen ohjaus': undefined,
      'Opetuksen laatu': undefined,
      Palauteaktiivisuus: undefined,

      // Muut
      Vuosi: 2024,
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'KH50_002',
      'Koulutusohjelman nimi': 'Fysikaalisten tieteiden kandiohjelma',

      // Kandiohjelman avainluvut
      Hakupaine: 6,
      'Ensisijaiset hakijat': 200,
      'Aloituspaikkojen täyttö': 1,
      'Opintonsa aloittaneet': 80,
      Tutkinnot: undefined,
      'Tavoiteajassa valmistuminen': undefined,
      'Opintojen eteneminen': 0.6,
      'Läsnäolevien kasautuminen': 0.1,
      'Opiskelijoiden hyvinvointi': undefined,
      'Opintojen ohjaus': undefined,
      'Opetuksen laatu': undefined,
      Palauteaktiivisuus: undefined,

      // Muut
      Vuosi: 2025,
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

      // Muut
      Vuosi: 2023,
      Lisätietoja_fi: 'Lakkautettu ohjelma',
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'MH40_015',
      'Koulutusohjelman nimi': 'Historian maisteriohjelma',

      // Maisteriohjelman avainluvut
      Hakijat: 20,
      Hakupaine: 1.2,
      Aloituspaikat: 22,
      'Opintonsa aloittaneet': 22,
      Tutkinnot: 22,
      'Tavoiteajassa valmistuminen': 0.22,
      'Valmistuminen tavoiteajan jälkeen': 0.22,
      'Läsnäolevien kasautuminen': 0.22,
      'Opetuksen linjakkuus': 0.22,
      'Oppimista edistävä palaute': 0.22,
      'Opintojen kiinnostavuus': 0.44,
      Työllistyminen: 0,

      // Muut
      Vuosi: 2023,
    },
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

      // Muut
      Vuosi: 2024,
      Lisätietoja_fi: 'Lakkautettu ohjelma',
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'MH40_015',
      'Koulutusohjelman nimi': 'Historian maisteriohjelma',

      // Maisteriohjelman avainluvut
      Hakijat: 20,
      Hakupaine: 1.2,
      Aloituspaikat: 22,
      'Opintonsa aloittaneet': 22,
      Tutkinnot: 22,
      'Tavoiteajassa valmistuminen': 0.22,
      'Valmistuminen tavoiteajan jälkeen': 0.22,
      'Läsnäolevien kasautuminen': 0.22,
      'Opetuksen linjakkuus': 0.22,
      'Oppimista edistävä palaute': 0.22,
      'Opintojen kiinnostavuus': 0.44,
      Työllistyminen: 0,

      // Muut
      Vuosi: 2024,
    },

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

      // Muut
      Vuosi: 2025,
      Lisätietoja_fi: 'Lakkautettu ohjelma',
    },
    {
      // Perustiedot
      'Koulutusohjelman koodi': 'MH40_015',
      'Koulutusohjelman nimi': 'Historian maisteriohjelma',

      // Maisteriohjelman avainluvut
      Hakijat: 20,
      Hakupaine: 1.2,
      Aloituspaikat: 22,
      'Opintonsa aloittaneet': 22,
      Tutkinnot: 22,
      'Tavoiteajassa valmistuminen': 0.22,
      'Valmistuminen tavoiteajan jälkeen': 0.22,
      'Läsnäolevien kasautuminen': 0.22,
      'Opetuksen linjakkuus': 0.22,
      'Oppimista edistävä palaute': 0.22,
      'Opintojen kiinnostavuus': 0.44,
      Työllistyminen: 0,

      // Muut
      Vuosi: 2025,
    },
  ],
}

const resetDocuments = async (req, res) => {
  try {
    logger.info('Cypress::resetDocuments')
    await Document.destroy({ where: {} })
    return res.status(200).send('OK')
  } catch (error) {
    logger.error(`Database error: ${error}`)
    return res.status(500).json({ error: 'Database error' })
  }
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

export default { seed, createAnswers, createFacultyAnswers, initKeyData, resetDocuments }
